import React, { useState } from 'react';

const useCasesData = [
    {
        id: 'chat',
        title: 'Chat with AI',
        description: 'Engaging in natural language conversations with Large Language Models (LLMs) is the foundation of modern local AI. This goes beyond simple Q&A; it includes complex reasoning, code analysis, document summarization, and creative writing. By running these models locally, you ensure that your private data and sensitive conversations never leave your hardware, bypassing the privacy concerns and subscription costs associated with cloud-based services like ChatGPT.',
        typicalStack: 'A complete local chat solution requires three layers: (1) The Model Backend (Ollama) which manages the lifecycle of the AI models and provides the computational "engine" via an API. (2) The Frontend Interface (Open WebUI) which connects to that API to provide a professional user experience with chat history, file uploads for analysis, and markdown rendering. (3) The AI Model (e.g., Llama 3) which contains the actual learned knowledge.',
        software: [
            { name: 'Ollama', link: 'https://ollama.com/', desc: 'Backend Provider: The industry standard for managing and serving LLMs locally with a simple CLI and robust API.' },
            { name: 'Open WebUI', link: 'https://github.com/open-webui/open-webui', desc: 'Frontend Interface: The premier self-hosted UI that brings a ChatGPT-equivalent experience to your local Ollama instance.' },
            { name: 'LM Studio', link: 'https://lmstudio.ai/', desc: 'All-in-One: A streamlined desktop application that bundles the backend server and frontend UI into a single download.' }
        ]
    },
    {
        id: 'image_gen',
        title: 'Image Generation',
        description: 'Local image generation allows you to transform text prompts into high-fidelity visuals, artwork, or realistic photographs using Diffusion models. Unlike restricted online generators, local tools offer "Uncensored" creativity, allowing you to use LoRAs (sub-models for specific styles), ControlNets (for precise structural control), and custom checkpoints without limits. It is a powerful tool for designers, artists, and marketing teams who need high-frequency iteration and confidentiality.',
        typicalStack: 'The professional stack involves: (1) The Model Weights (SDXL/Flux) for visual intelligence. (2) A Backend/Engine (ComfyUI) to handle the complex processing. (3) A Creative Interface (Krita with AI Diffusion plugin) to integrate AI directly into a professional painting and layering environment.',
        software: [
            { name: 'Krita AI Diffusion', link: 'https://github.com/Acly/krita-ai-diffusion', desc: 'Creative Interface: Professional AI integration for Krita with real-time painting and layer support.' },
            { name: 'ComfyUI', link: 'https://github.com/comfyanonymous/ComfyUI', desc: 'Workflow Engine: The powerful node-based backend that drives complex image and video generation.' }
        ]
    },
    {
        id: 'video',
        title: 'Video Generation',
        description: 'Generative Video is the next frontier of local AI, enabling the creation of short clips, animations, and cinematic effects from text or static images. This process is computationally intensive and requires significant VRAM. Locally, you can experiment with temporal consistency (ensuring objects stay the same across frames) and complex camera movements that cloud services often simplify or restrict.',
        typicalStack: 'Video generation usually layers on top of image generation: (1) A Temporal Model (Stable Video Diffusion or AnimateDiff) adds the dimension of time and movement. (2) A Workflow Master (ComfyUI) is essential here to manage the massive memory requirements and tile the video frames during processing to avoid "Out of Memory" errors.',
        software: [
            { name: 'ComfyUI (AnimateDiff)', link: 'https://github.com/Kosinkadink/ComfyUI-AnimateDiff-Evolved', desc: 'Integration Tool: Enables the "AnimateDiff" framework within ComfyUI for smooth, high-quality local animations.' },
            { name: 'Stable Video Diffusion', link: 'https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt', desc: 'Base Model: The open-weights standard from Stability AI for high-performance image-to-video generation.' }
        ]
    },
    {
        id: 'speech',
        title: 'Speech Synthesis / TTS',
        description: 'Text-to-Speech (TTS) has evolved from "robotic" voices to human-like speech that can convey emotion and unique character. Local TTS is critical for accessibility tools, automated narration, and creating content for local AI "agents" that can talk back to the user in a natural voice.',
        typicalStack: 'The architecture involves: (1) A Text Analysis Engine that breaks down sentences into phonetic tokens. (2) A Neural Voice Model (trained on thousands of hours of speech data) that predicts the sound of those tokens. (3) A Vocoder that turns those predictions into high-quality audio files (.wav or .mp3).',
        software: [
            { name: 'Piper', link: 'https://github.com/rhasspy/piper', desc: 'Neural Engine: An extremely fast, low-latency TTS system designed to run on everything from Raspberry Pis to workstations.' },
            { name: 'Coqui TTS', link: 'https://github.com/coqui-ai/TTS', desc: 'Deep Learning Engine: A library for advanced researchers and users that supports realistic voice cloning from just a few seconds of audio.' }
        ]
    },
    {
        id: 'transcribe',
        title: 'Audio Transcription (STT)',
        description: 'Speech-to-Text (STT) enables the conversion of spoken audio into written text with stunning accuracy. This is a game-changer for transcribing meetings, creating subtitles, or indexing vast libraries of audio content. Running this locally means your sensitive meeting recordings never leave your control, protecting corporate secrets and personal privacy.',
        typicalStack: 'The setup typically uses: (1) An Audio Pre-processor (FFmpeg) to normalize sound levels and formats. (2) An Inference Engine (Faster-Whisper) which runs the transcription model. (3) The Whisper Model weights (Large-v3 for max accuracy or Medium for speed) which provide the linguistic understanding.',
        software: [
            { name: 'Faster Whisper', link: 'https://github.com/SYSTRAN/faster-whisper', desc: 'Optimized Library: A CTranslate2-based implementation of OpenAI\'s Whisper that is significantly faster and more memory-efficient.' },
            { name: 'Whisper.cpp', link: 'https://github.com/ggerganov/whisper.cpp', desc: 'High-Performance Engine: A standalone C++ implementation designed for maximum speed on CPUs and Apple Silicon.' }
        ]
    },
    {
        id: 'rag',
        title: 'Doc Search (RAG)',
        description: 'Retrieval-Augmented Generation (RAG) is the specialized process of giving an AI a "private brain" filled with your own documents. Instead of the AI guessing based on generic training data, it searches your local PDFs, wikis, and notes to provide factual answers grounded in your specific data. This is essential for researchers, lawyers, and businesses who need the power of AI applied to their internal knowledge bases.',
        typicalStack: 'RAG is a pipeline of four components: (1) Document Parsers to read your files. (2) An Embedding Model to turn text into mathematical vectors. (3) A Vector Database (ChromaDB or LanceDB) to store those vectors for fast searching. (4) An LLM (via Ollama) to read the search results and generate a human-readable answer.',
        software: [
            { name: 'AnythingLLM', link: 'https://useanything.com/', desc: 'Full-Stack Solution: Manages the entire RAG pipeline—from document ingestion and vector storage to the final chat interface.' },
            { name: 'PrivateGPT', link: 'https://github.com/zylon-ai/private-gpt', desc: 'Core Framework: A modular API and interface designed to be the "private" core for document interactions.' },
            { name: 'Verba', link: 'https://github.com/weaviate/Verba', desc: 'Enterprise RAG: A Weaviate-powered application specifically optimized for high-quality retrieval and data grounding.' }
        ]
    },
    {
        id: 'dev_support',
        title: 'Coding / IDE Support',
        description: 'AI-assisted coding has become a vital part of modern software development. Local coding support provides real-time code completion, bug detection, and architectural advice without sending your proprietary source code to a cloud provider. It allows developers to work securely on sensitive company projects while benefiting from the speed of models that are fine-tuned specifically for programming languages.',
        typicalStack: 'The coding stack connects your workspace to the AI: (1) The IDE Extension (Continue.dev) lives inside VS Code or JetBrains and manages the context of your open files. (2) The Local Provider (Ollama) serves a specialized Code-LLM (like Qwen2.5-Coder or DeepSeek-Coder). (3) The Autocomplete Engine handles the sub-second latency required for "ghost text" suggestions as you type.',
        software: [
            { name: 'Continue.dev', link: 'https://continue.dev/', desc: 'IDE Plugin: The open-source bridge that connects your code editor to any local or remote AI model provider.' },
            { name: 'Ollama', link: 'https://ollama.com/', desc: 'Model Provider: Used to serve code-specialized models that understand complex logic and syntax across hundreds of languages.' },
            { name: 'Tabby', link: 'https://github.com/TabbyML/tabby', desc: 'Self-Hosted Backend: A dedicated server designed to provide a low-latency, self-hosted alternative to GitHub Copilot.' }
        ]
    }
];

