# 目标仓库初始提示词

打开本目录作为工作目录，复制下面整段。可在末尾追加“执行 01”或“查看进度”。

```text
请以本文件所在目录为目标仓库根目录，读取这里的 AGENTS.md 和 problem.md，按目标与当前任务状态协作。不需要访问父目录的工程文件，也不要把路径额外加上 example/。

查看进度时，读取各 tasks/编号-具体内容/index.md 的 status 并汇总。执行指定任务时，先读取它的 index.md、PROMPT.md 及必要的前置结果，只推进本次指定的工作。

每个任务的 YAML 只保留 status：pending、running、review、done、blocked。结果及资料保存回所属任务，重要进展写正文。追问回答后更新 FAQ.md，资料记 REFERENCES.md，灵感记 IDEA.md；具体记录方式以本目录 AGENTS.md 为准。

如果我只粘贴了本提示词，先报告当前目标与进度，建议下一步，等待我指定任务，不自动操作服务器或购买服务。
```
