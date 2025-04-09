import { SpriteImage, GridSettings, ExportSettings } from '../types';

/**
 * 从文件加载图像并返回Promise
 */
export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * 从文件创建精灵图像对象
 */
export const createSpriteFromFile = async (file: File): Promise<SpriteImage> => {
  const img = await loadImageFromFile(file);
  const id = generateId();

  return {
    id,
    src: URL.createObjectURL(file),
    name: file.name,
    width: img.width,
    height: img.height,
    blob: file,
  };
};

/**
 * 根据grid设置和精灵列表创建序列精灵表
 */
export const createSpriteSheet = (
  sprites: SpriteImage[],
  spriteOrder: string[],
  gridSettings: GridSettings,
  exportSettings: ExportSettings
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // 创建canvas元素
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Cannot get canvas context');
      }

      // 设置canvas大小
      const totalWidth = gridSettings.columns * gridSettings.cellWidth + (gridSettings.columns - 1) * gridSettings.gap;
      const totalHeight = gridSettings.rows * gridSettings.cellHeight + (gridSettings.rows - 1) * gridSettings.gap;
      canvas.width = totalWidth;
      canvas.height = totalHeight;

      // 确保有足够的精灵图像
      const orderedSprites = spriteOrder
        .map(id => sprites.find(sprite => sprite.id === id))
        .filter((sprite): sprite is SpriteImage => !!sprite);

      // 在canvas上绘制精灵图像
      orderedSprites.forEach((sprite, index) => {
        if (index >= gridSettings.rows * gridSettings.columns) {
          return; // 跳过超出网格的图像
        }

        const row = Math.floor(index / gridSettings.columns);
        const col = index % gridSettings.columns;
        
        const x = col * (gridSettings.cellWidth + gridSettings.gap);
        const y = row * (gridSettings.cellHeight + gridSettings.gap);
        
        // 加载图像并绘制到canvas
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
        };
        img.src = sprite.src;
      });

      // 当所有图像加载完成后导出canvas为blob
      setTimeout(() => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create sprite sheet'));
            }
          },
          `image/${exportSettings.format}`,
          exportSettings.format === 'jpeg' ? exportSettings.quality : undefined
        );
      }, 500); // 给图像加载一些时间
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 下载blob为文件
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 