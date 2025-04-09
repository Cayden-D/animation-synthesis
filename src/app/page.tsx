import React from 'react';
import StoreProvider from './components/StoreProvider';
import ImageUploader from './components/ImageUploader';
import SpriteList from './components/SpriteList';
import GridSettings from './components/GridSettings';
import AnimationPreview from './components/AnimationPreview';
import ExportSettings from './components/ExportSettings';
import SpriteSheetPreview from './components/SpriteSheetPreview';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">游戏序列图工具</h1>
          <p className="mt-2 text-sm text-gray-600">
            上传、排列、预览和导出游戏精灵表
          </p>
        </div>

        <StoreProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧面板 */}
            <div className="space-y-6">
              <ImageUploader />
              <SpriteList />
            </div>

            {/* 中间面板 */}
            <div className="space-y-6">
              <GridSettings />
              <AnimationPreview />
            </div>

            {/* 右侧面板 */}
            <div className="space-y-6">
              <ExportSettings />
              <SpriteSheetPreview />
            </div>
          </div>
        </StoreProvider>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>游戏序列图工具 &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}
