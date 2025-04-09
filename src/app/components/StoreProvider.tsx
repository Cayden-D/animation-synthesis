'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { useStore } from '../store/zustandStore';

// 客户端提供者组件，解决hydration问题
export default function StoreProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  
  // 在客户端首次渲染后初始化store
  useEffect(() => {
    // 标记store已水合
    const unsubHydrate = useStore.persist.onHydrate(() => {
      console.log('Zustand store hydrating');
    });

    // 标记store已经水合完成
    const unsubFinishHydration = useStore.persist.onFinishHydration(() => {
      console.log('Zustand store hydration finished');
      setIsHydrated(true);
    });

    // 如果store已经水合完成，立即设置状态
    if (useStore.persist.hasHydrated()) {
      setIsHydrated(true);
    } else {
      // 手动触发水合
      useStore.persist.rehydrate();
    }

    // 清理函数
    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);
  
  // 在服务器端或水合之前显示加载状态
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">加载中...</div>
      </div>
    );
  }

  // 仅在客户端水合完成后渲染子组件
  return <>{children}</>;
} 