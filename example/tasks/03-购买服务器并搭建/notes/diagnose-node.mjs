import {execFileSync,spawn} from 'node:child_process';
import {mkdtempSync,writeFileSync,unlinkSync,rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import net from 'node:net';
const mode=process.env.NODE_DIAG_MODE||'origin';
const entry=process.env.NODE_DIAG_ENTRY||'node.paws.rodeo';
const port=Number(process.env.NODE_DIAG_PORT||443);
if(!['origin','cdn'].includes(mode))throw Error('bad mode');
const sshArgs=['-i','/Users/jacky/.ssh/racknerd-node-paws','-o','IdentitiesOnly=yes','-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=8'];
const ssh=cmd=>execFileSync('ssh',[...sshArgs,'root@192.255.142.217',cmd],{encoding:'utf8',timeout:20000});
const inbound=JSON.parse(ssh('cat /etc/xray-node/config.json')).inbounds[0];
const secret=inbound.settings.clients[0].id,ws=inbound.streamSettings.wsSettings.path;
const dir=mkdtempSync(join(tmpdir(),'node-diag-')),cfg=join(dir,'client.json');
const children=[];let logs='';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const log=v=>console.log(JSON.stringify({at:new Date().toISOString(),mode,...v}));
async function free(port){await new Promise((r,j)=>{const s=net.createServer();s.once('error',j);s.listen(port,'127.0.0.1',()=>s.close(r));});}
async function listen(port){for(let i=0;i<100;i++){if(await new Promise(r=>{const s=net.connect(port,'127.0.0.1');s.on('connect',()=>{s.destroy();r(true)});s.on('error',()=>{s.destroy();r(false)})}))return;await sleep(100);}throw Error('listen timeout');}
try{
 await free(10989);
 const tls={serverName:'node.paws.rodeo',allowInsecure:false,alpn:['http/1.1']};
 if(mode==='origin'){
  await free(10943);
  const tunnel=spawn('ssh',[...sshArgs,'-N','-o','ExitOnForwardFailure=yes','-L','127.0.0.1:10943:127.0.0.1:443','root@192.255.142.217'],{stdio:'ignore'});children.push(tunnel);await listen(10943);
  tls.certificates=[{usage:'verify',certificate:ssh('cat /etc/xray-node/tls/cloudflare-origin-ca.pem').trim().split('\n')}];
 }
 log({entry,port});
 const config={log:{loglevel:'info'},inbounds:[{listen:'127.0.0.1',port:10989,protocol:'socks',settings:{auth:'noauth'}}],outbounds:[{protocol:'vless',settings:{vnext:[{address:mode==='origin'?'127.0.0.1':entry,port:mode==='origin'?10943:port,users:[{id:secret,encryption:'none'}]}]},streamSettings:{network:'ws',security:'tls',tlsSettings:tls,wsSettings:{path:ws,headers:{Host:'node.paws.rodeo'}}}}]};
 writeFileSync(cfg,JSON.stringify(config),{mode:0o600});
 const core=spawn('/usr/local/opt/v2ray/bin/v2ray',['-config',cfg],{stdio:['ignore','pipe','pipe']});children.push(core);for(const stream of [core.stdout,core.stderr])stream.on('data',d=>logs=(logs+d).slice(-16000));await listen(10989);
 for(const url of ['https://api.ipify.org','https://www.google.com/','https://www.youtube.com/','https://github.com/','https://www.cloudflare.com/cdn-cgi/trace','https://www.google.com/']){
  logs='';const result=await new Promise(r=>{const p=spawn('curl',['--noproxy','','--proxy','socks5h://127.0.0.1:10989','--connect-timeout','10','--max-time','30','-sS','-L','-o','/dev/null','-w','%{json}',url]);let out='',err='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);p.on('close',code=>{let m={};try{m=JSON.parse(out)}catch{}r({url,code,http:m.http_code,seconds:m.time_total,bytes:m.size_download,tls:m.ssl_verify_result,error:err.trim()});});});log(result);
  if(result.code!==0)log({clientLog:logs.split(secret).join('[UUID]').split(ws).join('[WS_PATH]').slice(-3500)});
 }
}finally{
 for(const p of children.reverse())if(p.exitCode===null){const end=new Promise(r=>p.once('exit',r));p.kill('SIGTERM');await end;}
 try{unlinkSync(cfg)}catch{}rmdirSync(dir);log({cleanup:true});
}
