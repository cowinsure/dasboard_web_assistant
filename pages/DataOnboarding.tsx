import React, { useState, useEffect } from 'react';
import { UploadIcon, TrashIcon, SuccessRateIcon, DocumentIcon, EyeIcon, DownloadIcon } from '../components/icons/Icons';
import Toast from '../components/Toast';

// --- Data & Types ---
type Document = {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadedAt: string;
  status: 'Processed' | 'Pending' | 'Error';
};

// API response type
type ApiDocument = {
  document_id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  status: string;
  chunks_count: number;
  uploaded_at: string;
  updated_at: string;
};

// --- Helper Functions & Components ---

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FileUploadArea: React.FC<{ onFileUpload: (files: FileList) => void; }> = ({ onFileUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileUpload(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileUpload(e.target.files);
        }
    };

    return (
        <div onDragEnter={handleDrag} className="relative">
            <label 
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-48 px-4 transition bg-sentinel-card border-2 border-dashed rounded-lg appearance-none cursor-pointer border-sentinel-border hover:border-sentinel-text-secondary focus:outline-none ${isDragging ? 'border-sentinel-primary' : ''}`}>
                <UploadIcon className="w-8 h-8 text-sentinel-text-secondary" />
                <span className="flex items-center mt-2 space-x-2">
                    <span className="font-medium text-sentinel-text-secondary">
                        Drop files to attach, or <span className="text-sentinel-primary underline">browse</span>
                    </span>
                </span>
                <input type="file" multiple className="hidden" onChange={handleChange} />
            </label>
        </div>
    );
};

const StatusBadge: React.FC<{ status: Document['status'] }> = ({ status }) => {
  const baseClasses = 'px-2 py-0.5 text-xs font-medium rounded-full inline-block';
  const statusClasses = {
    Processed: 'bg-sentinel-green/20 text-sentinel-green',
    Pending: 'bg-sentinel-yellow/20 text-sentinel-yellow',
    Error: 'bg-sentinel-red/20 text-sentinel-red',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


// --- Main Component ---

const DataOnboarding: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        // Reset state for next time dialog opens
        setTimeout(() => {
            setCurrentStep(1);
            setUploadedFiles([]);
            setIsProcessing(false);
        }, 300); // delay for close animation
    };
    
    const handleAddFiles = (files: FileList) => {
        const newFiles = Array.from(files);
        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const handleRemoveFile = (fileToRemove: File) => {
        setUploadedFiles(prev => prev.filter(file => file !== fileToRemove));
    };
    
    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleProcess = async () => {
        setIsProcessing(true);
        try {
            const uploadPromises = uploadedFiles.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    throw new Error('Access token not found');
                }
                return fetch('https://api.nswebassistant.site/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
            });
            await Promise.all(uploadPromises);
            setIsProcessing(false);
            setToastMessage('Files uploaded successfully!');
            setToastType('success');
            setShowToast(true);
            fetchDocuments(); // Refresh the documents list
            handleNext();
        } catch (error) {
            console.error('Upload failed:', error);
            setIsProcessing(false);
            setToastMessage('Upload failed. Please try again.');
            setToastType('error');
            setShowToast(true);
        }
    };

    const canProceedToReview = uploadedFiles.length > 0;

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Access token not found');
            }
            const response = await fetch('https://api.nswebassistant.site/documents?limit=20&offset=0&status=completed&sort_by=filename&sort_order=asc', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }
            const data: { documents: ApiDocument[] } = await response.json();
            const mappedDocuments: Document[] = data.documents.map(doc => ({
                id: doc.document_id,
                name: doc.filename,
                category: 'Other', // API doesn't provide category
                size: formatBytes(doc.file_size),
                uploadedAt: new Date(doc.uploaded_at).toLocaleDateString(),
                status: doc.status === 'completed' ? 'Processed' : 'Pending' as Document['status']
            }));
            setDocuments(mappedDocuments);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setToastMessage('Failed to load documents.');
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsLoadingDocuments(false);
        }
    };

    const handleDownload = async (doc: Document) => {
        setDownloadingId(doc.id);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Access token not found');
            }
            const response = await fetch(`https://api.nswebassistant.site/download/${doc.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Download failed');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            setToastMessage('Download failed. Please try again.');
            setToastType('error');
            setShowToast(true);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDelete = async (doc: Document) => {
        if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) {
            return;
        }
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Access token not found');
            }
            const response = await fetch(`https://api.nswebassistant.site/documents/${doc.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Delete failed');
            }
            setToastMessage('Document deleted successfully!');
            setToastType('success');
            setShowToast(true);
            fetchDocuments(); // Refresh the documents list
        } catch (error) {
            console.error('Delete failed:', error);
            setToastMessage('Delete failed. Please try again.');
            setToastType('error');
            setShowToast(true);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="bg-sentinel-main p-8 rounded-xl border border-sentinel-border">
                        <h2 className="text-xl font-bold text-sentinel-text-primary">Upload Documents</h2>
                        <p className="text-sentinel-text-secondary mb-8">Add files to be processed. You can drag and drop files or click to browse.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUploadArea onFileUpload={handleAddFiles} />
                            <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                                {uploadedFiles.length === 0 && <p className="text-sm text-sentinel-text-tertiary text-center mt-16">No files uploaded yet.</p>}
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-sentinel-card p-2 rounded-md text-sm">
                                        <span className="text-sentinel-text-primary truncate max-w-[200px]">{file.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sentinel-text-secondary">{formatBytes(file.size)}</span>
                                            <button onClick={() => handleRemoveFile(file)} className="text-sentinel-text-secondary hover:text-sentinel-red">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-sentinel-main p-8 rounded-xl border border-sentinel-border">
                        <h2 className="text-xl font-bold text-sentinel-text-primary">Review & Process</h2>
                        <p className="text-sentinel-text-secondary mb-8">Please review the documents below before starting the process.</p>
                        <div className="max-h-64 overflow-y-auto pr-2">
                             <ul className="list-disc list-inside space-y-2 text-sm text-sentinel-text-secondary pl-2 mt-2">
                                {uploadedFiles.map((file, index) => (
                                    <li key={index} className="bg-sentinel-card p-2 rounded-md">{file.name} ({formatBytes(file.size)})</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 3:
                return (
                     <div className="bg-sentinel-main p-8 rounded-xl border border-sentinel-border text-center">
                        <SuccessRateIcon className="w-16 h-16 text-sentinel-green mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-sentinel-text-primary">Processing Complete</h2>
                        <p className="text-sentinel-text-secondary mt-2 mb-6">Your documents have been successfully uploaded and are now being processed by the AI.</p>
                        <button onClick={handleCloseDialog} className="bg-sentinel-primary text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-sentinel-primary-hover transition-colors">
                            Finish
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-sentinel-text-primary mb-2">Document Library</h1>
                    <p className="text-sentinel-text-secondary">Manage and review all documents uploaded to train your AI assistant.</p>
                </div>
                <button onClick={handleOpenDialog} className="bg-sentinel-primary text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-sentinel-primary-hover transition-colors flex items-center gap-2">
                    <UploadIcon className="w-5 h-5" />
                    <span>Upload Documents</span>
                </button>
            </div>
            
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
                        {isLoadingDocuments ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sentinel-text-secondary">Loading documents...</td>
                            </tr>
                        ) : documents.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sentinel-text-secondary">No documents found.</td>
                            </tr>
                        ) : (
                            documents.map((doc) => (
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
                                        {/* <button className="p-2 text-sentinel-text-secondary hover:text-sentinel-primary"><EyeIcon className="w-5 h-5" /></button> */}
                                        <button onClick={() => handleDownload(doc)} disabled={downloadingId === doc.id} className="p-2 text-sentinel-text-secondary hover:text-sentinel-primary disabled:opacity-50"><DownloadIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete(doc)} className="p-2 text-sentinel-text-secondary hover:text-sentinel-red"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Onboarding Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="bg-sentinel-main rounded-xl border border-sentinel-border max-w-4xl w-full m-8">
                        <div className="flex justify-between items-center p-6 border-b border-sentinel-border">
                            <h2 className="text-xl font-bold text-sentinel-text-primary" id="modal-title">Upload New Documents</h2>
                            <button onClick={handleCloseDialog} className="p-1 rounded-full text-sentinel-text-secondary hover:bg-sentinel-card hover:text-sentinel-text-primary">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8">
                            {currentStep < 3 && (
                                <div className="flex items-center justify-between mb-12 max-w-lg mx-auto">
                                    {['Upload', 'Review & Process'].map((step, index) => {
                                        const stepNumber = index + 1;
                                        const isCompleted = currentStep > stepNumber;
                                        const isActive = currentStep === stepNumber;
                                        return (
                                            <React.Fragment key={step}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${isActive ? 'bg-sentinel-primary text-white' : isCompleted ? 'bg-sentinel-green text-white' : 'bg-sentinel-card border border-sentinel-border text-sentinel-text-secondary'}`}>
                                                        {isCompleted ? '✓' : stepNumber}
                                                    </div>
                                                    <span className={`font-medium transition-colors ${isActive || isCompleted ? 'text-sentinel-text-primary' : 'text-sentinel-text-secondary'}`}>{step}</span>
                                                </div>
                                                {index < 1 && <div className={`flex-1 h-px mx-4 transition-colors ${currentStep > stepNumber ? 'bg-sentinel-primary' : 'bg-sentinel-border'}`}></div>}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            )}
                            {renderStepContent()}
                            {currentStep < 3 && (
                                <div className="flex items-center justify-between mt-8">
                                    <button onClick={handleBack} className="bg-sentinel-card text-sentinel-text-primary font-semibold py-2.5 px-6 rounded-lg hover:bg-sentinel-border transition-colors disabled:opacity-50" disabled={currentStep === 1}>
                                        ← Back
                                    </button>
                                    {currentStep === 2 ? (
                                        <button onClick={handleProcess} disabled={isProcessing} className="bg-sentinel-green text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait">
                                            {isProcessing ? (
                                                <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                                </>
                                            ) : 'Confirm & Process'}
                                        </button>
                                    ) : (
                                        <button onClick={handleNext} className="bg-sentinel-primary text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-sentinel-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50" disabled={!canProceedToReview}>
                                            Next: Review →
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
        </div>
    );
};

export default DataOnboarding;
