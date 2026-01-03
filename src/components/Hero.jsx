import React from 'react';

export default function Hero() {
    return (
        <div style={{ padding: '4rem 1rem', marginBottom: '2rem' }}>
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
                Secure. Private. Powerful.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Unlock the power of AI on your own infrastructure. Keep your data safe, comply with DSGVO/GDPR, and eliminate API costs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', textAlign: 'left', marginTop: '3rem' }}>
                <div className="card">
                    <h3>🔒 Data Sovereignty</h3>
                    <p>Your data never leaves your premises. Perfect for sensitive documents, trade secrets, and personal information.</p>
                </div>
                <div className="card">
                    <h3>🛡️ GDPR / DSGVO Compliant</h3>
                    <p>No third-party processing means simplified compliance with European data protection regulations.</p>
                </div>
                <div className="card">
                    <h3>💸 Predictable Costs</h3>
                    <p>One-time hardware investment instead of unpredictable monthly API usage bills.</p>
                </div>
            </div>
        </div>
    );
}
