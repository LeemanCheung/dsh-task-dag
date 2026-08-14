# dsh-task-dag

[English](README.md)

DeepSeek Harness Web 的持久实时任务 DAG 插件，将当前会话、委派子代理与持久工作流运行展示为一张自顶向下的依赖图。

## 功能

- 从 DSH Session 快照与持久 `workflow-run` Conversation Node 构图。
- 不依赖进程内缓存，DSH 重启后仍可恢复工作流历史。
- 工作流成员归入工作流节点，避免父会话到成员的重复直连边。
- 使用响应式投影更新，不轮询 Host。
- 点击可导航的子代理节点即可打开对应会话。
- 支持适应视口、原始尺寸、根节点自动居中、面板拖拽、键盘关闭和手动刷新目录。
- 使用 DSH semantic theme tokens 与原生 SVG 图标，自动适配浅色和深色主题。

## 安装

```powershell
dsh plugin --profile web add github:LeemanCheung/dsh-task-dag
```

首次安装后重启一次当前 DSH Web 进程并刷新页面，随后可在会话标题栏看到“任务 DAG”入口。

卸载：

```powershell
dsh plugin --profile web remove dsh-task-dag
```

## 架构

插件完全由 Client 投影驱动，读取：

- `SessionListState.byId` 与 `parentId`：子代理血缘。
- `SessionListState.subagentsByParent`：标签、模式与活动状态。
- 持久 `workflow-run` Conversation Node：工作流阶段、成员与结果。

插件不会添加模型工具、Prompt、Schema、RPC 轮询或进程内工作流存储。

## 开发

```bash
npm install
npm run check
```

`npm run check` 会重建浏览器模块，并执行语法检查与 jsdom 交互冒烟测试，覆盖工作流分组、适应视口、关闭控件和节点导航。

## 许可证

[MIT](LICENSE)
