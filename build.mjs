import {build} from 'esbuild';
import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist/accounts',{recursive:true});
for(const f of ['index.html','app.js','data.js','style.css','stories.js','level2-data.js','level2-math.js','level2.js','level2.css','kid-tutor.js','level3-data.js','level3.js','accounts.css']) await copyFile(f,'dist/'+f);
for(const f of ['store.js','bridge.js'])await copyFile('accounts/'+f,'dist/accounts/'+f);
await cp('assets','dist/assets',{recursive:true});
await build({entryPoints:['accounts/main.js'],bundle:true,format:'esm',target:'es2022',minify:true,outfile:'dist/accounts.bundle.js'});
await copyFile('dist/accounts.bundle.js','accounts.bundle.js');
