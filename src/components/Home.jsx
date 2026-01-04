import React from 'react';

export default function Home() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ padding: '3rem 1rem', textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    display: 'inline-block',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '0.4rem 1rem',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    Beta
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-primary)', margin: '0 auto 1rem' }}>
                    Sovereign AI within your Organization
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Secure, compliant, and cost-effective Artificial Intelligence on your own infrastructure.
                </p>
            </div>

            <div className="card">
                <h2 style={{ color: 'var(--color-primary)' }}>Why On-Premise AI?</h2>
                <p>
                    Modern Artificial Intelligence usually runs in the cloud, requiring you to send your sensitive data to third-party providers (often outside the EU).
                    <strong> This is no longer necessary.</strong>
                </p>
                <p>
                    By running "Open Weight" models on your own hardware, you gain complete control. These models (like Mistral) are comparable in performance to cloud services but run entirely offline within your building.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                    <div>
                        <h3 style={{ color: 'var(--color-accent)' }}>🔒 Data Sovereignty</h3>
                        <p>No data ever leaves your network. Perfect for classified documents, citizen data, trade secrets, and internal communications.</p>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--color-accent)' }}>🛡️ Full Compliance</h3>
                        <p>Simplifies DSGVO / GDPR compliance significantly since no third-party data processing takes place. You are the sole data processor.</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 style={{ color: 'var(--color-primary)' }}>Deployment Options</h2>
                <p>Depending on your needs, you can deploy AI in two ways:</p>

                <div style={{ marginTop: '1.5rem', borderLeft: '4px solid var(--color-primary)', paddingLeft: '1.5rem' }}>
                    <h3>1. Individual Workstation</h3>
                    <p><strong>For:</strong> Employees wanting to chat with AI to increase productivity, Data Scientists, or Developers.</p>
                    <p>A powerful PC (Desktop) placed directly at the user's desk. It operates offline and provides maximum speed for a single person.</p>
                </div>

                <div style={{ marginTop: '1.5rem', borderLeft: '4px solid var(--color-accent)', paddingLeft: '1.5rem' }}>
                    <h3>2. Organization Server</h3>
                    <p><strong>For:</strong> Entire departments or teams.</p>
                    <p>A centralized server installed in your secure server room. Multiple employees can access it simultaneously via their web browser to use AI Chat, translations, or document search.</p>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <a href="/#/configurator" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem', textDecoration: 'none', display: 'inline-block' }}>
                    Start System Configurator
                </a>
            </div>
        </div>
    );
}
