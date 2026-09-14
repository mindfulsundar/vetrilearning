const {readFileSync}=require('node:fs');
const {getGlobalDefaultAccount,getAccessToken}=require('firebase-tools/lib/auth');
(async()=>{
 const a=getGlobalDefaultAccount();if(!a)throw Error('Run firebase login first');
 const t=await getAccessToken(a.tokens.refresh_token,['https://www.googleapis.com/auth/cloud-platform','https://www.googleapis.com/auth/firebase','openid','email']);
 const api=async(path,method='GET',body)=>{const r=await fetch('https://firebaserules.googleapis.com/v1/'+path,{method,headers:{Authorization:'Bearer '+t.access_token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();if(!r.ok){const e=Error(r.status+' '+(data.error?.message||'Request failed'));e.status=r.status;throw e;}return data;};
 const project='projects/vetri-6cdab',name=project+'/releases/cloud.firestore';
 if(process.argv[2]==='verify'){const release=await api(name);const rules=await api(release.rulesetName);if(rules.source.files[0].content!==readFileSync('firestore.rules','utf8'))throw Error('Deployed rules differ from the tested file');console.log('Live rules exactly match the tested rules.');return;}
 let exists=true;try{await api(name);}catch(e){if(e.status!==404)throw e;exists=false;}
 const rules=await api(project+'/rulesets','POST',{source:{files:[{name:'firestore.rules',content:readFileSync('firestore.rules','utf8')}]}});
 const release={name,rulesetName:rules.name};
 if(exists)await api(name,'PATCH',{release,updateMask:'rulesetName'});else await api(project+'/releases','POST',release);
 console.log('Learner isolation and verified-owner admin rules deployed.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
