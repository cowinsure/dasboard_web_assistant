import React, { useState, useEffect } from 'react';

interface ProfileData {
    userId: string;
    tenantId: string;
    role: string;
    email: string;
    tenant_ids: string[];
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Access token not found');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await fetch('https://api.nswebassistant.site/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data: ProfileData = await response.json();
            setProfile(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full"><div>Loading...</div></div>;
    if (error) return <div className="flex items-center justify-center h-full"><div>Error: {error}</div></div>;

    if (!profile) return <div className="flex items-center justify-center h-full"><div>No profile data</div></div>;

    // Generate avatar based on email
    const avatarUrl = `https://i.pravatar.cc/150?img=${Math.abs(profile.email.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 50 + 1}`;

    return (
        <div className="flex items-center justify-center h-full bg-sentinel-body">
            <div className="bg-sentinel-main p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="text-center">
                    <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-sentinel-text-primary mb-2">Profile</h2>
                    <p className="text-sentinel-text-secondary">{profile.email}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;