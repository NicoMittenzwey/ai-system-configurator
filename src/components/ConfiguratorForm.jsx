import React, { useState, useEffect } from 'react';
import { RecommendationEngine } from './RecommendationEngine';

export default function ConfiguratorForm() {
    const [formData, setFormData] = useState({
        userType: 'individual',
        concurrentUsers: 1,
        useCases: []
    });

    const [recommendation, setRecommendation] = useState(null);

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
                <h2>🏗️ Configure Your System</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Usage Scenario</label>
                    <select
                        value={formData.userType}
                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', background: 'var(--color-bg)', color: 'white', border: '1px solid #334155' }}
                    >
                        <option value="individual">Individual PC / Workstation (Single User)</option>
                        <option value="organization">Organization Server (Multi-User)</option>
                    </select>
                </div>

                {formData.userType === 'organization' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Estimated Concurrent Users</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.concurrentUsers}
                            onChange={(e) => setFormData({ ...formData, concurrentUsers: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', background: 'var(--color-bg)', color: 'white', border: '1px solid #334155' }}
                        />
                    </div>
                )}

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Intended Tasks (Select all that apply)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                        {[
                            { id: 'chat', label: 'Chat with LLM' },
                            { id: 'image_gen', label: 'Image Generation' },
                            { id: 'video', label: 'Video Generation' },
                            { id: 'speech', label: 'Speech Synthesis / TRS' },
                            { id: 'transcribe', label: 'Audio Transcription' },
                            { id: 'rag', label: 'Doc Search (RAG)' },
                            { id: 'dev_support', label: 'Coding / IDE Support' }
                        ].map(task => (
                            <label key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', cursor: 'pointer' }}>
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
                <div className="card" style={{ border: '1px solid var(--color-primary)', background: 'rgba(59, 130, 246, 0.1)' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginTop: 0 }}>{recommendation.title}</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem', color: '#94a3b8' }}>GPU</h4>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{recommendation.gpu}</p>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem', color: '#94a3b8' }}>VRAM</h4>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{recommendation.vram}</p>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem', color: '#94a3b8' }}>System RAM</h4>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{recommendation.ram}</p>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem', color: '#94a3b8' }}>CPU</h4>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{recommendation.cpu}</p>
                        </div>
                    </div>

                    {recommendation.notes.length > 0 && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
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
                            <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>🛠️ Recommended Software Stack</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                {recommendation.software.map((sw, idx) => (
                                    <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '6px' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>
                                            <a href={sw.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.textDecoration = 'underline'} onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                                                {sw.name} 🔗
                                            </a>
                                        </div>
                                        <div style={{ fontSize: '0.9em', color: '#94a3b8' }}>{sw.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {recommendation.models.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>🧠 Suggested Models</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                {recommendation.models.map((model, idx) => (
                                    <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '6px' }}>
                                        <span style={{ fontSize: '0.7em', textTransform: 'uppercase', background: '#334155', padding: '2px 6px', borderRadius: '4px' }}>{model.type}</span>
                                        <div style={{ fontWeight: 'bold', color: 'white', marginTop: '0.4rem' }}>
                                            <a href={model.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.textDecoration = 'underline'} onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                                                {model.name} 🔗
                                            </a>
                                        </div>
                                        <div style={{ fontSize: '0.9em', color: '#94a3b8' }}>{model.desc}</div>
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
