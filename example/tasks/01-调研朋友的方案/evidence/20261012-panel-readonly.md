# 面板只读核对 · 2026-10-12

这是实际请求结果的脱敏白名单摘要，不是完整原始响应。凭据、Cookie、UUID、证书内容、WS 路径和完整配置均不落盘。

## 操作与结果

- SSH 到用户提供的服务器：到达认证，返回 `Permission denied (publickey,gssapi-keyex,gssapi-with-mic,password)`。未运行主机命令。
- 面板根路径 GET：HTTP 200。GET login 路径返回 404；改用正确的 POST login 后 HTTP 200、success=true。登录创建会话，但未更改业务配置。
- 登录后读取以下三个接口，均为 HTTP 200、success=true。虽使用 POST，其上游实现对应读取；未调用更新、安装、重启、增删接口。

| 相对于面板根路径的接口 | 读取范围 |
|---|---|
| xui/inbound/list | 入站配置 |
| server/status | 面板报告的运行状态 |
| xui/setting/all | 面板设置及 Xray 模板 |

## 安全摘要

| 字段 | 入站 1 | 入站 2 |
|---|---|---|
| enable | true | true |
| protocol | vless | vless |
| port | 8443 | 2096 |
| network | ws | ws |
| security | tls | tls |
| clientsCount | 1 | 1 |
| flow | 空 | 空 |
| decryption | none | none |
| WS 路径 | 已设置（省略值） | 已设置（省略值） |
| certificatesCount | 1 | 1 |
| minVersion | 1.2 | 1.2 |
| alpn | h2、http/1.1 | h2、http/1.1 |
| sniffing | 启用 | 启用 |

- Xray：state=running，version=26.2.6（面板报告）。
- 面板自身 TLS：未配置；用户提供的入口为 HTTP。
- 模板未显式配置 DNS；domainStrategy=AsIs。
- 模板出站协议包含 blackhole、freedom、socks、wireguard；存在 WARP 相关命名的出站。
- 模板包含 UDP 443 阻断规则，最终兜底 TCP/UDP → direct。

## 不能由这些证据推出的结论

没有端到端代理连接、出口地址或测速结果；不能证明 WARP 生效、DNS 无泄漏、证书有效、CDN 已接入或客户端兼容。未读取主机运行时生成文件，模板不完全等同于最终运行配置。上游 x-ui 源码用于解释接口用途，不是闭源 x-ui-yg 二进制的完整审计。
