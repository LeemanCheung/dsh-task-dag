<h1 align="center">dsh-task-dag</h1>

<p align="center">
  DeepSeek Harness Web 的实时编排拓扑。<br>
  查看委派 Session、Agent Teams 共享任务与通信，以及持久 Workflow 运行。
</p>

<p align="center">
  <a href="https://awesome.re"><img alt="Awesome" src="https://awesome.re/badge.svg"></a>
  <a href="https://awesome-dsh-plugin.com"><img alt="Awesome DSH Plugin" src="https://awesome-dsh-plugin.com/badge.svg"></a>
  <a href="https://github.com/LeemanCheung/dsh-task-dag/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/LeemanCheung/dsh-task-dag/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/LeemanCheung/dsh-task-dag/releases/latest"><img alt="Release" src="https://img.shields.io/github/v/release/LeemanCheung/dsh-task-dag"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/github/license/LeemanCheung/dsh-task-dag"></a>
</p>

<p align="center">
  <a href="README.md">English</a> · 中文
</p>

![dsh-task-dag 视觉概览](docs/task-dag-preview.svg)

## 一览

`dsh-task-dag` 将 DSH 已有的 Client 投影组织为三个专项图视图。插件不维护另一套编排数据库，也不发送轮询请求；Session、Team 和 Workflow 状态均由 DSH 已拥有的投影重建。

| 视图 | 展示内容 |
| --- | --- |
| **总览** | 当前 Session、普通委派子代理、Team 成员与任务、Agent 通信和 Workflow 运行。 |
| **Agent Teams** | Team Lead、teammates、任务分配、真正的共享任务 `blockedBy` DAG，以及可关闭的通信覆盖层。 |
| **Workflow** | 持久 Workflow 运行、阶段分组和已启动成员。阶段边只表达展示分组，不冒充脚本依赖。 |

其他能力：

- **Agent 通信：** 按“发送方 → 接收方”聚合方向、消息数和待投递状态；点击通信边可查看最近 100 条消息的 quiet/wakeup 与投递元数据。界面仅预览文本 block，其他 block 只统计类型。
- **直接导航：** 可点击的 teammate、子代理和 Workflow 成员节点会打开真实 Session，前提是该 Session 仍显示在 Session 列表中。
- **画布控制：** 可适应全图、平移原始尺寸画布，或拖动节点并实时更新连线。
- **分视图布局：** 当前 Session 的三个视图分别保留手工位置；切换视图或关闭再打开面板不会丢失。切换 Session、刷新页面或重启 DSH 后恢复确定性的自动布局。
- **原生呈现：** 使用 DSH 主题语义 Token、状态文字与线型、响应式通信详情和 reduced-motion 行为。
- **生命周期安全：** Team 投影、词典、样式与 Slot UI 均由 Cordis 插件生命周期托管。

## 实际运行截图

截图来自正在运行的 DSH Web Session，标签已经匿名化；面板、控件、布局和图形呈现均为已链接插件的真实界面。

![dsh-task-dag 在 DSH Web 中运行](docs/screenshot.png)

## 安装

```powershell
dsh plugin --profile web add github:LeemanCheung/dsh-task-dag
```

首次安装后重启一次当前 DSH Web 进程并刷新页面，随后可在 Session 标题栏看到“任务 DAG”入口。

固定安装指定版本：

```powershell
dsh plugin --profile web add github:LeemanCheung/dsh-task-dag#v1.3.0
```

## 使用任务图

| 操作 | 结果 |
| --- | --- |
| 点击“任务 DAG” | 打开当前 Session 的图，并刷新观察中的子代理目录。 |
| 选择“总览”“Agent Teams”或“Workflow” | 切换拓扑，不会丢失另外两个视图在当前页面的手工布局。 |
| 切换消息图标 | 显示或隐藏 Agent 通信，不改变任务布局。 |
| 点击通信边 | 打开定向消息时间线；聚焦后也可按 `Enter` 或 `Space`。 |
| 点击 Agent 节点 | 当节点存在于 Session 列表时打开对应 Session；支持 `Enter` 和 `Space`。 |
| 拖动空白画布 / 拖动节点 | 平移原始尺寸画布，或调整节点并同步连线。 |
| 切换适应模式 | 在全图概览和原始尺寸可滚动画布之间切换。 |
| 手动刷新 | 刷新子代理目录；Team 和 Workflow 节点仍由投影驱动。 |
| 按 `Escape` 或关闭按钮 | 关闭面板，并将焦点还给入口按钮。 |

