
import React, { useState } from 'react';

const chatsData = [
    { id: 12345, name: 'Visitor #12345', time: '2 days ago', lastMessage: 'How can I assist you with our pricing today?', avatar: 'https://i.pravatar.cc/150?img=1', active: true },
    { id: 12344, name: 'Visitor #12344', time: '1 hour ago', lastMessage: 'I\'m looking for information about...', avatar: 'https://i.pravatar.cc/150?img=2', active: false },
    { id: 12343, name: 'Visitor #12343', time: '3 hours ago', lastMessage: 'We have several plans available. Which...', avatar: 'https://i.pravatar.cc/150?img=3', active: false },
    { id: 12342, name: 'Visitor #12342', time: 'Yesterday', lastMessage: 'Can you connect me to a human agent?', avatar: 'https://i.pravatar.cc/150?img=4', active: false },
];

const messagesData = [
    { from: 'bot', text: 'Hello! Welcome to AI Sentinel. How can I help you today?', time: '11:01 AM' },
    { from: 'user', text: 'I\'m interested in your pricing plans.', time: '11:02 AM' },
    { from: 'bot', text: 'Great! We have three tiers: Starter, Business, and Enterprise. The Starter plan is perfect for small businesses, while the Enterprise plan offers advanced features and dedicated support. What kind of business are you?', time: '11:02 AM' },
];

const ChatList: React.FC = () => (
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
            {chatsData.map(chat => (
                <div key={chat.id} className={`p-4 flex gap-3 cursor-pointer border-l-4 ${chat.active ? 'bg-sentinel-card border-sentinel-primary' : 'border-transparent hover:bg-sentinel-card/50'}`}>
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

const ChatWindow: React.FC = () => (
    <div className="w-1/2 bg-sentinel-body flex flex-col">
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="text-center my-4">
                <span className="bg-sentinel-card text-xs text-sentinel-text-secondary px-3 py-1 rounded-full">Today</span>
            </div>
            {messagesData.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.from === 'bot' && <img src="https://i.pravatar.cc/150?img=50" alt="bot" className="w-8 h-8 rounded-full self-end" />}
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
    return (
        <div className="flex h-full">
            <ChatList />
            <ChatWindow />
            <SessionAnalytics />
        </div>
    );
};

export default Chats;
