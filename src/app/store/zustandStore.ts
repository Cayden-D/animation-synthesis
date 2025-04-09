'use client';

import { create } from 'zustand';
import { createJSONStorage, persist, devtools } from 'zustand/middleware';
import { SpriteImage, GridSettings, AnimationSettings, ExportSettings } from '../types';

// 确保sessionStorage在服务器端不会报错
const getStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    };
  }
  return sessionStorage;
};

// 定义状态接口
interface StoreState {
  sprites: SpriteImage[];
  spriteOrder: string[]; // array of sprite ids in display order
  gridSettings: GridSettings;
  animationSettings: AnimationSettings;
  exportSettings: ExportSettings;
  
  // Actions
  addSprite: (sprite: SpriteImage) => void;
  removeSprite: (id: string) => void;
  reorderSprites: (newOrder: string[]) => void;
  updateGridSettings: (settings: Partial<GridSettings>) => void;
  updateAnimationSettings: (settings: Partial<AnimationSettings>) => void;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
  clearSprites: () => void;
}

// 创建默认状态
const defaultState: Omit<StoreState, 'addSprite' | 'removeSprite' | 'reorderSprites' | 'updateGridSettings' | 'updateAnimationSettings' | 'updateExportSettings' | 'clearSprites'> = {
  sprites: [],
  spriteOrder: [],
  gridSettings: {
    columns: 4,
    rows: 4,
    cellWidth: 64,
    cellHeight: 64,
    gap: 0,
  },
  animationSettings: {
    frameRate: 12,
    isPlaying: false,
    currentFrame: 0,
  },
  exportSettings: {
    format: 'png' as const,
    quality: 1,
    filename: 'sprite-sheet',
  },
};

// 使用带有持久化的方法创建store
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      ...defaultState,
      
      // Actions
      addSprite: (sprite) => 
        set((state) => {
          const sprites = [...state.sprites, sprite];
          const spriteOrder = [...state.spriteOrder, sprite.id];
          return { sprites, spriteOrder };
        }),

      removeSprite: (id) => 
        set((state) => {
          const sprites = state.sprites.filter((sprite) => sprite.id !== id);
          const spriteOrder = state.spriteOrder.filter((spriteId) => spriteId !== id);
          return { sprites, spriteOrder };
        }),

      reorderSprites: (newOrder) => 
        set(() => ({ spriteOrder: newOrder })),

      updateGridSettings: (settings) => 
        set((state) => ({
          gridSettings: { ...state.gridSettings, ...settings },
        })),

      updateAnimationSettings: (settings) => 
        set((state) => ({
          animationSettings: { ...state.animationSettings, ...settings },
        })),

      updateExportSettings: (settings) => 
        set((state) => ({
          exportSettings: { ...state.exportSettings, ...settings },
        })),

      clearSprites: () => 
        set(() => ({ sprites: [], spriteOrder: [] })),
    }),
    {
      name: 'sprite-sheet-storage',
      storage: createJSONStorage(() => getStorage()),
      partialize: (state) => ({
        // 持久化所有重要的状态数据，但不包括 blob
        sprites: state.sprites.map(sprite => ({
          ...sprite,
          blob: undefined // 不持久化 blob 数据
        })),
        spriteOrder: state.spriteOrder,
        gridSettings: state.gridSettings,
        animationSettings: state.animationSettings,
        exportSettings: state.exportSettings
      }),
      // 添加自定义选项，避免hydration问题
      skipHydration: true
    }
  )
); 