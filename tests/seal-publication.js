'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),files=[];
function walk(dir=''){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const rel=path.posix.join(dir,e.name);if(['.git','node_modules','audio-cache','models','__pycache__'].includes(e.name))continue;if(e.isDirectory())walk(rel);else if(!['SHA256SUMS.txt'].includes(rel)&&!rel.endsWith('.zip')&&!rel.endsWith('.pyc')&&e.name!=='.DS_Store')files.push(rel);}}
walk();files.sort();fs.writeFileSync(path.join(root,'SHA256SUMS.txt'),files.map(file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')+'  '+file).join('\n')+'\n');console.log('SHA-256: '+files.length+' archivos.');
