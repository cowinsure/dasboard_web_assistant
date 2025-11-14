import React, { useState, useCallback } from 'react';
import { UploadIcon, TrashIcon, SuccessRateIcon } from '../components/icons/Icons';

const documentCategories = [
    { icon: '📄', title: 'Service Catalog', description: 'Details on services offered.' },
    { icon: '💲', title: 'Pricing Sheets', description: 'Current product/service costs.' },
    { icon: '📖', title: 'Product Manuals', description: 'Guides and specifications.' },
    { icon: '❓', title: 'FAQs', description: 'Common customer questions.' },
    { icon: '🛡️', title: 'Company Policies', description: 'Terms, conditions, and rules.' },
    { icon: '➕', title: 'Other', description: 'Specify if none apply.' },
];

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

type UploadedFilesState = {
    [key: string]: File[];
};

const FileUploadArea: React.FC<{ category: string; onFileUpload: (category: string, files: FileList) => void; }> = ({ category, onFileUpload }) => {
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
            onFileUpload(category, e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileUpload(category, e.target.files);
        }
    };

    return (
        <div onDragEnter={handleDrag} className="relative">
            <label 
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-sentinel-card border-2 border-dashed rounded-lg appearance-none cursor-pointer border-sentinel-border hover:border-sentinel-text-secondary focus:outline-none ${isDragging ? 'border-sentinel-primary' : ''}`}>
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


const Integrations: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleCategory = (title: string) => {
        setSelectedCategories(prev => {
            const newSelection = prev.includes(title) ? prev.filter(c => c !== title) : [...prev, title];
            // Also update uploaded files state
            setUploadedFiles(currentFiles => {
                const newFiles = {...currentFiles};
                if (!newSelection.includes(title)) {
                    delete newFiles[title];
                } else if (!newFiles[title]) {
                    newFiles[title] = [];
                }
                return newFiles;
            });
            return newSelection;
        });
    };

    const handleAddFiles = (category: string, files: FileList) => {
        const newFiles = Array.from(files);
        setUploadedFiles(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), ...newFiles],
        }));
    };

    const handleRemoveFile = (category: string, fileToRemove: File) => {
        setUploadedFiles(prev => ({
            ...prev,
            [category]: prev[category].filter(file => file !== fileToRemove),
        }));
    };
    
    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleProcess = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            handleNext();
        }, 2000);
    };

    const canProceedToUpload = selectedCategories.length > 0;
    const canProceedToReview = selectedCategories.every(cat => uploadedFiles[cat]?.length > 0);

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="bg-sentinel-main p-8 rounded-xl border border-sentinel-border">
                        <h2 className="text-xl font-bold text-sentinel-text-primary">Select Document Categories</h2>
                        <p className="text-sentinel-text-secondary mb-8">Choose the types of business documents you want to upload. This helps the AI understand their context.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documentCategories.map(cat => {
                                const isSelected = selectedCategories.includes(cat.title);
                                return (
                                    <div key={cat.title} onClick={() => toggleCategory(cat.title)} className={`bg-sentinel-card p-6 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-sentinel-primary' : 'border-sentinel-border hover:border-sentinel-text-secondary'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="text-2xl mb-4">{cat.icon}</div>
                                            <input type="checkbox" checked={isSelected} readOnly className="form-checkbox h-5 w-5 rounded bg-sentinel-main border-sentinel-border text-sentinel-primary focus:ring-sentinel-primary"/>
                                        </div>
                                        <h3 className="font-bold text-sentinel-text-primary">{cat.title}</h3>
                                        <p className="text-sm text-sentinel-text-secondary mt-1">{cat.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 2:
                return (
                     <div className="bg-sentinel-main p-8 rounded-xl border border-sentinel-border">
                        <h2 className="text-xl font-bold text-sentinel-text-primary">Upload Documents</h2>
                        <p className="text-sentinel-text-secondary mb-8">Add files for each selected category. You can drag and drop files or click to browse.</p>
                        <div className="space-y-6">
                            {selectedCategories.map(category => (
                                <div key={category}>
                                    <h3 className="font-semibold text-sentinel-text-primary mb-2">{category}</h3>
                                    <FileUploadArea category={category} onFileUpload={handleAddFiles} />
                                    <div className="mt-4 space-y-2">
                                        {uploadedFiles[category]?.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-sentinel-card p-2 rounded-md text-sm">
                                                <span className="text-sentinel-text-primary truncate">{file.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sentinel-text-secondary">{formatBytes(file.size)}</span>
                                                    <button onClick={() => handleRemoveFile(category, file)} className="text-sentinel-text-secondary hover:text-sentinel-red">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-sentinel-main p-8 rounded-xl border border-sentinel-border">
                        <h2 className="text-xl font-bold text-sentinel-text-primary">Review & Process</h2>
                        <p className="text-sentinel-text-secondary mb-8">Please review the categories and documents below before starting the process.</p>
                        <div className="space-y-4">
                            {selectedCategories.map(category => (
                                <div key={category}>
                                    <h3 className="font-semibold text-sentinel-text-primary mb-2 border-b border-sentinel-border pb-2">{category}</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-sentinel-text-secondary pl-2 mt-2">
                                        {uploadedFiles[category]?.map((file, index) => (
                                            <li key={index}>{file.name} ({formatBytes(file.size)})</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                     <div className="bg-sentinel-main p-8 rounded-xl border border-sentinel-border text-center">
                        <SuccessRateIcon className="w-16 h-16 text-sentinel-green mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-sentinel-text-primary">Processing Complete</h2>
                        <p className="text-sentinel-text-secondary mt-2 mb-6">Your documents have been successfully uploaded and are now being processed by the AI.</p>
                        <button onClick={() => setCurrentStep(1)} className="bg-sentinel-primary text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-sentinel-primary-hover transition-colors">
                            Onboard More Data
                        </button>
                    </div>
                );
        }
    };


    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-sentinel-text-primary mb-2">Structured Data Onboarding</h1>
            <p className="text-sentinel-text-secondary mb-10">Guide your AI with specific business information. Upload documents into categorized sections to enhance accuracy.</p>

            {currentStep < 4 && (
                <div className="flex items-center justify-between mb-12">
                    {['Categorize Data', 'Upload Documents', 'Review & Process'].map((step, index) => {
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
                                {index < 2 && <div className={`flex-1 h-px mx-4 transition-colors ${currentStep > stepNumber ? 'bg-sentinel-primary' : 'bg-sentinel-border'}`}></div>}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
            
            {renderStepContent()}

            {currentStep < 4 && (
                <div className="flex items-center justify-between mt-8">
                    <button 
                        onClick={handleBack} 
                        className="bg-sentinel-card text-sentinel-text-primary font-semibold py-2.5 px-6 rounded-lg hover:bg-sentinel-border transition-colors disabled:opacity-50" 
                        disabled={currentStep === 1}
                    >
                        ← Back
                    </button>
                    {currentStep === 3 ? (
                         <button 
                            onClick={handleProcess} 
                            disabled={isProcessing}
                            className="bg-sentinel-green text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isProcessing ? (
                                <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                                </>
                            ) : (
                                'Confirm & Process'
                            )}
                        </button>
                    ) : (
                        <button 
                            onClick={handleNext} 
                            className="bg-sentinel-primary text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-sentinel-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50" 
                            disabled={currentStep === 1 ? !canProceedToUpload : !canProceedToReview}
                        >
                            {currentStep === 1 ? 'Next: Upload Documents →' : 'Next: Review & Process →'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Integrations;
