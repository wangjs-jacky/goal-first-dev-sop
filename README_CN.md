# 目标优先的开发与学习 SOP

当前为正式整理后的规划规范，可按阶段生成目标仓库文件；还未走完整个真实案例。

- [填写模板](templates/problem.template.md)：8 个简短问题，每题有提示与空白区域。
- [目标仓库模板](templates/agents.template.md)、[任务入口模板](templates/task-index.template.md)、[任务提示词模板](templates/task-prompt.template.md)：供 AI 按阶段生成，不需要用户填写。
- [example 五步流程](example/AGENTS.md)：当前案例、线框流程图、任务入口与归档方式。
- [全局初始 Prompt](PROMPT.md)：直接复制给 AI，开启需求、接收任务、查看进度和沉淀结果。
- [AGENTS.md](AGENTS.md)：统一工作约定。
- [工程设计问答](FAQ.md)：记录模板、生成流程及工程层与目标仓库层的职责讨论。

## 使用方式

开启需求 → 复制模板并填写 → AI 整理为 problem.md、保存附件并归档填写稿 → 整理大步骤 → 选择一个 Task 执行 → 结果与反馈存回该 Task → 调整下一步。

本例正式需求见 [example/problem.md](example/problem.md)，其中包含朋友面板截图。填写稿不再作为当前入口，但保存在 example/archive/intake/ 供追溯初始表达。

每个 Task 都有目标和完整 Prompt。index.md 顶部 YAML 只有 status：pending、running、review、done、blocked。由 AI 更新，不另建 PROGRESS.md。结果、笔记、证据与尝试都留在对应 Task 下，按需生成。

工程根 AGENTS.md 管模板和生成过程；example/AGENTS.md 管目标仓库的实际工作。example/ 可作为独立目录使用，通过自己的 PROMPT.md 开始，不依赖外层工程文件。

当前 Qv2ray 示例已根据用户反馈整理成五个 Task，但没有执行调研、POC、购买或部署。旧十步初稿已移至 [archive/v0.1](archive/v0.1/README_CN.md)，不再用于执行。
