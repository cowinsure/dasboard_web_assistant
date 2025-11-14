
import React, { useState, useEffect } from 'react';

interface ChatLog {
    id: string;
    user_identifier: string;
    message: string;
    response: string;
    token_count: number;
    createdAt: string;
    updatedAt: string;
}

interface ChatItem {
    id: string;
    name: string;
    time: string;
    lastMessage: string;
    avatar: string;
    active: boolean;
    latestDate: string;
}


const ChatList: React.FC<{ chatList: ChatItem[], onSelect: (id: string) => void, selected: string | null, loading: boolean, error: string | null }> = ({ chatList, onSelect, selected, loading, error }) => {
    if (loading) return <div className="w-1/4 bg-sentinel-main border-r border-sentinel-border flex items-center justify-center">Loading...</div>;
    if (error) return <div className="w-1/4 bg-sentinel-main border-r border-sentinel-border flex items-center justify-center">Error: {error}</div>;

    return (
        <div className="w-1/4 bg-sentinel-main border-r border-sentinel-border flex flex-col">
            <div className="p-4 border-b border-sentinel-border">
                <input type="text" placeholder="Search users..." className="w-full bg-sentinel-card border border-sentinel-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-primary" />
                <div className="flex gap-2 mt-3 text-xs">
                    <button className="bg-sentinel-card border border-sentinel-border px-3 py-1.5 rounded-md hover:bg-sentinel-border">Sort by Date</button>
                    <button className="bg-sentinel-card border border-sentinel-border px-3 py-1.5 rounded-md hover:bg-sentinel-border">Unread</button>
                    <button className="bg-sentinel-primary text-white px-3 py-1.5 rounded-md hover:bg-sentinel-primary-hover">New</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {chatList.map(chat => (
                    <div key={chat.id} onClick={() => onSelect(chat.id)} className={`p-4 flex gap-3 cursor-pointer border-l-4 ${selected === chat.id ? 'bg-sentinel-card border-sentinel-primary' : 'border-transparent hover:bg-sentinel-card/50'}`}>
                        <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline">
                                <p className="text-sm font-semibold text-sentinel-text-primary">{chat.name}</p>
                                <p className="text-xs text-sentinel-text-tertiary">{chat.time}</p>
                            </div>
                            <p className="text-sm text-sentinel-text-secondary truncate">{chat.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ChatWindow: React.FC<{ selected: string | null, grouped: Record<string, ChatLog[]> }> = ({ selected, grouped }) => {
    if (!selected || !grouped[selected]) {
        return (
            <div className="w-1/2 bg-sentinel-body flex items-center justify-center">
                Select a chat to view messages
            </div>
        );
    }

    const chats = grouped[selected].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const messages = [];
    chats.forEach(chat => {
        messages.push({ from: 'user', text: chat.message, time: formatTime(chat.createdAt) });
        messages.push({ from: 'bot', text: chat.response, time: formatTime(chat.updatedAt) });
    });

    return (
        <div className="w-1/2 bg-sentinel-body flex flex-col">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="text-center my-4">
                    <span className="bg-sentinel-card text-xs text-sentinel-text-secondary px-3 py-1 rounded-full">Chat with {selected}</span>
                </div>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.from === 'user' && <img src={`https://i.pravatar.cc/150?img=${Math.abs(selected.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 50 + 1}`} alt="bot" className="w-8 h-8 rounded-full self-end" />}
                        <div className={`max-w-md p-3 rounded-lg ${msg.from === 'user' ? 'bg-sentinel-primary text-white rounded-br-none' : 'bg-sentinel-card text-sentinel-text-primary rounded-bl-none'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-blue-200' : 'text-sentinel-text-tertiary'} text-right`}>{msg.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-sentinel-main border-t border-sentinel-border">
                <div className="flex items-center bg-sentinel-card rounded-lg p-2">
                    <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent px-2 focus:outline-none text-sm" />
                    <button className="p-2 text-sentinel-text-secondary hover:text-sentinel-text-primary">📎</button>
                    <button className="p-2 text-sentinel-text-secondary hover:text-sentinel-text-primary">😀</button>
                    <button className="p-2 bg-sentinel-primary rounded-md text-white">➤</button>
                </div>
            </div>
        </div>
    );
};

const SessionAnalytics: React.FC = () => (
    <div className="w-1/4 bg-sentinel-main border-l border-sentinel-border p-6 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
            <img src="https://i.pravatar.cc/150?img=1" alt="Visitor" className="w-12 h-12 rounded-full" />
            <div>
                <p className="text-lg font-bold">Visitor #12345</p>
                <p className="text-xs text-sentinel-text-secondary">First contact: 2 days ago</p>
                <p className="text-xs text-sentinel-text-secondary">Session duration: 15m</p>
            </div>
        </div>
        
        <div className="space-y-6">
            <div>
                <h4 className="text-sm font-semibold text-sentinel-text-secondary mb-2">Query Summary</h4>
                <p className="text-sm text-sentinel-text-primary bg-sentinel-card p-3 rounded-lg">User was interested in pricing plans for a mid-sized e-commerce business. The bot recommended the "Business" plan and offered to send a feature comparison.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-sentinel-card p-3 rounded-lg text-center">
                    <p className="text-xs text-sentinel-text-secondary">SUCCESS RATE</p>
                    <p className="text-2xl font-bold text-sentinel-green">92%</p>
                </div>
                <div className="bg-sentinel-card p-3 rounded-lg text-center">
                    <p className="text-xs text-sentinel-text-secondary">ENGAGEMENT</p>
                    <p className="text-2xl font-bold">15m 21s</p>
                </div>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-sentinel-text-secondary mb-2">Bot Response Analysis</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Greeting</span> <span className="text-sentinel-green font-semibold">Successful</span></div>
                    <div className="w-full h-1.5 bg-sentinel-green rounded-full"></div>
                    <div className="flex items-center justify-between mt-2"><span>Plan Info</span> <span className="text-sentinel-green font-semibold">Successful</span></div>
                    <div className="w-full h-1.5 bg-sentinel-green rounded-full"></div>
                    <div className="flex items-center justify-between mt-2"><span>Recommendation</span> <span className="text-sentinel-yellow font-semibold">Neutral</span></div>
                    <div className="w-full h-1.5 bg-sentinel-card rounded-full"><div className="w-1/2 h-full bg-sentinel-yellow rounded-full"></div></div>
                </div>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-sentinel-text-secondary mb-2">Common Answers</h4>
                <div className="space-y-2 text-sm">
                    <p className="bg-sentinel-card p-2 rounded-md">✓ Provided details on pricing tiers.</p>
                    <p className="bg-sentinel-card p-2 rounded-md">✓ Suggested the "Business" plan.</p>
                    <p className="bg-sentinel-card p-2 rounded-md">✓ Asked about the business type.</p>
                </div>
            </div>
        </div>
    </div>
);


const Chats: React.FC = () => {
    const [chatList, setChatList] = useState<ChatItem[]>([]);
    const [grouped, setGrouped] = useState<Record<string, ChatLog[]>>({});
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('Access token not found');
        }
        try {
            setLoading(true);
            const response = await fetch('https://api.nswebassistant.site/chatlogs?group_by=user_identifier&limit=10', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            // Group by user_identifier
            const groupedData: Record<string, ChatLog[]> = data.chatlogs.reduce((acc: Record<string, ChatLog[]>, chat: ChatLog) => {
                if (!acc[chat.user_identifier]) acc[chat.user_identifier] = [];
                acc[chat.user_identifier].push(chat);
                return acc;
            }, {});
            setGrouped(groupedData);
            // Transform to chat list
            const chatListData: ChatItem[] = Object.entries(groupedData).map(([userId, chats]: [string, ChatLog[]]) => {
                const sortedChats = chats.sort((a: ChatLog, b: ChatLog) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                const latest = sortedChats[0];
                const formatTime = (dateStr: string) => {
                    const date = new Date(dateStr);
                    const now = new Date();
                    const diff = now.getTime() - date.getTime();
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    if (days === 0) return 'Today';
                    if (days === 1) return 'Yesterday';
                    return `${days} days ago`;
                };
                return {
                    id: userId,
                    name: `User ${userId}`,
                    time: formatTime(latest.createdAt),
                    lastMessage: latest.message,
                    avatar: `https://i.pravatar.cc/150?img=${Math.abs(userId.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % 50 + 1}`,
                    active: false,
                    latestDate: latest.createdAt
                };
            }).sort((a: ChatItem, b: ChatItem) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime());
            setChatList(chatListData);
            setLoading(false);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full">
            <ChatList chatList={chatList} onSelect={setSelectedUser} selected={selectedUser} loading={loading} error={error} />
            <ChatWindow selected={selectedUser} grouped={grouped} />
            <SessionAnalytics />
        </div>
    );
};

export default Chats;
