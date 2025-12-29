export const RecommendationEngine = (data) => {
    let recommendations = {
        title: "Recommended Configuration",
        gpu: "Entry Level",
        vram: "8GB",
        ram: "16GB",
        cpu: "Modern 6-core",
        notes: []
    };

    const isEnterprise = data.userType === 'organization';
    const concurrentUsers = parseInt(data.concurrentUsers) || 1;

    // Use Case Weights (rough estimation of VRAM impact)
    const hasImageGen = data.useCases.includes('image_gen');
    const hasVideo = data.useCases.includes('video');
    const hasDev = data.useCases.includes('dev_support');
    const hasRag = data.useCases.includes('rag');
    const hasLLM = data.useCases.includes('chat') || hasDev || hasRag;

    // Logic Tree
    if (isEnterprise || concurrentUsers > 1) {
        recommendations.title = "Enterprise Server Solution";
        recommendations.cpu = "AMD EPYC or Dual Xeon Gold";
        recommendations.ram = `${Math.max(64, concurrentUsers * 16)}GB ECC`;

        if (concurrentUsers <= 5) {
            recommendations.gpu = "NVIDIA A4000 / A5000 or 2x RTX 4090 (if setup allows)";
            recommendations.vram = "24GB+";
        } else {
            recommendations.gpu = "NVIDIA A100 / H100 or Multiple A6000s";
            recommendations.vram = "48GB - 80GB+";
        }
        recommendations.notes.push("For multi-user environments, VRAM is shared. Dedicated server GPUs offer virtualization support (vGPU).");

    } else {
        // Single User Workstation
        recommendations.title = "Local AI Workstation";

        if (hasVideo) {
            recommendations.gpu = "NVIDIA RTX 4090";
            recommendations.vram = "24GB";
            recommendations.ram = "64GB";
            recommendations.cpu = "Intel i9 or AMD Ryzen 9";
            recommendations.notes.push("Video generation is extremely VRAM intensive.");
        } else if (hasImageGen || hasDev) {
            recommendations.gpu = "NVIDIA RTX 4080 or 4090";
            recommendations.vram = "16GB - 24GB";
            recommendations.ram = "32GB";
            recommendations.cpu = "Intel i7 or AMD Ryzen 7";
        } else if (hasRag) {
            recommendations.gpu = "NVIDIA RTX 4060 Ti (16GB) or 4070";
            recommendations.vram = "12GB - 16GB";
            recommendations.ram = "32GB";
            recommendations.notes.push("RAG requires loading embedding models + LLM. 16GB VRAM is sweet spot for mid-sized models.");
        } else {
            // Basic Chat / Transcribe
            recommendations.gpu = "NVIDIA RTX 3060 / 4060";
            recommendations.vram = "8GB - 12GB";
            recommendations.ram = "16GB";
            recommendations.cpu = "Intel i5 or AMD Ryzen 5";
        }
    }

    return recommendations;
};