对话框没有焦点陷阱，也不支持通过键盘拖动面板、画布或节点。

## 架构

![dsh-task-dag 投影架构](docs/architecture.svg)

浏览器插件组合四类 Client 数据源：

- `SessionListState.byId` 与 `parentId` 提供普通子代理血缘。
- `SessionListState.subagentsByParent` 提供标签、模式、活动状态与目录健康信息。
- 持久 Agent Teams 事件提供成员、共享任务、排队消息与投递回执。
- `workflow-run` Conversation Node 提供 Workflow 运行、阶段分组、成员与结果。

插件拥有的隐藏 Conversation Node Definition 会把每个支持的 Team v1 事件投影为小型快照节点。图模型折叠最新成员和任务状态、匹配消息投递回执、聚合定向通信、构建显式多入边，并应用确定性、非递归的拓扑布局；UI 最终渲染到 `conversation.session.header.actions`。

整个过程不存在模型 Prompt 注入、模型 Tool、Host RPC 端点、网络请求、轮询循环或第二套持久层。

### 投影边界

- Agent Teams 将任务板和消息日志写入 **Team Lead Session**。Teammate Session 无法通过这个纯 Client 插件读取 Lead 日志，因此 Team 视图会引导打开可见的父 Session，而不是新增跨 Session Host RPC。
- 只有 `blockedBy` 显示为真实 Team 任务依赖。通信可能双向成环，因此只作为覆盖层，永不参与 DAG 分层。
- 持久 Workflow 阶段是进度分组，不能恢复脚本内部完整的 `parallel()` 或 `pipeline()` 控制流，界面不会将其标记为执行依赖。
- 普通血缘必须通过 `origin: "subagent"` 追溯到当前 Session；孤儿、缺失父节点的链路和血缘循环会忽略。异常依赖环会进入确定性的兜底层，而不会阻塞渲染。
- 同一个 Session 可以同时出现在 Team 与 Workflow 上下文中，因为两种节点表达不同的归属语义；它们都会导航到同一个 Session ID。

## 安全与权限

这是一个仅运行在浏览器中的只读可视化插件。它不读取工作区文件、不执行命令、不发起网络连接、不注册模型工具，也不持久化 Session 内容或凭据。消息摘要来自 Team Lead Session 已存在的文本 block，并且只在用户选中通信链路后显示。

安全报告方式与完整信任边界见 [SECURITY.md](SECURITY.md)。仓库已启用私密漏洞报告。

## 开发

运行时软件包声明 Node.js 20+。开发和锁定的 jsdom 测试栈应使用 Node.js 20.19+、22.13+ 或 24+；CI 当前使用 Node.js 22。

```bash
npm install
npm run check
```

检查流程会校验全部源码语法；测试 Team 事件投影、任务和通信折叠、Workflow 分组、任意 DAG 布局、深层血缘与异常环降级；重建浏览器 bundle；随后用 jsdom 覆盖三视图、通信层与有界详情、画布控件、分视图节点位置、焦点及 Session 导航。CI 还会拒绝已提交 `lib/client.js` 的生成漂移。

这些是纯模型与 jsdom 检查，而不是完整的 DSH Web E2E 环境。发布前还会在真实浏览器中验证当前 Web profile 的链接安装。

`scripts/build.mjs` 会将 `src/team-projection.js`、`src/graph-model.js`、`src/client.js` 和 `src/style.css` 嵌入已提交的 `lib/client.js`。不要直接修改生成文件。

## 排障

| 现象 | 检查方式 |
| --- | --- |
| 找不到“任务 DAG”入口 | 确认使用 Web profile，重启 `dsh web` 并刷新页面。 |
| Teammate Session 的 Team 视图为空 | 打开 Team Lead / 父 Session；共享任务和消息日志存放在那里。 |
| 节点无法打开 | 仅仍显示在 DSH Session 列表中的 Session 可导航。 |
| 子代理状态或标签疑似过期 | 点击“刷新”以刷新观察到的子代理目录。 |

## 卸载

```powershell
dsh plugin --profile web remove dsh-task-dag
```

## 许可证

[MIT](LICENSE) © LeemanCheung
