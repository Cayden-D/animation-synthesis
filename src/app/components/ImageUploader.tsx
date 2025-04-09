"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createSpriteFromFile } from '../utils/imageUtils';
import { useStore } from '../store/zustandStore';

const ImageUploader: React.FC = () => {
  const addSprite = useStore((state) => state.addSprite);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // 只接受图像文件
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    for (const file of imageFiles) {
      try {
        const sprite = await createSpriteFromFile(file);
        addSprite(sprite);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    }
  }, [addSprite]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        hover:bg-gray-50 transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
        
        <div className="text-sm text-gray-600">
          {isDragActive ? (
            <p>将图像放在这里...</p>
          ) : (
            <p>拖放图像文件到这里，或点击选择文件</p>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          支持 PNG, JPG, JPEG, GIF 格式
        </p>
      </div>
    </div>
  );
};

export default ImageUploader; 