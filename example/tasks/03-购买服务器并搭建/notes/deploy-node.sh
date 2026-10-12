#!/bin/bash
# Only run on the authorized fresh RackNerd VPS; no client/system proxy changes.
set -euo pipefail
test "$(hostname)" = racknerd-2cc9df0
test -s /etc/xray-node/tls/origin.pem
test ! -e /etc/xray-node/config.json
version=26.3.27
work=$(mktemp -d /root/xray-install.XXXXXX)
curl -fL --connect-timeout 15 --max-time 180 "https://github.com/XTLS/Xray-core/releases/download/v${version}/Xray-linux-64.zip" -o "$work/xray.zip"
echo "23cd9af937744d97776ee35ecad4972cf4b2109d1e0fe6be9930467608f7c8ae  $work/xray.zip" | sha256sum -c -
python3 - "$work" <<'PY'
import sys,zipfile
with zipfile.ZipFile(sys.argv[1]+'/xray.zip') as z:
    z.extract('xray', sys.argv[1])
PY
install -m 755 "$work/xray" /usr/local/bin/xray-node
id xray-node >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin xray-node
python3 - <<'PY'
import json,uuid,secrets,os
config={
 'log':{'loglevel':'warning'},
 'inbounds':[{'tag':'node-wss','listen':'0.0.0.0','port':443,'protocol':'vless',
   'settings':{'clients':[{'id':str(uuid.uuid4())}],'decryption':'none'},
   'streamSettings':{'network':'ws','security':'tls',
     'tlsSettings':{'minVersion':'1.2','alpn':['http/1.1'],'certificates':[{'certificateFile':'/etc/xray-node/tls/origin.pem','keyFile':'/etc/xray-node/tls/origin.key'}]},
     'wsSettings':{'path':'/'+secrets.token_hex(16)}}}],
 'outbounds':[{'tag':'direct','protocol':'freedom'},{'tag':'block','protocol':'blackhole'}],
 'routing':{'domainStrategy':'IPIfNonMatch','rules':[{'type':'field','ip':['0.0.0.0/8','10.0.0.0/8','100.64.0.0/10','127.0.0.0/8','169.254.0.0/16','172.16.0.0/12','192.168.0.0/16','224.0.0.0/4','240.0.0.0/4','::/128','::1/128','fc00::/7','fe80::/10','ff00::/8'],'outboundTag':'block'}]}}
with open('/etc/xray-node/config.json','x') as f: json.dump(config,f,indent=2)
os.chmod('/etc/xray-node/config.json',0o640)
PY
chown -R root:xray-node /etc/xray-node
chmod 750 /etc/xray-node /etc/xray-node/tls
chmod 640 /etc/xray-node/tls/origin.key /etc/xray-node/tls/origin.pem
cat > /etc/systemd/system/xray-node.service <<'UNIT'
[Unit]
Description=Dedicated node.paws.rodeo Xray
After=network-online.target
Wants=network-online.target

[Service]
User=xray-node
Group=xray-node
ExecStart=/usr/local/bin/xray-node run -config /etc/xray-node/config.json
Restart=on-failure
RestartSec=5
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
UMask=0077
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
UNIT
runuser -u xray-node -- /usr/local/bin/xray-node run -test -config /etc/xray-node/config.json
systemctl daemon-reload
systemctl enable --now xray-node
systemctl is-active xray-node
/usr/local/bin/xray-node version
ss -lnt
