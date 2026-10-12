#!/bin/bash
set -euo pipefail
test "$(hostname)" = racknerd-2cc9df0
test -z "$(nft list ruleset)" # Fresh server only; never replace existing rules.
curl -fsS --max-time 30 https://www.cloudflare.com/ips-v4 -o /etc/xray-node/cloudflare-v4.txt
curl -fsS --max-time 30 https://www.cloudflare.com/ips-v6 -o /etc/xray-node/cloudflare-v6.txt
python3 - <<'PY'
import ipaddress
lists=[]
for ver in (4,6):
    nets=open('/etc/xray-node/cloudflare-v%d.txt'%ver).read().split()
    assert len(nets)>=5
    assert all(ipaddress.ip_network(n).version==ver for n in nets)
    lists.append(', '.join(nets))
rules='''table inet node_guard {
 set cf4 { type ipv4_addr; flags interval; elements = { %s } }
 set cf6 { type ipv6_addr; flags interval; elements = { %s } }
 chain input {
  type filter hook input priority 0; policy drop;
  iifname "lo" accept
  ct state established,related accept
  ct state invalid drop
  meta l4proto { icmp, ipv6-icmp } accept
  tcp dport 22 accept
  ip saddr @cf4 tcp dport 443 accept
  ip6 saddr @cf6 tcp dport 443 accept
 }
}
'''%tuple(lists)
with open('/etc/xray-node/node-guard.nft','x') as f:f.write(rules)
PY
nft -c -f /etc/xray-node/node-guard.nft
cat > /etc/systemd/system/node-guard.service <<'UNIT'
[Unit]
Description=Scoped firewall for node.paws.rodeo
Before=xray-node.service
After=network-pre.target
[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/sbin/nft -f /etc/xray-node/node-guard.nft
ExecStop=/usr/sbin/nft delete table inet node_guard
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
# Automatic recovery if the independent SSH check cannot reconnect.
systemd-run --unit=node-guard-rollback --on-active=120 /usr/bin/systemctl stop node-guard.service
systemctl start node-guard.service
echo 'Guard applied; verify a NEW SSH connection before enabling/cancelling rollback.'
