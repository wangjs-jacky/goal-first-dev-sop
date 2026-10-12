// Task04: isolated HTTP-level use/recovery checks, not browser/video acceptance.
import {execFileSync,spawn} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,unlinkSync,rmdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import net from 'node:net';
import {resolve4} from 'node:dns/promises';
const profile=JSON.parse(readFileSync(new URL('../../03-购买服务器并搭建/notes/client-profile.json',import.meta.url),'utf8'));
const entry=process.env.NODE_ENTRY_IPV4 || profile.address;
if(entry!==profile.address && entry!=='node.paws.rodeo' && (net.isIP(entry)!==4 || !(await resolve4('node.paws.rodeo')).includes(entry)))throw Error('Entry must be the verified profile entry or a current node.paws.rodeo A record');
const sshArgs=['-i','/Users/jacky/.ssh/racknerd-node-paws','-o','IdentitiesOnly=yes','-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=8','root@192.255.142.217'];
const ssh=cmd=>execFileSync('ssh',[...sshArgs,cmd],{encoding:'utf8',timeout:25000});
const hash=()=>createHash('sha256').update(readFileSync('/Users/jacky/Library/Preferences/qv2ray/generated/config.gen.json')).digest('hex');
const baseline={configHash:hash(),systemProxy:execFileSync('/usr/sbin/scutil',['--proxy'],{encoding:'utf8'})};
const inbound=JSON.parse(ssh('cat /etc/xray-node/config.json')).inbounds[0];
const dir=mkdtempSync(join(tmpdir(),'node-paws-task04-'));
const cfg=join(dir,'config.json');
const log=x=>console.log(JSON.stringify({at:new Date().toISOString(),...x}));
log({label:'entry',address:entry,tlsServerName:'node.paws.rodeo'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let child;
const results=[];
async function start(){
 child=spawn('/usr/local/opt/v2ray/bin/v2ray',['-config',cfg],{stdio:'ignore'});
 for(let i=0;i<50;i++){
  if(child.exitCode!==null)throw Error('test client exited');
  if(await new Promise(r=>{const s=net.connect(10988,'127.0.0.1');s.on('connect',()=>{s.destroy();r(true)});s.on('error',()=>{s.destroy();r(false)})}))return;
  await delay(100);
 }
 throw Error('test client timeout');
}
async function stop(){if(child&&child.exitCode===null){const exited=new Promise(r=>child.once('exit',r));child.kill('SIGTERM');await exited;}}
async function request(label,url,{body=false,proxy='socks5h://127.0.0.1:10988',limit=30}={}){
 const args=['--noproxy','','--proxy',proxy,'--connect-timeout','10','--max-time',String(limit),'-sS','-L',url,'-w','\nTASK04_META=%{json}'];
 return await new Promise(resolve=>{
  const p=spawn('curl',args);let out='',err='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);
  p.on('close',code=>{const pos=out.lastIndexOf('\nTASK04_META=');const content=out.slice(0,pos);let m={};try{m=JSON.parse(out.slice(pos+13))}catch{}
   const row={label,url,exitCode:code,http:m.http_code,tlsVerify:m.ssl_verify_result,seconds:m.time_total,bytes:m.size_download};
   if(body)row.body=content.trim();else row.html=/<html[\s>]/i.test(content);
   if(err)row.error=err.slice(0,250);
   results.push(row);log(row);resolve(row);
  });
 });
}
try{
 await new Promise((resolve,reject)=>{const s=net.createServer();s.once('error',reject);s.listen(10988,'127.0.0.1',()=>s.close(resolve));});
 writeFileSync(cfg,JSON.stringify({log:{loglevel:'warning'},inbounds:[{listen:'127.0.0.1',port:10988,protocol:'socks',settings:{auth:'noauth',udp:false}}],outbounds:[{protocol:'vless',settings:{vnext:[{address:entry,port:443,users:[{id:inbound.settings.clients[0].id,encryption:'none'}]}]},streamSettings:{network:'ws',security:'tls',tlsSettings:{serverName:'node.paws.rodeo',allowInsecure:false,alpn:['http/1.1']},wsSettings:{path:inbound.streamSettings.wsSettings.path,headers:{Host:'node.paws.rodeo'}}}}]}),{mode:0o600});
 await start();
 await request('baseline-exit','https://api.ipify.org',{body:true});
 for(const [label,url] of [['google-page','https://www.google.com/'],['github-page','https://github.com/'],['youtube-page','https://www.youtube.com/']])await request(label,url);
 await stop();
 await request('client-stopped-negative','https://api.ipify.org',{body:true,limit:5});
 await start();
 await request('client-reconnected','https://api.ipify.org',{body:true});
 const before=ssh('systemctl show xray-node -p MainPID --value').trim();
 // Authorized Task04 scope: new test service only; never restart SSH or the VPS.
 const restartAt=Date.now();
 const after=ssh('systemctl restart xray-node && systemctl is-active xray-node && systemctl show xray-node -p MainPID --value').trim();
 log({label:'server-service-restart',beforePID:before,after,controlSeconds:(Date.now()-restartAt)/1000});
 await request('same-client-after-server-restart','https://api.ipify.org',{body:true});
 await request('google-after-server-restart','https://www.google.com/generate_204');
 for(let i=1;i<=10;i++){
  await request('short-repeat-'+i,'https://www.cloudflare.com/cdn-cgi/trace',{body:true});
  if(i<10)await delay(5000);
 }
 log({label:'final-server',result:ssh('systemctl is-active xray-node node-guard ssh; systemctl is-enabled xray-node node-guard; systemctl show xray-node -p NRestarts -p MainPID')});
 await request('old-proxy-preserved','https://api.ipify.org',{body:true,proxy:'http://127.0.0.1:10802'});
 const failures=results.filter(r=>{
  if(r.label==='client-stopped-negative')return r.exitCode!==7;
  if(r.exitCode!==0 || r.tlsVerify!==0 || ![200,204].includes(r.http))return true;
  if(r.label==='old-proxy-preserved')return r.body!=='104.244.92.199';
  if(r.body!==undefined)return !r.body.includes('192.255.142.217');
  if(r.label.endsWith('-page'))return !r.html;
  return r.http!==204;
 });
 log({label:'assertions',cases:results.length,failed:failures.map(r=>r.label),passed:failures.length===0});
 if(failures.length)process.exitCode=1;
}finally{
 await stop();
 try{unlinkSync(cfg)}catch{}
 rmdirSync(dir);
 log({label:'cleanup-and-preservation',configUnchanged:hash()===baseline.configHash,systemProxyUnchanged:execFileSync('/usr/sbin/scutil',['--proxy'],{encoding:'utf8'})===baseline.systemProxy,testClientStopped:true});
}
