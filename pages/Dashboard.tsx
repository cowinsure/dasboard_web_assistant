import React from 'react';
import { 
    SuccessRateIcon, EngagementIcon, DurationIcon, NeedsReviewIcon, TrendingUpIcon, BotResponseIcon,
    PriceTagIcon, CrmIcon, HeadsetIcon, ShieldIcon, DocumentIcon 
} from '../components/icons/Icons';

const StatCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  description: string;
}> = ({ icon: Icon, title, value, change, changeType = 'neutral', description }) => {
  
  const changeColor = {
    increase: 'text-sentinel-green',
    decrease: 'text-sentinel-red',
    neutral: 'text-sentinel-text-secondary'
  }[changeType];

  const changeArrow = {
    increase: '↑',
    decrease: '↓',
    neutral: ''
  }[changeType];

  return (
    <div className="bg-sentinel-card p-5 rounded-xl border border-sentinel-border flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-sentinel-text-secondary" />
        <h3 className="text-sentinel-text-secondary text-xs font-bold uppercase tracking-wider">{title}</h3>
      </div>
      <div className="my-3">
        <span className="text-4xl font-bold text-sentinel-text-primary">{value}</span>
        {change && (
          <span className={`ml-2 text-sm font-semibold ${changeColor}`}>
            {changeArrow}{change}
          </span>
        )}
      </div>
      <p className="text-xs text-sentinel-text-tertiary">{description}</p>
    </div>
  );
};

const TrendingQueryTopics: React.FC = () => {
    const topics = [
        { name: 'Pricing Plans (Ecommerce)', percentage: '25%', icon: PriceTagIcon },
        { name: 'CRM Integrations', percentage: '18%', icon: CrmIcon },
        { name: 'Human Agent Escalation', percentage: '12%', icon: HeadsetIcon },
        { name: 'Refund Policy', percentage: '9%', icon: ShieldIcon },
        { name: 'Documentation Link', percentage: '7%', icon: DocumentIcon },
    ];

    return (
        <div className="bg-sentinel-card p-6 rounded-xl border border-sentinel-border">
            <div className="flex items-center gap-3 mb-6">
                <TrendingUpIcon className="w-5 h-5 text-sentinel-primary" />
                <h2 className="text-lg font-bold text-sentinel-text-primary">Trending Query Topics</h2>
            </div>
            <div className="space-y-3">
                {topics.map(topic => (
                    <div key={topic.name} className="flex items-center gap-4 p-3 bg-sentinel-main rounded-lg">
                        <div className="bg-sentinel-card p-2 rounded-md">
                            <topic.icon className="w-5 h-5 text-sentinel-text-secondary" />
                        </div>
                        <span className="flex-1 text-sm font-medium text-sentinel-text-primary">{topic.name}</span>
                        <span className="text-sm font-semibold text-sentinel-text-primary">{topic.percentage}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BotResponseAnalysis: React.FC = () => {
    const analysisData = [
        { name: 'Successful Responses', percentage: 85, color: 'bg-sentinel-green' },
        { name: 'Neutral Responses', percentage: 10, color: 'bg-sentinel-yellow' },
        { name: 'Unsuccessful Responses', percentage: 5, color: 'bg-sentinel-red' },
        { name: 'Hand-off to Agent', percentage: 3, color: 'bg-sentinel-primary' },
    ];

    return (
        <div className="bg-sentinel-card p-6 rounded-xl border border-sentinel-border">
            <div className="flex items-center gap-3 mb-6">
                <BotResponseIcon className="w-5 h-5 text-sentinel-primary" />
                <h2 className="text-lg font-bold text-sentinel-text-primary">Bot Response Analysis</h2>
            </div>
            <div className="space-y-5">
                {analysisData.map(item => (
                    <div key={item.name}>
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-medium text-sentinel-text-primary">{item.name}</span>
                            <span className={`text-sm font-bold ${item.color.replace('bg-','text-')}`}>{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-sentinel-main rounded-full h-2">
                            <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-sentinel-text-primary mb-8">Streamlined Monitoring Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    icon={SuccessRateIcon}
                    title="Real-time Success Rate"
                    value="92%"
                    change="+2%"
                    changeType="increase"
                    description="Last 24 hours"
                />
                <StatCard 
                    icon={EngagementIcon}
                    title="Current Engagement"
                    value="42"
                    change="-0%"
                    changeType="neutral"
                    description="Active chats right now"
                />
                <StatCard 
                    icon={DurationIcon}
                    title="Avg. Session Duration"
                    value="4m 30s"
                    change="-15s"
                    changeType="decrease"
                    description="Compared to previous day"
                />
                <StatCard 
                    icon={NeedsReviewIcon}
                    title="Needs Review"
                    value="7"
                    change="+1"
                    changeType="increase"
                    description="Unresolved issues"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TrendingQueryTopics />
                <BotResponseAnalysis />
            </div>
        </div>
    );
};

export default Dashboard;