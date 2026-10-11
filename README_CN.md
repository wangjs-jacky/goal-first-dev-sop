# 目标优先的开发与学习 SOP

当前保存的是一版可试用的规划，还未走完整个真实案例。

- [填写模板](templates/problem.template.md)：8 个简短问题，每题有提示与空白区域。
- [example 五步流程](example/AGENTS.md)：当前案例、线框流程图、任务入口与归档方式。
- [全局初始 Prompt](PROMPT.md)：直接复制给 AI，开启需求、接收任务、查看进度和沉淀结果。
- [AGENTS.md](AGENTS.md)：统一工作约定。

## 使用方式

开启需求 → 复制模板并填写 → AI 整理为 problem.md、保存附件并归档填写稿 → 整理大步骤 → 选择一个 Task 执行 → 结果与反馈存回该 Task → 调整下一步。

本例正式需求见 [example/problem.md](example/problem.md)，其中包含朋友面板截图。填写稿不再作为当前入口，但保存在 example/archive/intake/ 供追溯初始表达。

每个 Task 都有目标和完整 Prompt。当前状态以 Task 目录内 index.md 的 YAML 为准；不需要用户手动管理元数据。结果、笔记、证据与尝试都留在对应 Task 下，按需生成。

当前 Qv2ray 示例已根据用户反馈整理成五个 Task，但没有执行调研、POC、购买或部署。旧十步初稿已移至 [archive/v0.1](archive/v0.1/README_CN.md)，不再用于执行。
