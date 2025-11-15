import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoIcon, SpinnerIcon, EyeIcon, EyeOffIcon } from '../components/icons/Icons';
import Toast from '../components/Toast';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://api.nswebassistant.site/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                // Try to parse error message, otherwise use a default
                let errorMessage = 'Login failed. Please check your credentials.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    // The response was not valid JSON, use the status text
                    errorMessage = response.statusText;
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();

            if (data.access_token) {
                localStorage.setItem('accessToken', data.access_token);
                showToast('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                throw new Error('Login failed: No access token received.');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            showToast(errorMessage, 'error');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-sentinel-body">
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
                    <h1 className="text-2xl font-bold text-sentinel-text-primary">Welcome Back</h1>
                    <p className="text-sentinel-text-secondary">Log in to your AI Sentinel account.</p>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-sentinel-text-secondary block mb-2">Email address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            className="w-full px-3 py-2 bg-sentinel-card border border-sentinel-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sentinel-primary"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-sentinel-text-secondary block mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                autoComplete="current-password"
                                className="w-full px-3 py-2 pr-10 bg-sentinel-card border border-sentinel-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sentinel-primary"
                                placeholder="enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="h-5 w-5 text-sentinel-text-secondary" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-sentinel-text-secondary" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 bg-sentinel-card border-sentinel-border text-sentinel-primary rounded focus:ring-sentinel-primary"/>
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-sentinel-text-secondary">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-sentinel-primary hover:underline">Forgot your password?</a>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sentinel-primary hover:bg-sentinel-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sentinel-main focus:ring-sentinel-primary disabled:opacity-50 disabled:cursor-wait"
                        >
                            {loading ? <SpinnerIcon className="h-5 w-5 text-white" /> : 'Log In'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-sentinel-text-secondary">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-sentinel-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;