// Serve one production dist identically at / and /Dear-Mayor/ for acceptance tests.
import {createServer} from 'node:http';
import {readFileSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.env.DIST_DIR || 'dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.svg':'image/svg+xml','.txt':'text/plain'};
createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}
 catch{res.writeHead(400).end();return;}
 const file=resolve(root,'.'+pathname.replace(/^\/Dear-Mayor(?=\/)/,'').replace(/\/$/,'/index.html'));
 if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{
  if(!statSync(file).isFile())throw Error('not a file');
  const data=readFileSync(file);
  res.writeHead(200,{'Content-Type':types[extname(file)]??'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-cache'}).end(data);
 }catch{res.writeHead(404).end();}
}).listen(Number(process.env.PORT || 53531),'127.0.0.1',511,()=>console.log(`Production dist: ${root}`));
