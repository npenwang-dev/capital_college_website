import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, X, CheckCircle2, RefreshCw } from 'lucide-react';

/**
 * DeviceImageUpload
 * Allows uploading images directly from the local device (Mac, Windows, iOS, Android)
 * with drag-and-drop, client-side auto-compression (via HTML5 Canvas),
 * image preview, and an optional URL tab fallback.
 */
export default function DeviceImageUpload({
  label = 'Image',
  value = '',
  onChange,
  required = false,
  aspectHint = 'Recommended: 16:9 landscape (e.g. 1920x1080) for Hero Slides'
}) {
  const [mode, setMode] = useState('device'); // 'device' | 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileDetails, setFileDetails] = useState(null);
  const fileInputRef = useRef(null);

  // Compress & convert file to optimized base64 data URL
  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, or GIF).');
      return;
    }

    setIsProcessing(true);
    const originalSizeKb = Math.round(file.size / 1024);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Offscreen canvas compression: maximum dimension 1600px
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1600;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Quality 0.86 provides crystal clear visuals while reducing size to 100-350KB
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.86);
          const approxKb = Math.round((optimizedDataUrl.length * 3) / 4 / 1024);

          setFileDetails({
            name: file.name,
            dimensions: `${width} × ${height}px`,
            size: `${approxKb} KB`,
            originalSize: `${originalSizeKb} KB`
          });

          onChange(optimizedDataUrl);
        } catch (err) {
          console.error('Image compression fallback:', err);
          onChange(e.target.result);
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setIsProcessing(false);
        alert('Could not parse the selected image file.');
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      setIsProcessing(false);
      alert('Failed to read the file from your device.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileDetails(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block font-bold text-gray-700 text-xs">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('device')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'device'
                ? 'bg-white text-[#4a6b28] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud size={13} />
            <span>Upload from Device</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'url'
                ? 'bg-white text-[#4a6b28] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon size={12} />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Mode 1: Device File Upload */}
      {mode === 'device' ? (
        <div>
          {value ? (
            /* Image Preview Card when an image is loaded */
            <div className="relative border-2 border-emerald-200/90 bg-emerald-50/20 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3.5">
              <div className="relative w-full sm:w-36 h-24 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200 shadow-xs">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1 text-left min-w-0 w-full">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Image Ready</span>
                </div>
                {fileDetails ? (
                  <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                    {fileDetails.name} • <span className="font-semibold text-slate-700">{fileDetails.dimensions}</span> ({fileDetails.size})
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">
                    {value.startsWith('data:') ? 'Device upload image data' : value}
                  </p>
                )}
                <p className="text-[10px] text-slate-500 mt-0.5">{aspectHint}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-[11px] font-bold text-[#4a6b28] bg-white border border-[#4a6b28]/40 hover:bg-[#4a6b28] hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Replace Image
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <X size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Dropzone when no image is loaded */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-[#4a6b28] bg-emerald-50/60 scale-[1.01]'
                  : 'border-slate-300 hover:border-[#4a6b28] bg-slate-50/70 hover:bg-emerald-50/30'
              }`}
            >
              {isProcessing ? (
                <div className="py-3 flex flex-col items-center gap-2">
                  <RefreshCw size={24} className="animate-spin text-[#4a6b28]" />
                  <span className="text-xs font-bold text-slate-700">Optimizing image from your device...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-100/70 text-[#4a6b28] flex items-center justify-center">
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to choose image from your device{' '}
                      <span className="text-slate-500 font-normal">or drag & drop here</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports JPG, PNG, WEBP, GIF (Automatically compressed for web)
                    </p>
                    {aspectHint && (
                      <p className="text-[10px] text-emerald-800/80 font-medium mt-1">
                        {aspectHint}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: External Image URL fallback */
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder="https://capitalcollege.edu.in/wp-content/uploads/..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border rounded-lg p-2 font-mono text-[11px] focus:outline-none focus:border-[#4a6b28] pr-8"
            />
            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear URL"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {value && (
            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
              <img
                src={value}
                alt="URL Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <p className="text-[10px] text-slate-500">{aspectHint}</p>
        </div>
      )}
    </div>
  );
}
