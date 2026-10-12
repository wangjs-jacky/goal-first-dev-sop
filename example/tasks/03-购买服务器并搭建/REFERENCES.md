# 资料与核验

## 2026-10-12 实际部署依据

- 后续入口修复的依据不是“优选IP”宣传，而是[同客户端绕过CDN对照](attempts/20261012-1508-绕过CDN对照.md)、默认入口失败日志与[替代公共入口实测](notes/20261012-入口修复.md)。104.26.10.229由部署当天官方Cloudflare地址列表104.24.0.0/14验证归属；不视为永久稳定保证。

- [Xray v26.3.27 官方发布](https://github.com/XTLS/Xray-core/releases/tag/v26.3.27)：通过原生 gh API 获取 linux-64 发布包及 SHA256 digest，服务器下载后匹配校验；固定版本配置检查与首次连接通过。
- [Configuration Rules / SSL](https://developers.cloudflare.com/rules/configuration-rules/settings/#ssl)：官方文档确认 SSL Strict 可按匹配请求设置；登录控制台实际部署精确主机名规则并重新打开核对持久化值。
- [Page Rules settings](https://developers.cloudflare.com/rules/page-rules/reference/settings/)：官方建议按主机设置 SSL 使用 Configuration Rule；本账号 Page Rule 新建界面无 SSL，未建立无效 Page Rule。
- [Cloudflare Origin CA](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/)：核对 CSR/签发/严格模式/到期通知限制，使用服务器生成的 CSR 签发单主机证书。
- [Origin RSA root CA](https://developers.cloudflare.com/ssl/static/origin_ca_rsa_root.pem)：独立验证本次源站证书链与主机名。
- [Cloudflare IPv4](https://www.cloudflare.com/ips-v4) / [IPv6](https://www.cloudflare.com/ips-v6)：部署时实际下载、校验 CIDR 后配置专用防火墙回源白名单。
- 实施脚本、恢复与版本边界见 [部署笔记](notes/20261012-node部署.md)，真实请求结果见 [验收证据](evidence/20261012-node首次连接.md)。

## 此前选型记录

- 2026-10-12 [RackNerd官方促销](https://www.racknerd.com/specials/) 与 [官方条款](https://www.racknerd.com/terms-of-service)：经Ego浏览器实际读取，纠正默认流量，核实同价续费与默认不退款；[核验结果](notes/20261012-RackNerd官方核验.md)。未进入订单确认地区/库存。

- 2026-10-12 最新：[住宅IP价格比较](notes/20261012-住宅IP价格比较.md)，依据5篇网站文章区分双ISP与声称家宽接入产品，保留原币种、优惠矛盾和退款限制；不声称已完成官方结算或IP真实性验证。

- 2026-10-12 新增：[7篇文章、11个具体套餐比较](notes/20261012-代理用途套餐比较.md)。已读正文和表格；区分广告、赠送与价格矛盾，尚未完成供应商结算/库存/用途与网络实测核验。

## 用户提供的公众号 vpsxxs

- 2026-10-12 用户截图显示公众号名称 vpsxxs，描述为分享国内外 VPS/IDC 优惠活动。
- 搜索发现网站 [VPS小学生](https://www.vpsxxs.com/)，已读取首页及下列三个文章页面；Infrawire 页明确写“关注公众号VPSXXS”，支持站点与公众号的关联，尚未获得微信原文链接或全量历史文章。
- [RackNerd 美国 VPS：21.99 美元/年起](https://www.vpsxxs.com/racknerd20260423/)：与截图底部标题对应；这里只记录文章宣传价格，未核验商家当前库存、续费或线路质量。
- [Infrawire 多地区 VPS：4.3 美元/月](https://www.vpsxxs.com/infrawire20261008/)：与截图标题对应，文章含关注公众号标识；价格及不限流量等属于文章宣传，未核验限制条件。
- [六六云美国 ATT 真家宽：200 元/月](https://www.vpsxxs.com/liuliuyun20261011/)：与截图主文章标题对应；不是已选择的购买方案。
- 搜索 `site:mp.weixin.qq.com "vpsxxs"` 未返回有效原文条目；不把网站可访问表述为已读取公众号全部文章。

## DigitalOcean Droplets 定价

- 来源：https://www.digitalocean.com/pricing/droplets
- 读取日期：2026-10-12；通过公开 HTTPS 获取官方页面静态正文，未登录账号。
- Basic Regular 表格：1 GiB / 1 vCPU / 1,000 GiB transfer / 25 GiB SSD / US$0.00893 每小时 / US$6 每月。
- 页面计费说明：2026-01-01 起按秒计费，最低 60 秒或 US$0.01，取较高者。
- 页面 IP 说明：Bundled Plans 的公网 IPv4 无额外费用；不要将这一条泛化到不同 v5 配置。
- 用途：提供实际费用来源，而非凭记忆报价。未核对结算税费、账户资格、地区库存、用途合规或网络质量；未下单。

## 已验证技术路线

- [02 POC 结果](../02-POC验证/result.md)：现有 Mac mini 客户端与朋友服务测试通过，不等于自有新实例已部署。
