export interface SpriteImage {
  id: string;
  src: string;
  name: string;
  width: number;
  height: number;
  blob?: Blob;
}

export interface GridSettings {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
}

export interface AnimationSettings {
  frameRate: number;
  isPlaying: boolean;
  currentFrame: number;
}

export interface ExportSettings {
  format: 'png' | 'jpeg';
  quality: number; // 0-1 for jpeg
  filename: string;
} 