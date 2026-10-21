import React, { useState, useRef } from 'react';
import { FileText, UploadCloud, Link as LinkIcon, X, CheckCircle2, Download, AlertCircle } from 'lucide-react';

/**
 * DeviceDocumentUpload
 * Allows teachers and administrators to upload official PDF notices, routines,
 * syllabi, and offline forms directly from their device (Mac/Windows/iOS/Android)
 * or enter an external document URL.
 */
export default function DeviceDocumentUpload({
  label = 'PDF Document / Offline Form Attachment',
  value = '',
  fileName = '',
  onChange,
  onFileNameChange,
  hint = 'Upload official notification PDF, examination routine, or application form'
}) {
  const [mode, setMode] = useState('device'); // 'device' | 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      alert('Please upload a valid PDF document (.pdf file).');
      return;
    }

    // Limit to 15MB for optimal base64 storage
    if (file.size > 15 * 1024 * 1024) {
      alert('The selected PDF file is too large (max 15MB). Please compress the PDF or enter a hosted URL.');
      return;
    }

    setIsProcessing(true);
    const sizeKb = Math.round(file.size / 1024);
    const formattedSize = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (onChange) onChange(dataUrl);
      if (onFileNameChange) onFileNameChange(file.name);
      setIsProcessing(false);
    };

    reader.onerror = () => {
      setIsProcessing(false);
      alert('Could not read the document file from your device.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearAttachment = () => {
    if (onChange) onChange('');
    if (onFileNameChange) onFileNameChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasAttachment = Boolean(value && value.trim());

  return (
    <div className="space-y-1.5 font-sans text-xs">
      {/* Label & Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block font-bold text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('device')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
              mode === 'device'
                ? 'bg-white text-[#002147] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload Device PDF
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
              mode === 'url'
                ? 'bg-white text-[#002147] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            PDF Link URL
          </button>
        </div>
      </div>

      {/* Upload Zone or URL Input */}
      {mode === 'device' ? (
        <div>
          {hasAttachment ? (
            /* Uploaded PDF Preview Card */
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 border border-red-200">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-[#002147] truncate block text-xs">
                    {fileName || 'Attached Official Document.pdf'}
                  </span>
                  <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 size={11} /> PDF ready for student download
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={fileName || 'Notice_Document.pdf'}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <Download size={11} /> Preview
                </a>
                <button
                  type="button"
                  onClick={clearAttachment}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                  title="Remove PDF"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ) : (
            /* Drag and Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#4a6b28] bg-emerald-50/60'
                  : 'border-slate-300 hover:border-[#4a6b28] hover:bg-slate-50/70 bg-white'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-0.5">
                  <UploadCloud size={18} />
                </div>
                <p className="font-semibold text-slate-700 text-xs">
                  {isProcessing ? 'Processing PDF...' : 'Click or drag & drop official PDF here'}
                </p>
                <p className="text-[10px] text-slate-400">
                  Supports .PDF up to 15MB (Exam Routines, Circulars, Application Forms)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* URL Input Mode */
        <div className="space-y-1">
          <div className="relative">
            <input
              type="url"
              placeholder="https://capitalcollege.edu.in/wp-content/.../routine.pdf"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                if (!fileName && e.target.value) {
                  const parts = e.target.value.split('/');
                  onFileNameChange(parts[parts.length - 1] || 'Attached_Notice.pdf');
                }
              }}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#4a6b28] pr-8"
            />
            {value && (
              <button
                type="button"
                onClick={clearAttachment}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400">
            Paste a direct public link to the PDF file hosted on WordPress or institutional servers.
          </p>
        </div>
      )}

      {hint && !hasAttachment && (
        <p className="text-[10px] text-slate-400 leading-tight">
          {hint}
        </p>
      )}
    </div>
  );
}
