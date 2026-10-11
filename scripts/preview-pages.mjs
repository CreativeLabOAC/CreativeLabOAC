import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('out');
createServer(async(req,res)=>{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/CreativeLabOAC\/?/,'/');
  const file=resolve(root,'.'+(path.endsWith('/')?path+'index.html':path));
  if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  try {const data=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.svg':'image/svg+xml'})[extname(file)]??'application/octet-stream');res.end(data);}catch{res.writeHead(404).end();}
}).listen(4187,'127.0.0.1',()=>console.log('http://127.0.0.1:4187/CreativeLabOAC/'));
