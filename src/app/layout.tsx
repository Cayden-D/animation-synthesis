import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <title>游戏序列图工具 - 精灵表生成器</title>
        <meta name="description" content="一个用于创建游戏序列精灵表的工具，可以排列角色图像、设置网格参数、预览动画和导出精灵表。" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

export const metadata = {
  title: '游戏序列图工具 - 精灵表生成器',
  description: '一个用于创建游戏序列精灵表的工具，可以排列角色图像、设置网格参数、预览动画和导出精灵表。',
};
