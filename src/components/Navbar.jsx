import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const navStyle = {
        background: 'var(--color-primary)',
        padding: '1rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const linkContainerStyle = {
        display: 'flex',
        gap: '2rem'
    };

    const linkStyle = ({ isActive }) => ({
        color: 'white',
        textDecoration: 'none',
        fontWeight: isActive ? '700' : '400',
        paddingBottom: isActive ? '4px' : '0',
        borderBottom: isActive ? '2px solid white' : 'none',
        fontSize: '1.1rem'
    });

    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>AI System Configurator</div>
                <div style={linkContainerStyle}>
                    <NavLink to="/" style={linkStyle}>Overview</NavLink>
                    <NavLink to="/admin" style={linkStyle}>For IT Admins</NavLink>
                    <NavLink to="/configurator" style={linkStyle}>System Configurator</NavLink>
                </div>
            </div>
        </nav>
    );
}
