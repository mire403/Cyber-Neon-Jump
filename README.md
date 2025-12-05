# Cyber Neon Jump ⚡🟩🟪

**A cyberpunk-themed infinite jumping game built with React + Canvas.**

赛博霓虹风格的极致跳跃小游戏，反应能力就是你的武器。

## 😎 截图展示（Screenshots）

🟦 **开始界面（Start System）**

<div align="center">
  <img src="https://github.com/mire403/Cyber-Neon-Jump/blob/main/cyber-neon-jump/%E6%A0%87%E9%A2%98%E9%A1%B5.jpg">
</div>

🟨 **进入游戏**

<div align="center">
  <img src="https://github.com/mire403/Cyber-Neon-Jump/blob/main/cyber-neon-jump/%E5%BC%80%E5%A7%8B.jpg">
</div>

🟪 **二段跳特写（Double Jump）**

<div align="center">
  <img src="https://github.com/mire403/Cyber-Neon-Jump/blob/main/cyber-neon-jump/%E5%8F%AF%E4%BA%8C%E6%AE%B5%E8%B7%B3.jpg">
</div>

🟥 **故障死亡界面（System Failure）**

<div align="center">
  <img src="https://github.com/mire403/Cyber-Neon-Jump/blob/main/cyber-neon-jump/%E5%A4%B1%E8%B4%A5%E9%A1%B5%E9%9D%A2.png">
</div>

## 🚀 游戏特色（Features）
### 🌈 1. 霓虹赛博美术风格

黑色深空背景 + 竖向亮线 + 横向微光网格

UI 按钮、标题、得分均为 **蓝紫渐变赛博霓虹字体**

Start System 界面会轻微**发光 + 闪烁**✨（很有进入系统的感觉）

### 🕹 2. 简洁但深度的操作（含二段跳）

**SPACE / 点击**：跳跃

**空中再次按**：二段跳（Double Jump）

粒子尾迹会在跳跃时拖出光效

落地会生成微小霓虹火花

让人根本停不下来.jpg 😭🔥

### 📈 3. 动态生成平台（每局独一无二）

平台宽度、间距、垂直偏移均为随机

随着游戏进行，平台数量与挑战逐渐升级

金色平台、紫色平台多种颜色样式（截图已展示）

你的操作必须实时适应关卡 ——
**真正意义上的动态跑酷**。

### 🏆 4. 实时得分系统 + 最高分持久化

右上角 UI 永久显示：

```makefile
SCORE: 000180
HIGH: 000260
```

Score：你当前的生存分数

High Score：通过 localStorage 自动记录历史最高纪录

你逃不掉，你会一直想刷新最高分 🤡

### 💀 5. 死亡动画 & 故障终止界面

当你掉落出底线，就会进入**System Failure**故障页面：

红色霓虹边框

居中故障 UI 卡片

显示最终得分

“REBOOT” 按钮重新开始

非常有“系统无法承载你的菜”的感觉 😭

### 🧩 6. 技术栈与架构

**前端：React + TypeScript + Canvas API**

你提供的结构（UIOverlay + GameCanvas + App.tsx）构成一个干净的游戏引擎式架构：

```bash
src/
  ├── App.tsx           # 整体游戏状态管理（START / PLAYING / GAME_OVER）
  ├── GameCanvas.tsx    # 绘制画布、移动、跳跃、物理、平台生成、失败检测
  ├── UIOverlay.tsx     # UI 控制层：开始界面、得分、失败界面
  ├── styles.css        # 全局黑色赛博风样式
```

Canvas 使用**requestAnimationFrame**实现高性能循环渲染。

## 🎮 怎么玩（How to Play）

按下 SPACE 或 点击屏幕开始

平台会从右向左移动

抓住时机跳跃！

空中再次按可二段跳（Double Jump）

不要掉下去，否则迎来：

**SYSTEM FAILURE** 🚨
Final Score: xxx

点击**REBOOT**可立刻重启系统。

## 📦 安装与运行（Install & Run）

```bash
git clone <your_repo_url>
cd cyber-neon-jump
npm install
npm run dev
```

浏览器访问：

```arduino
http://localhost:5173/
```

## 🧠 开发亮点（For Developers）

自实现简约版物理系统（重力 / 加速度 / 速度限制）

流畅的 requestAnimationFrame 循环渲染

平台根据 cameraOffset 产生类“地图前进”效果

粒子系统使用随机衰减 + 随机扩散实现光点拖尾

UI 与渲染完全解耦，利于升级与扩展

## ⭐ Star Support

如果你觉得这个项目对你有帮助，请给仓库点一个 ⭐ Star！
你的鼓励是我继续优化此项目的最大动力 😊
