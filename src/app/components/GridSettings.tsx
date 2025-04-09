"use client";

import React from 'react';
import { useStore } from '../store/zustandStore';

const GridSettings: React.FC = () => {
  const { gridSettings, updateGridSettings } = useStore(state => ({
    gridSettings: state.gridSettings,
    updateGridSettings: state.updateGridSettings
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue) && numValue > 0) {
      updateGridSettings({ [name]: numValue });
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-medium border-b">
        网格设置
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="columns" className="block text-sm font-medium text-gray-700 mb-1">
              列数
            </label>
            <input
              type="number"
              id="columns"
              name="columns"
              min="1"
              value={gridSettings.columns}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="rows" className="block text-sm font-medium text-gray-700 mb-1">
              行数
            </label>
            <input
              type="number"
              id="rows"
              name="rows"
              min="1"
              value={gridSettings.rows}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cellWidth" className="block text-sm font-medium text-gray-700 mb-1">
              单元格宽度 (像素)
            </label>
            <input
              type="number"
              id="cellWidth"
              name="cellWidth"
              min="1"
              value={gridSettings.cellWidth}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="cellHeight" className="block text-sm font-medium text-gray-700 mb-1">
              单元格高度 (像素)
            </label>
            <input
              type="number"
              id="cellHeight"
              name="cellHeight"
              min="1"
              value={gridSettings.cellHeight}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="gap" className="block text-sm font-medium text-gray-700 mb-1">
            间隙 (像素)
          </label>
          <input
            type="number"
            id="gap"
            name="gap"
            min="0"
            value={gridSettings.gap}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="mt-4 pt-3 border-t text-sm text-gray-500">
          <p>预计精灵表尺寸: {gridSettings.columns * gridSettings.cellWidth + (gridSettings.columns - 1) * gridSettings.gap} x {gridSettings.rows * gridSettings.cellHeight + (gridSettings.rows - 1) * gridSettings.gap} 像素</p>
        </div>
      </div>
    </div>
  );
};

export default GridSettings; 