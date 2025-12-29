export const RecommendationEngine = (data) => {
    let recommendations = {
        title: "Recommended Configuration",
        gpu: "Entry Level",
        vram: "8GB",
        ram: "16GB",
        cpu: "Modern 6-core",
        notes: [],
        software: [],
        models: []
    };

    const isEnterprise = data.userType === 'organization';
    // If not enterprise, force concurrent users to 1 (even if data has old value)
    const concurrentUsers = isEnterprise ? (parseInt(data.concurrentUsers) || 1) : 1;

    const hasImageGen = data.useCases.includes('image_gen');
    const hasVideo = data.useCases.includes('video');
    const hasDev = data.useCases.includes('dev_support');
    const hasRag = data.useCases.includes('rag');
    const hasAudio = data.useCases.includes('transcribe') || data.useCases.includes('speech');
    const hasChat = data.useCases.includes('chat') || hasDev || hasRag;

    // --- Hardware Logic ---
    if (isEnterprise || concurrentUsers > 1) {
        recommendations.title = "Enterprise Server Solution";
        recommendations.cpu = "AMD EPYC or Dual Xeon Gold";
        recommendations.ram = `${Math.max(64, concurrentUsers * 16)}GB ECC`;

        if (concurrentUsers <= 5) {
            recommendations.gpu = "NVIDIA A4000 / A5000 or 2x RTX 4090";
            recommendations.vram = "24GB+";
        } else {
            recommendations.gpu = "NVIDIA A100 / H100 or Multiple A6000s";
            recommendations.vram = "48GB - 80GB+";
        }
        recommendations.notes.push("For multi-user environments, VRAM is shared. Dedicated server GPUs offer virtualization support (vGPU).");

        // Enterprise Software
        recommendations.software.push(
            { name: "vLLM", link: "https://github.com/vllm-project/vllm", desc: "High-performance inference engine for serving models." },
            { name: "Open WebUI", link: "https://github.com/open-webui/open-webui", desc: "ChatGPT-like interface for multiple users." }
        );

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

        // Single User Software
        if (hasChat || hasRag) {
            recommendations.software.push({ name: "Ollama", link: "https://ollama.com/", desc: "Easiest way to run LLMs locally." });
            recommendations.software.push({ name: "LM Studio", link: "https://lmstudio.ai/", desc: "GUI for discovering and running models." });
        }
    }

    // --- Task Specific Software & Models ---

    if (hasChat || hasDev) {
        if (recommendations.vram.includes("24GB") || isEnterprise) {
            recommendations.models.push({ name: "Llama 3.1 70B", type: "LLM", link: "https://huggingface.co/meta-llama/Meta-Llama-3.1-70B", desc: "State-of-the-art open model. Requires dual GPU or high quantization." });
            recommendations.models.push({ name: "Qwen 2.5 72B", type: "LLM", link: "https://huggingface.co/Qwen/Qwen2.5-72B-Instruct", desc: "Excellent reasoning capabilities." });
            recommendations.models.push({ name: "DeepSeek Coder V2", type: "Code", link: "https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Instruct", desc: "Top tier coding model." });
        } else if (recommendations.vram.includes("12GB") || recommendations.vram.includes("16GB")) {
            recommendations.models.push({ name: "Mistral NeMo 12B", type: "LLM", link: "https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407", desc: "Great balance of size and performance." });
            recommendations.models.push({ name: "Qwen 2.5 14B", type: "LLM", link: "https://huggingface.co/Qwen/Qwen2.5-14B-Instruct", desc: "Strong reasoning for mid-range cards." });
        } else {
            recommendations.models.push({ name: "Llama 3.1 8B", type: "LLM", link: "https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct", desc: "Fast and capable, runs on almost anything." });
            recommendations.models.push({ name: "Gemma 2 9B", type: "LLM", link: "https://huggingface.co/google/gemma-2-9b-it", desc: "Google's open weight model." });
        }
    }

    if (hasDev) {
        recommendations.software.push({ name: "Continue.dev", link: "https://continue.dev/", desc: "VS Code extension for local AI coding." });
    }

    if (hasRag) {
        recommendations.software.push({ name: "AnythingLLM Desktop", link: "https://useanything.com/", desc: "All-in-one RAG solution." });
        recommendations.software.push({ name: "PrivateGPT", link: "https://github.com/zylon-ai/private-gpt", desc: "Privacy-focused RAG." });
        recommendations.models.push({ name: "nomic-embed-text", type: "Embedding", link: "https://huggingface.co/nomic-ai/nomic-embed-text-v1.5", desc: "High quality embedding model." });
    }

    if (hasImageGen) {
        if (!isEnterprise) {
            recommendations.software.push({ name: "ComfyUI", link: "https://github.com/comfyanonymous/ComfyUI", desc: "Node-based workflow editor, best for power users." });
            recommendations.software.push({ name: "Fooocus", link: "https://github.com/lllyasviel/Fooocus", desc: "Midjourney-like easy to use interface." });
        }

        if (recommendations.vram.includes("24GB") || isEnterprise) {
            recommendations.models.push({ name: "Flux.1 [dev/schnell]", type: "Image", link: "https://huggingface.co/black-forest-labs/FLUX.1-dev", desc: "Current SOTA open image model." });
        } else {
            recommendations.models.push({ name: "SDXL Lightning", type: "Image", link: "https://huggingface.co/ByteDance/SDXL-Lightning", desc: "Fast generation, lower VRAM usage." });
        }
    }

    if (hasVideo) {
        recommendations.models.push({ name: "SVD", type: "Video", link: "https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt", desc: "Short video generation." });
        recommendations.models.push({ name: "CogVideoX", type: "Video", link: "https://huggingface.co/THUDM/CogVideoX-2b", desc: "Text-to-video model." });
    }

    if (hasAudio) {
        recommendations.models.push({ name: "Whisper (large-v3)", type: "Audio", link: "https://huggingface.co/openai/whisper-large-v3", desc: "Industry standard for transcription." });
    }

    return recommendations;
};
