# Mac mini 现有代理 · 2026-10-12

用户确认当前设备为运行 AI 的 Mac mini。本记录仅保存只读检查的安全摘要，不保存完整配置、UUID、域名或 WS 路径。

## 已核对

- 运行进程：`/Applications/qv2ray.app/Contents/MacOS/qv2ray`、`/usr/local/opt/v2ray/bin/v2ray`。
- Qv2ray 应用 Info.plist：版本 2.7.0。
- V2Ray `-version`：4.45.2 Custom，go1.18.3 darwin/arm64。此为磁盘上所引用可执行文件报告的版本，未独立核对运行中二进制是否与磁盘完全一致。
- `scutil --proxy`：HTTP / HTTPS 代理启用，127.0.0.1:10802；SOCKS 代理启用，127.0.0.1:10888；PAC 与自动发现未启用。
- V2Ray 进程监听 10802、10888、15490，均为本机回环地址。配置中的 15490 入站协议为 dokodemo-door。
- 运行进程参数引用 `Library/Preferences/qv2ray/generated/config.gen.json`。读取此文件后只输出白名单摘要：出站协议 vless，network=ws，security=tls，端口 8443；SNI 与 WS 路径已设置；出站服务器为 IP，**不等于用户此前提供的朋友服务器 IP**。
- 配置还包含 freedom、blackhole 出站，显式 DNS 配置与 4 条路由规则。未展开研究其匹配语义。
- 检查时未观察到该进程对外的 ESTABLISHED TCP 连接，不代表此前未连接或服务不可用。

## 边界与操作记录

没有修改配置、安装、重启或切换节点，没有主动代理访问测试。系统代理配置不保证所有应用遵循，也不能证明本次 AI 请求经过该代理。读取磁盘生成配置不等于独立验证所有字段已加载。

首次版本查询使用 `version` 参数不适用于该旧版，短暂新进程因缺少配置退出；改用 `-version` 成功。原运行核心未停止或重启。

下一步先确认节点关系：本机是否使用朋友的另一个节点，或存在中转。不能仅凭端口和协议相同就认定连向同一服务器。
