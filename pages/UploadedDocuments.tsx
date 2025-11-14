import React from 'react';
import { DocumentIcon, TrashIcon, EyeIcon } from '../components/icons/Icons';

type Document = {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadedAt: string;
  status: 'Processed' | 'Pending' | 'Error';
};

const documentsData: Document[] = [
  { id: '1', name: 'Q4_2024_Services_Catalog.pdf', category: 'Service Catalog', size: '2.5 MB', uploadedAt: '2024-07-15', status: 'Processed' },
  { id: '2', name: 'enterprise_pricing_v3.xlsx', category: 'Pricing Sheets', size: '512 KB', uploadedAt: '2024-07-15', status: 'Processed' },
  { id: '3', name: 'return_policy.docx', category: 'Company Policies', size: '128 KB', uploadedAt: '2024-07-14', status: 'Processed' },
  { id: '4', name: 'faq_customer_support.pdf', category: 'FAQs', size: '1.2 MB', uploadedAt: '2024-07-14', status: 'Processed' },
  { id: '5', name: 'product_manual_model_X.pdf', category: 'Product Manuals', size: '15.8 MB', uploadedAt: '2024-07-12', status: 'Error' },
  { id: '6', name: 'new_hire_onboarding.docx', category: 'Other', size: '845 KB', uploadedAt: '2024-07-11', status: 'Pending' },
  { id: '7', name: 'API_integration_guide.pdf', category: 'Product Manuals', size: '4.1 MB', uploadedAt: '2024-07-10', status: 'Processed' },
];

const StatusBadge: React.FC<{ status: Document['status'] }> = ({ status }) => {
  const baseClasses = 'px-2 py-0.5 text-xs font-medium rounded-full inline-block';
  const statusClasses = {
    Processed: 'bg-sentinel-green/20 text-sentinel-green',
    Pending: 'bg-sentinel-yellow/20 text-sentinel-yellow',
    Error: 'bg-sentinel-red/20 text-sentinel-red',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const UploadedDocuments: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-sentinel-text-primary mb-2">Uploaded Documents</h1>
            <p className="text-sentinel-text-secondary mb-8">Manage and review all documents uploaded to train your AI assistant.</p>
            
            <div className="flex justify-between items-center mb-6">
                <div className="w-1/3">
                    <input type="text" placeholder="Search documents..." className="w-full bg-sentinel-card border border-sentinel-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-primary" />
                </div>
                <div className="flex gap-2">
                    <select className="bg-sentinel-card border border-sentinel-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-primary">
                        <option>All Categories</option>
                        <option>Service Catalog</option>
                        <option>Pricing Sheets</option>
                        <option>Product Manuals</option>
                    </select>
                    <select className="bg-sentinel-card border border-sentinel-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-primary">
                        <option>Sort by Date</option>
                        <option>Sort by Name</option>
                        <option>Sort by Size</option>
                    </select>
                </div>
            </div>

            <div className="bg-sentinel-card border border-sentinel-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-sentinel-main">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium text-sentinel-text-secondary uppercase tracking-wider">Document Name</th>
                            <th scope="col" className="px-6 py-3 font-medium text-sentinel-text-secondary uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 font-medium text-sentinel-text-secondary uppercase tracking-wider">Size</th>
                            <th scope="col" className="px-6 py-3 font-medium text-sentinel-text-secondary uppercase tracking-wider">Date Uploaded</th>
                            <th scope="col" className="px-6 py-3 font-medium text-sentinel-text-secondary uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right font-medium text-sentinel-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sentinel-border">
                        {documentsData.map((doc) => (
                            <tr key={doc.id} className="hover:bg-sentinel-main/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <DocumentIcon className="w-5 h-5 text-sentinel-text-secondary" />
                                        <span className="font-medium text-sentinel-text-primary">{doc.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sentinel-text-secondary">{doc.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sentinel-text-secondary">{doc.size}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sentinel-text-secondary">{doc.uploadedAt}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={doc.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-sentinel-text-secondary hover:text-sentinel-primary"><EyeIcon className="w-5 h-5" /></button>
                                        <button className="p-2 text-sentinel-text-secondary hover:text-sentinel-red"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UploadedDocuments;