---
id: case-personal-proxy
type: case
status: clarifying
goal_revision: 1
confirmed_by: null
confirmed_at: null
---

# 从自建代理开始，验证一套目标优先的 SOP

[English](README.md) · [问题模板](templates/problem.template.md) · [Agent 流程约定](AGENTS.md)

当前为 v0.1 草案。先完成一个真实案例，再修订正式 SOP；暂不开发可视化界面、不接入 Obsidian、不展开每项任务文件。

## 目录约定

```text
templates/
  problem.template.md    # 可复制填写的空白模板
example/
  problem.template.md    # 本次测试的填写副本
prompts/
  problem.prompt.md      # 问题澄清入口
  t01.prompt.md          # T01 独立执行 Prompt
  …
  t10.prompt.md
AGENTS.md                # 流程约定
README_CN.md             # 当前案例、任务状态与 Prompt 索引
```

模板按 `xxx.template.md` 命名，Prompt 按 `xxx.prompt.md` 命名。新增内容归入对应目录；Prompt 文件不重复维护任务状态。

## 本次测试怎么开始

`templates/` 的内容已复制到 `example/`，当前只有一份问题模板。直接编辑 [example/problem.template.md](example/problem.template.md)，保留母版不动。

填写并保存后，告诉 AI：**「example 的需求已提好，请读取 example/problem.template.md 并开始处理。」** AI 会重新读取本地文件，必要时补问，再根据目标生成 Task。本次只初始化空白副本，尚未提交需求或生成新 Task。

下面的自建代理案例与任务仍是之前的参考草案，不自动作为 `example/` 的需求。

## 已表达的目标

- G1：从购买服务器开始，搭建自己可使用的代理服务，实现所需的网络访问。
- G2：能够说出核心流程与技术原理，并留下新手可复现的步骤。

用户原始意图已明确，无需重新询问“为什么要做”。尚未确认的是验收环境、范围和资源约束。

Qv2ray 是本次学习入口；客户端、代理核心、服务端与 VPN 并非同一概念，具体架构由调研确认。当前没有核验 Qv2ray 的维护状态和兼容性，不预先指定最终工具。

## 现有上下文与关键缺口

已知：朋友有一套稳定的方案，包含工具和服务器；用户希望先调研整条链路，再逐步购买和搭建。

尚缺：朋友方案的可访问资料、客户端设备与系统、预算、服务商/地区限制、具体的可用性验收标准。不能把“朋友有方案”视为“AI 已拥有完整上下文”。

优先讨论三项：

1. 朋友方案目前是什么形式，哪些脱敏资料可以提供或引用？
2. 首先在哪台设备与哪个系统跑通，使用什么应用或页面验证？
3. 服务器月预算大致多少，是否有地区或服务商限制？

建议验收（待确认）：G1 在目标设备上完成连接、预期出口检查、目标访问和断线重连；G2 用户能解释从应用到目标站点的链路、区分组件职责，并演示一次基本排错。具体入口、步骤和预期值在 T03 固定。

## 任务草案

以下是可调整的路线，不是已确认执行计划。当前全部为 draft；T01 等资料和调研范围明确后最先启动。暂按串行安排，先验证流程是否适合新手。

| ID | 类型 | 目标 | 依赖 | 状态 | 任务与结果 |
|---|---|---|---|---|---|
| T01 | research | G1/G2 | 无 | draft | 调研朋友方案，识别客户端、核心、服务端和连接链路，输出事实、来源与缺口。 |
| T02 | design | G1 | T01 | draft | 结合设备和预算形成最小方案及服务器候选，说明选择理由和费用，供用户决定。 |
| T03 | validation | G1/G2 | T02 | draft | 部署前确定逐项验收步骤、环境入口、所需权限和预期结果。 |
| T04 | implementation | G1 | T03 | draft | 指导用户购买已选服务器，核对实例信息与登录能力，记录费用及续费方式。 |
| T05 | implementation | G1/G2 | T04 | draft | 完成服务器必要初始化，验证管理入口与安全配置可用。 |
| T06 | poc | G1 | T05 | draft | 按已选方案搭建最小服务端，在单台目标设备上验证完整连接。 |
| T07 | validation | G1 | T06 | draft | 执行 T03 的功能验收，记录通过与失败证据，形成修复或换方案建议。 |
| T08 | implementation | G1/G2 | T07 | draft | 在最小链路通过后补齐重启恢复、维护和故障定位步骤并验证。 |
| T09 | learning | G2 | T08 | draft | 用户讲解核心链路并完成基础排错；依据实际卡点补充新手指南。 |
| T10 | validation | G1/G2 | T09 | draft | 对照两项目标完成最终复盘，修订 SOP 为正式版并准备后续 Obsidian 迁移。 |

## 独立 Agent 的任务 Prompt

Prompt 统一存放在 `prompts/`，命名为 `xxx.prompt.md`。让独立 Agent 先打开本仓库，再复制对应文件中的代码块；Prompt 中路径均以仓库根目录为基准。只在任务启动时生成结果文件，任务状态仍以本页任务表为唯一来源。

- [T01 · 调研](prompts/t01.prompt.md)
- [T02 · 方案与服务器选型](prompts/t02.prompt.md)
- [T03 · 先定义验证](prompts/t03.prompt.md)
- [T04 · 购买并连接服务器](prompts/t04.prompt.md)
- [T05 · 初始化](prompts/t05.prompt.md)
- [T06 · 最小 POC](prompts/t06.prompt.md)
- [T07 · 功能验证](prompts/t07.prompt.md)
- [T08 · 可持续使用](prompts/t08.prompt.md)
- [T09 · 学习验收与指南](prompts/t09.prompt.md)
- [T10 · 复盘与正式版](prompts/t10.prompt.md)

## 状态事件与决策记录

- 2026-10-11：根据用户描述建立 v0.1 草案；G1/G2 来源为用户原始需求，验收细则待确认。T01–T10 初始状态均为 draft，无任务已经执行。朋友资料未导入，无服务器购买或部署。

后续每次执行在此追加状态变化、反馈及理由，并更新任务表。若出现新路线，创建新 ID，保留旧方案和失败证据。
