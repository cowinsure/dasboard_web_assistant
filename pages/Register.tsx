import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoIcon, SpinnerIcon } from '../components/icons/Icons';
import Toast from '../components/Toast';

const Register: React.FC = () => {
    const [tenantName, setTenantName] = useState('Test Tenants');
    const [email, setEmail] = useState('test123@example.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
        message: '',
        type: 'success',
        visible: false,
    });
    
    const navigate = useNavigate();

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type, visible: true });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://api.nswebassistant.site/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tenantName, email, password }),
            });

            if (!response.ok) {
                let errorMessage = 'Registration failed. Please try again.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    errorMessage = response.statusText;
                }
                throw new Error(errorMessage);
            }

            showToast('Registration successful! Redirecting...', 'success');
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            showToast(errorMessage, 'error');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-sentinel-body py-12">
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, visible: false })}
                />
            )}
            <div className="w-full max-w-md p-8 space-y-8 bg-sentinel-main rounded-xl border border-sentinel-border">
                <div className="text-center">
                    <div className="inline-block bg-sentinel-card p-3 rounded-lg mb-4">
                        <LogoIcon className="w-8 h-8 text-sentinel-text-primary"/>
                    </div>
                    <h1 className="text-2xl font-bold text-sentinel-text-primary">Create an Account</h1>
                    <p className="text-sentinel-text-secondary">Start managing your AI bots today.</p>
                </div>
                <form className="space-y-6" onSubmit={handleRegister}>
                    <div>
                        <label htmlFor="tenantName" className="text-sm font-medium text-sentinel-text-secondary block mb-2">Company Name</label>
                        <input
                            type="text"
                            name="tenantName"
                            id="tenantName"
                            className="w-full px-3 py-2 bg-sentinel-card border border-sentinel-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sentinel-primary"
                            placeholder="Your Company Inc."
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-sentinel-text-secondary block mb-2">Email address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full px-3 py-2 bg-sentinel-card border border-sentinel-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sentinel-primary"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-sentinel-text-secondary block mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full px-3 py-2 bg-sentinel-card border border-sentinel-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sentinel-primary"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sentinel-primary hover:bg-sentinel-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sentinel-main focus:ring-sentinel-primary disabled:opacity-50 disabled:cursor-wait"
                        >
                            {loading ? <SpinnerIcon className="h-5 w-5 text-white" /> : 'Sign Up'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-sentinel-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-sentinel-primary hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;