import modelsData from '../data/models.json';
import workstationsData from '../data/hardware-workstations.json';
import serversData from '../data/hardware-servers.json';
import softwareData from '../data/software.json';

export const RecommendationEngine = (data) => {
    let recommendations = {
        title: "Recommended Configuration",
        gpu: "N/A",
        vram: "N/A",
        ram: "N/A",
        cpu: "N/A",
        notes: [],
        software: [],
        models: []
    };

    const isEnterprise = data.userType === 'organization';
    const concurrentUsers = isEnterprise ? (parseInt(data.concurrentUsers) || 1) : 1;
    const budget = data.budget || 5000;

    // For enterprise, default to linux if not specified
    let preferredOS = isEnterprise ? 'linux' : (data.os || 'linux');

    // --- 1. Identify Tags ---
    let tagsToMatch = [];
    if (data.useCases.includes('chat')) tagsToMatch.push('chat');
    if (data.useCases.includes('dev_support')) tagsToMatch.push('coding');
    if (data.useCases.includes('rag')) tagsToMatch.push('rag');
    if (data.useCases.includes('image_gen')) tagsToMatch.push('image_gen');
    if (data.useCases.includes('video')) tagsToMatch.push('video');
    if (data.useCases.includes('transcribe') || data.useCases.includes('speech')) tagsToMatch.push('transcribe');

    // --- 2. Select Hardware (Budget & OS Driven) ---

    let selectedHardware = null;
    let selectedGpusCount = 1;
    let finalOS = preferredOS;

    const calculatePrice = (hw, count) => {
        return (hw.base_price || 0) + ((hw.gpu_price || 0) * count);
    };

    const supportsOS = (hw, os) => {
        if (!hw.supported_os) return true;
        return hw.supported_os.includes(os);
    }

    // Helper to find all valid configs sorted by VRAM desc, Price asc
    const getCandidates = (dataset, targetOS) => {
        let candidates = [];
        for (const hw of dataset) {
            if (!supportsOS(hw, targetOS)) continue;

            if (hw.isUnifiedMemory) {
                // Unified
                const price = calculatePrice(hw, 1);
                if (price <= budget) {
                    candidates.push({ hw, count: 1, vram: hw.vram_per_gpu, price });
                }
            } else {
                // Scalable
                for (let count = hw.min_gpus; count <= hw.max_gpus; count++) {
                    const price = calculatePrice(hw, count);
                    if (price <= budget) {
                        candidates.push({ hw, count, vram: count * hw.vram_per_gpu, price });
                    }
                }
            }
        }

        // Sort: Highest VRAM first. If tie, Lowest Price.
        candidates.sort((a, b) => {
            if (b.vram !== a.vram) return b.vram - a.vram;
            return a.price - b.price;
        });

        return candidates;
    };

    let candidates = [];
    if (isEnterprise) {
        finalOS = 'linux';
        candidates = getCandidates(serversData, 'linux');
    } else {
        candidates = getCandidates(workstationsData, preferredOS);

        if (candidates.length === 0 && preferredOS !== 'linux') {
            // Fallback to Linux
            const linuxCandidates = getCandidates(workstationsData, 'linux');
            if (linuxCandidates.length > 0) {
                candidates = linuxCandidates;
                finalOS = 'linux';
                recommendations.notes.push(`${preferredOS.charAt(0).toUpperCase() + preferredOS.slice(1)} hardware not found within budget or spec. Defaulting to Linux options.`);
            }
        }
    }

    let totalSystemVram = 0;

    if (candidates.length > 0) {
        const best = candidates[0];
        selectedHardware = best.hw;
        selectedGpusCount = best.count;
        totalSystemVram = best.vram;
    } else {
        recommendations.notes.push("No hardware configurations found within this budget. Please increase your budget.");
        return recommendations;
    }

    // --- 3. Select Models (Capacity & Arch Driven) ---

    let candidateModels = modelsData.filter(m => {
        const tagsMatch = m.tags.some(t => tagsToMatch.includes(t));

        // Resolve Architecture
        let arch = selectedHardware.tensor_architecture;
        if (!arch) {
            // Fallback logic if property missing
            if (finalOS === 'mac' || (selectedHardware.supported_os && selectedHardware.supported_os.includes('mac'))) arch = 'mac';
            else arch = 'nvidia';
        }

        const compatMatch = m.compatibility ? m.compatibility.includes(arch) : true;
        return tagsMatch && compatMatch;
    });

    const groupedModels = {};
    candidateModels.forEach(m => {
        if (!groupedModels[m.type]) groupedModels[m.type] = [];
        groupedModels[m.type].push(m);
    });

    Object.keys(groupedModels).forEach(type => {
        const models = groupedModels[type];
        models.sort((a, b) => b.baseSizeGB - a.baseSizeGB);

        let selected = null;
        let maxContextLines = 0;

        for (const m of models) {
            let requiredSize = m.baseSizeGB;
            // Removed input overhead calc here, we check base fit first

            // Safety margin
            let safetyMargin = selectedHardware.isUnifiedMemory ? 16 : 4;
            if (totalSystemVram <= 16) safetyMargin = 2;
            if (totalSystemVram <= 8) safetyMargin = 1;

            if (requiredSize + safetyMargin <= totalSystemVram) {
                const freeVram = totalSystemVram - requiredSize - safetyMargin;
                selected = { ...m, estSize: requiredSize.toFixed(1) };

                if (['LLM', 'Code'].includes(m.type)) {
                    // Calculate max context
                    let unit = "LoC"; // Lines of Code
                    let vramFactor = 900; // Units per GB VRAM (Hardware Limit)
                    let itemsPerToken = 1 / 200; // Placeholder defaults to avoid crash if logic fails

                    // Conversion Constants:
                    // 1 Token = 4 Chars
                    // 1 Word = 6 Chars -> 1.5 Tokens (4/6 is wrong way? 6 chars = 1.5 * 4 chars)
                    // Wait: 1 Token (4c). 1 Word (6c). 
                    // Words = Tokens * (4/6) = Tokens * 0.666
                    // LoC = Tokens * (4/50) = Tokens * 0.08

                    if (m.type === 'LLM') {
                        unit = "Words";
                        vramFactor = 7500; // Hardware limit (Words/GB)
                    }

                    // 1. Hardware Limit
                    let hardwareCapacity = Math.floor(freeVram * vramFactor);
                    if (hardwareCapacity < 0) hardwareCapacity = 0;

                    // 2. Model Limit (if available)
                    let finalCapacity = hardwareCapacity;

                    if (m.max_context_length) {
                        let modelLimit = 0;
                        if (m.type === 'LLM') {
                            // Tokens -> Words
                            // 1 Token = 4 chars. 1 Word = 6 chars.
                            // Words = Tokens * (4/6)
                            modelLimit = Math.floor(m.max_context_length * (4 / 6));
                        } else {
                            // Tokens -> LoC
                            // 1 LoC = 50 chars.
                            // LoC = Tokens * (4/50)
                            modelLimit = Math.floor(m.max_context_length * (4 / 50));
                        }

                        finalCapacity = Math.min(hardwareCapacity, modelLimit);
                    }

                    // 3. Sig Digits (Round down to 2 significant figures)
                    // e.g. 15432 -> 15000. 8192 -> 8100.
                    if (finalCapacity > 0) {
                        const magnitude = Math.pow(10, Math.floor(Math.log10(finalCapacity)));
                        // We want 2 sig figs. magnitude is e.g. 10000 for 12345.
                        // We want to work with 10^(digits-2).
                        // Easier: 
                        // String manip or math.
                        // Math:
                        // precision = 2
                        // factor = 10 ^ (digits - precision)
                        // round(num / factor) * factor

                        const digits = Math.floor(Math.log10(finalCapacity)) + 1;
                        if (digits > 2) {
                            const factor = Math.pow(10, digits - 2);
                            finalCapacity = Math.floor(finalCapacity / factor) * factor;
                        }
                    }

                    selected.maxContextDisplay = `${finalCapacity.toLocaleString()} ${unit}`;
                }
                break;
            }
        }

        if (selected) {
            recommendations.models.push(selected);
        } else {
            recommendations.notes.push(`Could not find a suitable ${type} model that fits in ${totalSystemVram}GB VRAM.`);
        }
    });


    // --- 4. Select Software ---
    const relevantSoftware = softwareData.filter(sw => {
        const matchesTags = sw.tags.some(t => tagsToMatch.includes(t));
        const matchesOS = sw.compatibility.includes(finalOS);
        return matchesTags && matchesOS;
    });
    recommendations.software = relevantSoftware;

    // --- 5. Finalize Output ---
    recommendations.title = selectedHardware.name;

    if (selectedHardware.isUnifiedMemory) {
        recommendations.gpu = selectedHardware.gpu_model;
        recommendations.vram = "Shared";
        recommendations.ram = selectedHardware.ram;
    } else {
        recommendations.gpu = `${selectedGpusCount}x ${selectedHardware.gpu_model}`;
        recommendations.vram = `${selectedGpusCount * selectedHardware.vram_per_gpu}GB`;
        recommendations.ram = selectedHardware.ram;
    }
    recommendations.cpu = selectedHardware.cpu;

    if (isEnterprise && concurrentUsers > 1) {
        recommendations.notes.push(`Configuration for ${concurrentUsers} concurrent users.`);
    }

    return recommendations;
};
