# Minidash

现代化、轻量级、自托管的分布式服务器监控系统（Hub、管理面板与高精度工控仪器风公开状态页）。

```text
minidash-agent (Linux) ──WebSocket / JSON-RPC 2.0──▶ minidash (Axum + SQLite) ──▶ 管理后台 + 工控状态页
```

## 🌟 核心特性

- **极致轻量**：纯 Rust 构建后端，低内存与低 CPU 开销，静态编译无需外部动态链接库；
- **实时遥测**：秒级硬件指标（CPU、内存、Swap、磁盘、实时网速吞吐、连接数、进程数）；
- **网络质量驾驶舱**：集成多线路网络延迟探测（Ping / TCP Ping），提供 RTT 均值、抖动、峰值与丢包率时序分析；
- **精密工控美学**：内置微倒角高精工业仪器风主题（`web-theme`），配备动态聚合全球节点拓扑地图与负荷热力矩阵；
- **自包含与数据私有**：完全自托管，零外部追踪，数据存储于调优的 SQLite WAL 数据库，支持热备份与一键恢复；
- **多通道告警**：节点离线（带防抖抑制机制）、流量超限预警、服务器到期提醒，直推 Telegram 或自定义 Webhook。

---

## 📦 项目组成与工程架构

| 模块 | 说明 | 技术栈 |
|---|---|---|
| **Hub 服务端** (`src/`) | 汇聚中心、API 服务、静态资产宿主 | Rust / Axum / Tokio / SQLite |
| **管理后台** (`web-admin/`) | 节点管理、探针分发、告警与系统设置 | React 19 / Vite / Tailwind v4 / Radix UI |
| **内置主题** (`web-theme/`) | 默认公开状态展示页、拓扑图、延迟驾驶舱 | React 19 / Vite / Tailwind v4 / Recharts |

---

## 🚀 快速开始

### 1. 服务端一键安装（Linux）

```bash
curl -fsSL https://raw.githubusercontent.com/XideaDev/MiniDash/main/install-hub.sh -o install-hub.sh
chmod +x install-hub.sh
sudo ./install-hub.sh
```

### 2. 探针端一键纳管

在管理后台（默认路径 `/admin`）点击「添加节点」或打开「一小时注册窗口」，复制生成的单行命令在待监控的主机上执行：

```bash
curl -fsSL https://your-domain.com/install.sh | sudo sh -s -- --token <NODE_TOKEN>
```

---

## 🛠️ 本地开发与构建

### 环境要求
- Rust 1.80+
- Node.js 20+ 及 npm

### 构建流程

```bash
# 1. 构建管理面板
cd web-admin && npm install && npm run build && cd ..

# 2. 构建内置工控主题
cd web-theme && npm install && npm run build && cd ..

# 3. 运行本地 Hub 服务
cargo run -- --listen 127.0.0.1:28080 --db minidash.db
```

访问 `http://127.0.0.1:28080/admin` 打开管理后台，访问 `http://127.0.0.1:28080/` 浏览公开状态页。

---

## 📄 开源许可

本项目遵循 [MIT License](./LICENSE) 协议。
