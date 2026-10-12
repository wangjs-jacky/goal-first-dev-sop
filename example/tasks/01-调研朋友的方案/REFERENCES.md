# 调研资料 · 2026-10-12

- 新增链路来源：[Cloudflare IP API](https://api.cloudflare.com/client/v4/ips)、[公开 trace 端点](https://www.cloudflare.com/cdn-cgi/trace)；2026-10-12 经现有本机代理读取，见 [入口/出口证据](evidence/20261012-proxy-path.md)。用途为网段归属与本次请求出口核验，不是完整配置审计。

- 新增本机来源：[Mac mini 只读检查](evidence/20261012-mac-mini-readonly.md)。依据系统代理、运行进程、应用版本和生成配置白名单摘要；未进行主动连通测试。

公开 GitHub 资料通过 gh CLI 读取；部署通过面板 API 核对。以下区分项目文档、上游机制与实际证据。

| 来源 | 用途与核验范围 |
|---|---|
| [x-ui-yg](https://github.com/yonggekkk/x-ui-yg/tree/de071b407f26e822c7e826b6a8d6c0fa1b01823d) | README、install.sh 相关部分、配置模板；确认二进制未开源声明及安装管理方式。未执行脚本，未做完整安全审计。 |
| [Qv2ray README](https://github.com/Qv2ray/Qv2ray/blob/d5c5aeb366e2fbe9c9243648af36b0d11da14920/README.md) / [v2.7.0](https://github.com/Qv2ray/Qv2ray/releases/tag/v2.7.0) | 官方停更声明；稳定版日期 2021-08-17，macOS x64 资产。仓库未归档或有新 push 不等于恢复维护。 |
| [Xray VLESS](https://github.com/XTLS/Xray-docs-next/blob/f179efd35d1fda797a853ed8fa98c98235e69fb2/docs/config/inbounds/vless.md) | 读取协议说明与字段；学习职责，配置仍需匹配实际核心版本。 |
| [Xray WebSocket](https://github.com/XTLS/Xray-docs-next/blob/f179efd35d1fda797a853ed8fa98c98235e69fb2/docs/config/transports/websocket.md) | 阅读传输、路径/Host 与当前文档建议；不据此认定实际使用 CDN。 |
| [Xray TLS](https://github.com/XTLS/Xray-docs-next/blob/f179efd35d1fda797a853ed8fa98c98235e69fb2/docs/config/transports/tls.md) | TLS 与服务器名称、证书匹配机制；未进行真实握手。 |
| [v2rayN](https://github.com/2dust/v2rayN/tree/1883178b5f1e222b6c6db2782e7a3d989b7cc18f) / [7.25.4](https://github.com/2dust/v2rayN/releases/tag/7.25.4) | README 平台支持和 release 资产；macOS arm64 候选，未安装测试。 |
| [上游 x-ui controller](https://github.com/vaxilu/x-ui/tree/main/web/controller) / [xray service](https://github.com/vaxilu/x-ui/blob/main/web/service/xray.go) | inbound.go、server.go、setting.go 的读取路由与核心配置生成机制；不是 x-ui-yg 二进制的等价源代码，链接随 main 变化。 |
| [面板检查摘要](evidence/20261012-panel-readonly.md) | 本次实际入站、面板报告状态、设置模板的脱敏证据。 |
| [原始需求](../../problem.md) | 用户提供的目标、部署入口及截图；与实际核验分开。 |

版本注意：x-ui-yg 的 version 文件为 v26.6.18，发布资产沿用 xui_yg 标签且有更新；这些都不能直接作为实际服务器面板的准确版本。实际面板报告的 Xray 版本另为 26.2.6。
