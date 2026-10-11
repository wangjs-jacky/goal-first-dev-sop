# 工程设计问答

这里记录工作流工程本身的设计问题。目标仓库或具体任务的问答写在其各自的 FAQ.md，不混入本文件。

## 2026-10-11 · 两层 AGENTS.md 有什么区别，需要哪些模板？

问题（归纳）：最外层 AGENTS.md 属于整个工作流工程，example/AGENTS.md 服务于目标仓库。文件应该分阶段生成，是否需要提前准备模板？

回答：两者职责不同。根 AGENTS.md 指导 AI 维护这套工程、使用模板、生成目标仓库所需文件；example/AGENTS.md 是目标仓库 AGENTS.md 的实例，负责该目标的需求、任务入口、执行与沉淀规则。example 是生成结果的示例，不是另一套工程规范。目标仓库不能依赖本工程的父目录文件才能使用。

模板建议：保留现有 problem.template.md 供用户填写，再逐步准备 agents.template.md、task-index.template.md、task-prompt.template.md。它们分别生成目标仓库 AGENTS.md、任务 index.md、任务 PROMPT.md。problem.md 根据真实输入整理；FAQ.md、IDEA.md、REFERENCES.md 先按简单约定在产生内容时生成，无需马上增加模板。

生成顺序：开启需求时只生成填写稿；提交后整理 problem.md 与附件；确认大步骤后生成目标仓库 AGENTS.md 和任务 index.md；用户要求完整 Prompt 时可以全部生成，但后续细节随当前步骤推进；问答、灵感、资料和结果产生时再归档。

现状与待改进：以上模板是建议，尚未创建。现有根 AGENTS.md 混入了 Qv2ray 案例内容，example 内的链接与 Prompt 仍依赖父目录 PROMPT.md 及 example/ 前缀。真正导出到目标仓库前需要分离这些依赖；本次只澄清职责并记录，不声称已经完成迁移。
