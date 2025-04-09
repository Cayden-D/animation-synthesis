"use client";

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useStore } from '../store/zustandStore';
import { SpriteImage } from '../types';

const AnimationPreview: React.FC = () => {
  const { sprites, spriteOrder, animationSettings, updateAnimationSettings } = useStore(state => ({
    sprites: state.sprites,
    spriteOrder: state.spriteOrder,
    animationSettings: state.animationSettings,
    updateAnimationSettings: state.updateAnimationSettings
  }));

  // 使用本地状态来显示当前帧，而不是经常更新全局状态
  const [displayFrame, setDisplayFrame] = useState(animationSettings.currentFrame);
  const animationRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 添加ref来跟踪当前frame，避免在useEffect中直接更新state
  const currentFrameRef = useRef<number>(animationSettings.currentFrame);

  // 处理播放/暂停状态更改
  const togglePlay = () => {
    updateAnimationSettings({ isPlaying: !animationSettings.isPlaying });
  };

  // 更新帧速率
  const handleFrameRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frameRate = parseInt(e.target.value, 10);
    if (!isNaN(frameRate) && frameRate > 0) {
      updateAnimationSettings({ frameRate });
    }
  };

  // 绘制当前帧到canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;
    
    // 清除canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 获取当前帧的精灵
    const orderedSprites = spriteOrder
      .map(id => sprites.find(sprite => sprite.id === id))
      .filter((sprite): sprite is SpriteImage => !!sprite);
    
    // 确保有精灵可以显示
    if (orderedSprites.length === 0) return;
    
    // 计算帧索引，如果超出范围则循环
    const actualFrameIndex = frameIndex % orderedSprites.length;
    const sprite = orderedSprites[actualFrameIndex];
    
    if (!sprite) return;
    
    // 加载图像
    const img = new Image();
    img.onload = () => {
      // 调整canvas大小以匹配图像，保持纵横比
      const maxSize = Math.min(canvas.parentElement?.clientWidth || 300, 300);
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // 绘制图像
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = sprite.src;
  }, [sprites, spriteOrder]);

  // 动画循环
  useEffect(() => {
    let isMounted = true;
    
    const animate = () => {
      if (!isMounted || !animationSettings.isPlaying) return;
      
      // 使用ref跟踪当前帧，而不是直接在useEffect中更新state
      currentFrameRef.current = (currentFrameRef.current + 1) % Math.max(1, spriteOrder.length);
      
      // 绘制当前帧
      drawFrame(currentFrameRef.current);
      
      // 更新本地状态显示当前帧，不触发全局状态更新
      setDisplayFrame(currentFrameRef.current);
      
      // 仅在动画结束时更新全局状态，减少状态更新频率
      if (!animationSettings.isPlaying) {
        updateAnimationSettings({ currentFrame: currentFrameRef.current });
      }
      
      // 计算下一帧的延迟时间
      const delay = 1000 / animationSettings.frameRate;
      animationRef.current = window.setTimeout(animate, delay);
    };

    // 仅当播放状态变化时启动或停止动画
    if (animationSettings.isPlaying) {
      currentFrameRef.current = animationSettings.currentFrame;
      animate();
    } else if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
      // 仅在停止播放时更新全局状态
      updateAnimationSettings({ currentFrame: currentFrameRef.current });
    }

    // 如果没有播放但有精灵，绘制当前帧
    if (!animationSettings.isPlaying && sprites.length > 0) {
      drawFrame(animationSettings.currentFrame);
    }

    // 清理函数
    return () => {
      isMounted = false;
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [
    animationSettings.isPlaying, 
    animationSettings.frameRate, 
    drawFrame, 
    sprites.length, 
    spriteOrder.length
  ]); // 移除animationSettings.currentFrame从依赖中

  // 当currentFrame由外部更新时单独处理
  useEffect(() => {
    currentFrameRef.current = animationSettings.currentFrame;
    if (!animationSettings.isPlaying && sprites.length > 0) {
      drawFrame(animationSettings.currentFrame);
    }
  }, [animationSettings.currentFrame, animationSettings.isPlaying, drawFrame, sprites.length]);

  // 监听窗口大小调整
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // 在渲染中使用本地状态而不是全局状态
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-medium border-b">
        动画预览
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-center bg-gray-50 border rounded-lg p-4">
          {sprites.length > 0 ? (
            <canvas 
              ref={canvasRef} 
              className="max-w-full"
              width={300}
              height={300}
            />
          ) : (
            <div className="text-gray-500 h-[300px] flex items-center justify-center">
              无精灵图像可用于预览
            </div>
          )}
        </div>

        <div className="flex space-x-2 items-center">
          <button
            className={`px-4 py-2 rounded font-medium ${sprites.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            onClick={togglePlay}
            disabled={sprites.length === 0}
          >
            {animationSettings.isPlaying ? '暂停' : '播放'}
          </button>

          <div className="flex-grow">
            <label htmlFor="frameRate" className="block text-sm font-medium text-gray-700 mb-1">
              帧速率: {animationSettings.frameRate} FPS
            </label>
            <input
              type="range"
              id="frameRate"
              min="1"
              max="60"
              value={animationSettings.frameRate}
              onChange={handleFrameRateChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={sprites.length === 0}
            />
          </div>
        </div>

        {sprites.length > 0 && (
          <div className="text-sm text-gray-500">
            帧: {displayFrame + 1} / {sprites.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimationPreview; 