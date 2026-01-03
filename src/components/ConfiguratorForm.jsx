import React, { useState, useEffect } from 'react';
import { RecommendationEngine } from './RecommendationEngine';

export default function ConfiguratorForm() {
    const [formData, setFormData] = useState({
        userType: 'individual',
        concurrentUsers: 1,
        linesOfCode: 0,
        os: 'linux',
        budget: 5000,
        useCases: []
    });

    const [recommendation, setRecommendation] = useState(null);

    const handleUserTypeChange = (value) => {
        setFormData(prev => ({
            ...prev,
            userType: value,
            budget: value === 'organization' ? 25000 : 5000
        }));
    };

    const handleUseCaseChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            useCases: prev.useCases.includes(value)
                ? prev.useCases.filter(item => item !== value)
                : [...prev.useCases, value]
        }));
    };

    const calculate = () => {
        const result = RecommendationEngine(formData);
        setRecommendation(result);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card">
                <h2>Configure Your System</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Usage Scenario</label>
                    <select
                        value={formData.userType}
                        onChange={(e) => handleUserTypeChange(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', background: 'var(--color-input-bg)', color: 'var(--color-text-main)', border: '1px solid var(--color-input-border)', boxSizing: 'border-box' }}
                    >
                        <option value="individual">Individual PC / Workstation (Single User)</option>
                        <option value="organization">Organization Server (Multi-User)</option>
                    </select>
                </div>

                {formData.userType === 'individual' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Preferred OS</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['linux', 'windows', 'mac'].map(os => (
                                <label key={os} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--color-text-main)' }}>
                                    <input
                                        type="radio"
                                        name="os"
                                        value={os}
                                        checked={formData.os === os}
                                        onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    {os.charAt(0).toUpperCase() + os.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {formData.userType === 'organization' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Estimated Concurrent Users</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.concurrentUsers}
                            onChange={(e) => setFormData({ ...formData, concurrentUsers: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', background: 'var(--color-input-bg)', color: 'var(--color-text-main)', border: '1px solid var(--color-input-border)', boxSizing: 'border-box' }}
                        />
                    </div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Maximum Budget (USD)</label>
                    <input
                        type="number"
                        min="1000"
                        step="5000"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', background: 'var(--color-input-bg)', color: 'var(--color-text-main)', border: '1px solid var(--color-input-border)', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Intended Tasks</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                        {[
                            { id: 'chat', label: 'Chat with AI' },
                            { id: 'image_gen', label: 'Image Generation' },
                            { id: 'video', label: 'Video Generation' },
                            { id: 'speech', label: 'Speech Synthesis / TRS' },
                            { id: 'transcribe', label: 'Audio Transcription' },
                            { id: 'rag', label: 'Doc Search (RAG)' },
                            { id: 'dev_support', label: 'Coding / IDE Support' }
                        ].map(task => (
                            <label key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: formData.useCases.includes(task.id) ? '#e0f2fe' : 'var(--color-surface)', border: `1px solid ${formData.useCases.includes(task.id) ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-main)' }}>
                                <input
                                    type="checkbox"
                                    value={task.id}
                                    checked={formData.useCases.includes(task.id)}
                                    onChange={handleUseCaseChange}
                                />
                                {task.label}
                            </label>
                        ))}
                    </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }} onClick={calculate}>
                    Generate Recommendation
                </button>
            </div>

            {recommendation && (
                <div className="card" style={{ border: '1px solid var(--color-primary)', background: '#f0f9ff' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginTop: 0 }}>{recommendation.title}</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem', color: 'var(--color-text-muted)' }}>GPU</h4>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text-main)' }}>{recommendation.gpu}</p>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem', color: 'var(--color-text-muted)' }}>VRAM (on GPU)</h4>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text-main)' }}>{recommendation.vram}</p>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem', color: 'var(--color-text-muted)' }}>System RAM</h4>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text-main)' }}>{recommendation.ram}</p>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem', color: 'var(--color-text-muted)' }}>CPU</h4>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text-main)' }}>{recommendation.cpu}</p>
                        </div>
                    </div>

                    {recommendation.notes.length > 0 && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '6px', color: '#92400e' }}>
                            <strong>Note:</strong>
                            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem' }}>
                                {recommendation.notes.map((note, idx) => (
                                    <li key={idx}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {recommendation.software.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Recommended Software Stack</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                {recommendation.software.map((sw, idx) => (
                                    <div key={idx} style={{ background: 'var(--color-surface)', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                            <a href={sw.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.textDecoration = 'underline'} onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                                                {sw.name} 🔗
                                            </a>
                                        </div>
                                        <div style={{ fontSize: '0.9em', color: 'var(--color-text-muted)' }}>{sw.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {recommendation.models.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Suggested Models</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                {recommendation.models.map((model, idx) => (
                                    <div key={idx} style={{ background: 'var(--color-surface)', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                                        <span style={{ fontSize: '0.7em', textTransform: 'uppercase', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px' }}>{model.type}</span>
                                        <div style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '0.4rem' }}>
                                            <a href={model.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.textDecoration = 'underline'} onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                                                {model.name} 🔗
                                            </a>
                                        </div>
                                        <div style={{ fontSize: '0.9em', color: 'var(--color-text-muted)' }}>{model.desc}</div>
                                        {model.estSize && (
                                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.85em', color: 'var(--color-primary)', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>
                                                    ~{model.estSize} GB Base
                                                </span>
                                                {model.maxContextDisplay && (
                                                    <span style={{ fontSize: '0.85em', color: '#047857', background: '#d1fae5', padding: '2px 6px', borderRadius: '4px' }}>
                                                        Max Context: ~{model.maxContextDisplay}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
