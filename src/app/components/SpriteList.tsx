"use client";

import React, { useState, useMemo } from 'react';
import { useStore } from '../store/zustandStore';
import { SpriteImage } from '../types';
import classNames from 'classnames';

const SpriteList: React.FC = () => {
  const { sprites, spriteOrder, removeSprite, reorderSprites } = useStore(state => ({
    sprites: state.sprites,
    spriteOrder: state.spriteOrder,
    removeSprite: state.removeSprite,
    reorderSprites: state.reorderSprites
  }));

  const [draggedId, setDraggedId] = useState<string | null>(null);

  // 使用 useMemo 缓存 orderedSprites 的计算结果，避免重复计算导致无限循环
  const orderedSprites = useMemo(() => {
    if (sprites.length === 0) return [];
    
    return spriteOrder
      .map(id => sprites.find(sprite => sprite.id === id))
      .filter((sprite): sprite is SpriteImage => !!sprite);
  }, [sprites, spriteOrder]);

  if (sprites.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center bg-gray-50">
        <p className="text-gray-500">没有上传图像</p>
      </div>
    );
  }

  // 处理拖拽开始
  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  // 处理放置
  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    // 创建新的排序
    const newOrder = [...spriteOrder];
    const draggedIndex = newOrder.indexOf(draggedId);
    const targetIndex = newOrder.indexOf(targetId);

    // 将拖拽的项目移动到目标位置
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedId);

    // 更新排序
    reorderSprites(newOrder);
    setDraggedId(null);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-medium border-b">
        精灵图像 ({sprites.length})
      </div>
      <ul className="divide-y">
        {orderedSprites.map((sprite) => (
          <li 
            key={sprite.id}
            className={classNames(
              'flex items-center p-3 hover:bg-gray-50 transition-colors',
              { 'bg-blue-50': draggedId === sprite.id }
            )}
            draggable
            onDragStart={() => handleDragStart(sprite.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(sprite.id)}
          >
            <div className="flex-shrink-0 w-12 h-12 mr-3 bg-gray-100 border rounded flex items-center justify-center overflow-hidden">
              <img 
                src={sprite.src} 
                alt={sprite.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            <div className="flex-grow min-w-0">
              <p className="truncate text-sm font-medium">{sprite.name}</p>
              <p className="text-xs text-gray-500">
                {sprite.width} x {sprite.height}px
              </p>
            </div>
            
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => removeSprite(sprite.id)}
              title="删除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpriteList; 