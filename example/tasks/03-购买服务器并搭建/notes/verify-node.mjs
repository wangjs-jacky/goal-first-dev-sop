// Isolated runtime test. Credentials remain in memory and a mode-0600 temporary
// file; existing Qv2ray config, system proxy and running process are untouched.
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import net from 'node:net';

const ssh = ['-i','/Users/jacky/.ssh/racknerd-node-paws','-o','IdentitiesOnly=yes','-o','BatchMode=yes','root@192.255.142.217'];
const server = JSON.parse(execFileSync('ssh', [...ssh,'cat /etc/xray-node/config.json'], {encoding:'utf8'}));
const inbound = server.inbounds[0];
const profile = JSON.parse(readFileSync(new URL('./client-profile.json',import.meta.url),'utf8'));
const dir = mkdtempSync(join(tmpdir(),'node-paws-client-'));
const path = join(dir,'config.json');
const config = {
 log:{loglevel:'warning'},
 inbounds:[{listen:'127.0.0.1',port:10988,protocol:'socks',settings:{auth:'noauth',udp:false}}],
 outbounds:[{protocol:'vless',settings:{vnext:[{address:profile.address,port:profile.port,users:[{id:inbound.settings.clients[0].id,encryption:'none'}]}]},
 streamSettings:{network:'ws',security:'tls',tlsSettings:{serverName:'node.paws.rodeo',allowInsecure:false,alpn:['http/1.1']},wsSettings:{path:inbound.streamSettings.wsSettings.path,headers:{Host:'node.paws.rodeo'}}}}]
};
let child;
try {
 await new Promise((resolve,reject)=>{const check=net.createServer();check.once('error',reject);check.listen(10988,'127.0.0.1',()=>check.close(resolve));});
 writeFileSync(path,JSON.stringify(config),{mode:0o600});
 execFileSync('/usr/local/opt/v2ray/bin/v2ray',['-test','-config',path],{stdio:'pipe'});
 child=spawn('/usr/local/opt/v2ray/bin/v2ray',['-config',path],{stdio:'ignore'});
 await new Promise((resolve,reject)=>{
   let tries=0;
   const probe=()=>{const s=net.connect(10988,'127.0.0.1');s.once('connect',()=>{s.destroy();resolve();});s.once('error',()=>{s.destroy();if(++tries>=40)reject(Error('test client did not listen'));else setTimeout(probe,100);});};probe();
 });
 for(const url of ['https://www.cloudflare.com/cdn-cgi/trace','https://api.ipify.org','https://www.google.com/generate_204']){
   const text=execFileSync('curl',['--noproxy','','--proxy','socks5h://127.0.0.1:10988','--connect-timeout','15','--max-time','35','-fsS','-w','\nHTTP=%{http_code} TLS_VERIFY=%{ssl_verify_result}\n',url],{encoding:'utf8'});
   console.log(JSON.stringify({url,result:text}));
   if(url.includes('ipify')&&!text.includes('192.255.142.217'))throw Error('wrong egress');
 }
} finally {
 if(child&&child.exitCode===null){child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}
 try{unlinkSync(path);}catch{}
 rmdirSync(dir);
}
