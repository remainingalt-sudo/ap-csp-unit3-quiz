// Buildless static app: validate the complete, directly deployable dist folder.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../dist');
for(const name of ['questions.js','scenarios.js','engine.js','app.js'])new vm.Script(fs.readFileSync(path.join(root,name),'utf8'),{filename:name});
for(const name of ['index.html','styles.css','favicon.svg'])if(!fs.statSync(path.join(root,name)).size)throw Error('Missing asset '+name);
require('../tests/verify.cjs');
console.log('Build verified. Deploy the contents of dist/ to any static host.');
