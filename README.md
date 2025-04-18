# 游戏序列图工具

一个用于创建游戏序列精灵表(Sprite Sheet)的工具，能够排列角色图像、设置网格参数、预览动画和导出直接可用的序列精灵图。

## 功能特点

- 📁 **图像上传**：拖放或点击上传多个角色图像
- 🔄 **拖拽排序**：调整图像顺序以满足您的动画需求
- 📏 **网格设置**：灵活设置行数、列数、单元格大小和间隙
- ▶️ **动画预览**：实时预览动画效果，调整帧速率
- 🖼️ **精灵表预览**：查看最终精灵表的实时预览
- 💾 **导出精灵表**：将完成的精灵表导出为PNG或JPEG格式

## 技术栈

- **Next.js**：React框架，提供现代化的开发体验
- **TypeScript**：增强代码可靠性和开发体验
- **Tailwind CSS**：用于构建响应式用户界面
- **Zustand**：轻量级状态管理
- **React Dropzone**：处理文件拖放功能

## 快速开始

### 前提条件

- Node.js 18.0.0 或更高版本
- npm 或 yarn 或 pnpm

### 安装

1. 克隆仓库:

```bash
git clone https://github.com/Cayden-D/animation-synthesis.git
```

2. 安装依赖:

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 启动开发服务器:

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 使用方法

1. **上传图像**：拖放角色图像或点击上传区域选择文件
2. **排列图像**：拖拽列表中的图像调整顺序
3. **调整网格设置**：根据需要修改行数、列数、单元格大小和间隙
4. **预览动画**：使用动画预览面板查看动画效果，调整帧速率
5. **导出精灵表**：设置导出参数，点击"导出精灵表"按钮

## 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

## 许可证

MIT

## 联系方式

如有问题或建议，请提issue
