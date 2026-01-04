import React from 'react';

export default function ITAdmin() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--color-primary)' }}>Technical Deep Dive</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                    Architecture, Hardware Requirements, and Software Stack.
                </p>
            </div>

            <div className="card">
                <h2 style={{ color: 'var(--color-primary)' }}>Hardware Requirements</h2>
                <p>Running LLMs locally is primarily bound by <strong>VRAM (Video RAM)</strong> and <strong>Memory Bandwidth</strong>, not Compute (FLOPS).</p>

                <h3 style={{ color: 'var(--color-text-main)' }}>VRAM is King</h3>
                <p>The entire model weights must fit into the GPU VRAM for fast inference. If they offload to system RAM, speed drops by 10-50x.</p>
                <ul style={{ background: '#f8fafc', padding: '1rem 2rem', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                    <li><strong>FP16 / BF16 (Full Precision):</strong> Requires 2GB VRAM per 1 Billion Parameters.</li>
                    <li><strong>Int8 (Quantized):</strong> Requires 1GB VRAM per 1 Billion Parameters.</li>
                    <li><strong>Int4 (Quantized - Standard):</strong> Requires 0.7GB VRAM per 1 Billion Parameters (negligible quality loss).</li>
                    <li><strong>Context Window:</strong> Needs additional VRAM (KV Cache). ~1GB per 8k context size depending on batch size.</li>
                </ul>

                <h3 style={{ marginTop: '1.5rem', color: 'var(--color-text-main)' }}>Multi-GPU & Tensor Parallelism</h3>
                <p>
                    If a model is too large for a single GPU (e.g., Llama 3 70B needs ~40GB VRAM), we use <strong>Tensor Parallelism</strong> to split the model across multiple GPUs.
                    This requires high interconnect bandwidth (PCIe 4.0/5.0 x16 or NVLink) to be effective.
                </p>
            </div>

            <div className="card">
                <h2 style={{ color: 'var(--color-primary)' }}>The Software Stack</h2>
                <p>We recommend industry-standard open-source tools that are production-ready.</p>

                <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <div style={{ border: '1px solid var(--color-border)', padding: '1rem', borderRadius: '6px' }}>
                        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--color-accent)' }}>Inference Engine</h3>
                        <p style={{ margin: 0 }}>
                            <strong>Ollama</strong> (for simple setups) or <strong>vLLM</strong> (for high-throughput server deployments).
                            These manage the model, handle queuing, and provide an OpenAI-compatible API endpoint.
                        </p>
                    </div>
                    <div style={{ border: '1px solid var(--color-border)', padding: '1rem', borderRadius: '6px' }}>
                        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--color-accent)' }}>User Interface</h3>
                        <p style={{ margin: 0 }}>
                            <strong>Open WebUI</strong>. A clone of the ChatGPT interface that connects to your local inference engine.
                            Supports Retrieval Augmented Generation (RAG) for document search out of the box.
                        </p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 style={{ color: 'var(--color-primary)' }}>Integration</h2>
                <p>
                    Most local stacks provide an <strong>OpenAI-compatible API</strong> (`/v1/chat/completions`).
                    This means you can point almost any existing AI-enabled software (VS Code plugins, internal tools, scripts)
                    to your local server simply by changing the `BASE_URL` and processing data locally.
                </p>
            </div>
        </div>
    );
}