export default function UseCases() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>AI Use Cases & Software</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {useCasesData.map((useCase, index) => (
                    <div
                        key={useCase.id}
                        className="card"
                        style={{
                            padding: 0,
                            overflow: 'hidden',
                            border: openIndex === index ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                            transition: 'all 0.2s ease',
                            borderRadius: '6px'
                        }}
                    >
                        <button
                            onClick={() => toggleAccordion(index)}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1.2rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: openIndex === index ? 'var(--color-primary)' : 'var(--color-surface)',
                                color: openIndex === index ? 'white' : 'var(--color-text-main)',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span>{useCase.title}</span>
                            <span style={{
                                transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                fontSize: '0.7rem'
                            }}>
                                ▼
                            </span>
                        </button>

                        {openIndex === index && (
                            <div style={{ padding: '1.5rem', background: 'var(--color-surface)', animation: 'slideDown 0.2s ease-out' }}>
                                <p style={{
                                    lineHeight: '1.6',
                                    color: 'var(--color-text-main)',
                                    marginBottom: '1.2rem',
                                    fontSize: '1rem'
                                }}>
                                    {useCase.description}
                                </p>

                                <div style={{
                                    background: '#f1f5f9',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    marginBottom: '1.5rem',
                                    borderLeft: '5px solid var(--color-primary)',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}>
                                    <strong style={{ color: 'var(--color-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <span style={{ fontSize: '1.2rem' }}>⚙️</span> Typical Software Stack
                                    </strong>
                                    <span style={{ fontSize: '0.95rem', color: '#1e293b', lineHeight: '1.5', display: 'block' }}>
                                        {useCase.typicalStack}
                                    </span>
                                </div>

                                <h4 style={{ color: 'var(--color-text-main)', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.4rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>📦</span> Recommended Open Source Software
                                </h4>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.8rem' }}>
                                    {useCase.software.map((sw, swIdx) => (
                                        <div
                                            key={swIdx}
                                            style={{
                                                padding: '1rem',
                                                background: '#f8fafc',
                                                borderRadius: '6px',
                                                border: '1px solid #e2e8f0',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.4rem',
                                                transition: 'transform 0.2s ease',
                                                cursor: 'default'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <a
                                                href={sw.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    fontWeight: '700',
                                                    color: 'var(--color-primary)',
                                                    textDecoration: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    fontSize: '1rem'
                                                }}
                                                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                            >
                                                {sw.name} <span style={{ fontSize: '0.75rem' }}>🔗</span>
                                            </a>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>
                                                {sw.desc}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
