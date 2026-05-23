import React, { useRef, useState, useCallback } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_CONFIG } from '../../api/config/constants';

const MultipleImageUpload = ({ maxImages = 10, images = [], setImages, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const removeImage = useCallback(
    (index) => {
      const updated = images.filter((_, i) => i !== index);
      setImages(updated);
      if (onUploadSuccess) onUploadSuccess(updated);
    },
    [images, setImages, onUploadSuccess]
  );

  const validateFiles = (files) => {
    const validFiles = [];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image.`);
        continue;
      }
      if (file.size > maxSize) {
        setError(`${file.name} is too large (Max 5MB).`);
        continue;
      }
      validFiles.push(file);
    }
    return validFiles;
  };

  const handleFiles = async (selectedFiles) => {
    setError(null);
    const filesToUpload = Array.from(selectedFiles);

    if (images.length + filesToUpload.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images.`);
      return;
    }

    const validatedFiles = validateFiles(filesToUpload);
    if (validatedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    validatedFiles.forEach((file) => formData.append('images', file));

    try {
      const res = await axios.post(`${API_CONFIG.BASE_URL}/api/v1/upload/multiple`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const newImages = res.data.data.map((img) => ({
          url: img,
          preview: img,
        }));

        const updatedList = [...images, ...newImages];
        setImages(updatedList);
        if (onUploadSuccess) onUploadSuccess(updatedList);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload images.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = ''; // Reset input
    }
  };

  console.log('Current images:', images);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">Event Banners</label>
        <span className="text-xs text-gray-500">
          {images.length}/{maxImages} Images
        </span>
      </div>

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
            >
              <img
                // src={img.preview}
                src={`${API_CONFIG.BASE_URL}${img.url}`}
                alt="banner"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
              />

              {i === 5 && images.length > 6 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white backdrop-blur-[2px]">
                  <span className="font-bold">+{images.length - 6}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition group-hover:opacity-100 hover:bg-red-500 hover:text-white sm:opacity-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !uploading && images.length < maxImages && fileRef.current?.click()}
        className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ${uploading ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white hover:border-green-400 hover:bg-green-50/30'} ${images.length >= maxImages ? 'hidden' : 'flex'}`}
      >
        <input
          type="file"
          ref={fileRef}
          multiple
          hidden
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            <p className="text-sm font-medium text-gray-600">Uploading files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center px-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <ImagePlus size={24} />
            </div>
            <p className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPG or WebP (Max. 5MB each)</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">{error}</div>
      )}
    </div>
  );
};

export default MultipleImageUpload;
