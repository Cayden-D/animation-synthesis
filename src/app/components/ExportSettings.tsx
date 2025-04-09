"use client";

import React, { useState } from 'react';
import { useStore } from '../store/zustandStore';
import { createSpriteSheet, downloadBlob } from '../utils/imageUtils';

const ExportSettings: React.FC = () => {
  const { sprites, spriteOrder, gridSettings, exportSettings, updateExportSettings } = useStore(state => ({
    sprites: state.sprites,
    spriteOrder: state.spriteOrder,
    gridSettings: state.gridSettings,
    exportSettings: state.exportSettings,
    updateExportSettings: state.updateExportSettings
  }));

  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理文件名更改
  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateExportSettings({ filename: e.target.value });
  };

  // 处理格式更改
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateExportSettings({ 
      format: e.target.value as 'png' | 'jpeg' 
    });
  };

  // 处理品质更改（仅JPEG）
  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quality = parseFloat(e.target.value);
    if (!isNaN(quality) && quality >= 0 && quality <= 1) {
      updateExportSettings({ quality });
    }
  };

  // 导出精灵表
  const handleExport = async () => {
    if (sprites.length === 0) {
      setError('没有可导出的精灵图像');
      return;
    }

    try {
      setIsExporting(true);
      setError(null);

      const blob = await createSpriteSheet(
        sprites,
        spriteOrder,
        gridSettings,
        exportSettings
      );

      const extension = exportSettings.format === 'jpeg' ? 'jpg' : exportSettings.format;
      const filename = `${exportSettings.filename}.${extension}`;
      
      downloadBlob(blob, filename);
    } catch (err) {
      console.error('导出错误:', err);
      setError('导出精灵表时出错');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-medium border-b">
        导出设置
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-1">
            文件名
          </label>
          <input
            type="text"
            id="filename"
            value={exportSettings.filename}
            onChange={handleFilenameChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
              文件格式
            </label>
            <select
              id="format"
              value={exportSettings.format}
              onChange={handleFormatChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div>

          {exportSettings.format === 'jpeg' && (
            <div>
              <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
                品质: {Math.round(exportSettings.quality * 100)}%
              </label>
              <input
                type="range"
                id="quality"
                min="0.1"
                max="1"
                step="0.1"
                value={exportSettings.quality}
                onChange={handleQualityChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="pt-3">
          <button
            className={`w-full py-2 px-4 rounded font-medium ${
              sprites.length > 0 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleExport}
            disabled={isExporting || sprites.length === 0}
          >
            {isExporting ? '导出中...' : '导出精灵表'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportSettings; 