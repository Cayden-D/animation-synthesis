"use client";

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useStore } from '../store/zustandStore';
import { SpriteImage } from '../types';

const SpriteSheetPreview: React.FC = () => {
  // 使用更精细的选择器，只订阅需要的状态
  const sprites = useStore(state => state.sprites);
  const spriteOrder = useStore(state => state.spriteOrder);
  const gridSettings = useStore(state => state.gridSettings);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasMountedRef = useRef(false); // 用于跟踪组件是否已挂载
  
  // 使用 useMemo 缓存计算结果
  const orderedSprites = useMemo(() => {
    return spriteOrder
      .map(id => sprites.find(sprite => sprite.id === id))
      .filter((sprite): sprite is SpriteImage => !!sprite);
  }, [sprites, spriteOrder]);
  
  // 使用 useMemo 缓存尺寸计算
  const dimensions = useMemo(() => {
    const totalWidth = gridSettings.columns * gridSettings.cellWidth + (gridSettings.columns - 1) * gridSettings.gap;
    const totalHeight = gridSettings.rows * gridSettings.cellHeight + (gridSettings.rows - 1) * gridSettings.gap;
    return { totalWidth, totalHeight };
  }, [gridSettings.columns, gridSettings.rows, gridSettings.cellWidth, gridSettings.cellHeight, gridSettings.gap]);

  // 使用useCallback包装drawSpriteSheet函数
  const drawSpriteSheet = useCallback(async () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    try {
      // 设置canvas大小
      canvas.width = dimensions.totalWidth;
      canvas.height = dimensions.totalHeight;
      
      // 初始化 - 用网格背景填充
      ctx.fillStyle = '#f9fafb'; // 浅灰色背景
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制网格线
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      
      // 绘制垂直线
      for (let i = 1; i < gridSettings.columns; i++) {
        const x = i * (gridSettings.cellWidth + gridSettings.gap) - gridSettings.gap / 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.totalHeight);
        ctx.stroke();
      }
      
      // 绘制水平线
      for (let i = 1; i < gridSettings.rows; i++) {
        const y = i * (gridSettings.cellHeight + gridSettings.gap) - gridSettings.gap / 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.totalWidth, y);
        ctx.stroke();
      }
      
      // 使用Promise.all来等待所有图像加载
      const loadImagePromises = orderedSprites.map((sprite, index) => {
        if (index >= gridSettings.rows * gridSettings.columns) {
          return Promise.resolve(); // 跳过超出网格的图像
        }
        
        return new Promise<void>((resolve) => {
          const row = Math.floor(index / gridSettings.columns);
          const col = index % gridSettings.columns;
          
          const x = col * (gridSettings.cellWidth + gridSettings.gap);
          const y = row * (gridSettings.cellHeight + gridSettings.gap);
          
          const img = new Image();
          img.onload = () => {
            // 计算缩放和居中
            const scale = Math.min(
              gridSettings.cellWidth / img.width,
              gridSettings.cellHeight / img.height
            );
            
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            
            // 居中放置图像
            const offsetX = (gridSettings.cellWidth - scaledWidth) / 2;
            const offsetY = (gridSettings.cellHeight - scaledHeight) / 2;
            
            ctx.drawImage(
              img,
              x + offsetX,
              y + offsetY,
              scaledWidth,
              scaledHeight
            );
            
            resolve();
          };
          img.onerror = () => {
            console.error('Failed to load image:', sprite.src);
            resolve();
          };
          img.src = sprite.src;
        });
      });
      
      // 等待所有图像加载和绘制
      await Promise.all(loadImagePromises);
    } catch (error) {
      console.error('Error drawing sprite sheet:', error);
    }
  }, [dimensions, gridSettings, orderedSprites]);

  // 使用防抖方式重新绘制
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    // 使用ref避免初始渲染时的多次调用
    if (hasMountedRef.current) {
      timeoutId = setTimeout(() => {
        drawSpriteSheet();
      }, 100); // 添加短暂延迟减少频繁重绘
    } else {
      hasMountedRef.current = true;
      drawSpriteSheet();
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [drawSpriteSheet]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-medium border-b">
        精灵表预览
      </div>
      <div className="p-4">
        <div className="overflow-auto bg-white border rounded-lg">
          {sprites.length > 0 ? (
            <canvas 
              ref={canvasRef} 
              className="max-w-full"
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              无精灵图像可用于预览
            </div>
          )}
        </div>

        {sprites.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            精灵表尺寸: {dimensions.totalWidth} x {dimensions.totalHeight} 像素
            | 单元格: {gridSettings.columns} x {gridSettings.rows}
            | 精灵数量: {sprites.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpriteSheetPreview; 