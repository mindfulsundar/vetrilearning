const {getGlobalDefaultAccount,getAccessToken}=require('firebase-tools/lib/auth');
(async()=>{
 const a=getGlobalDefaultAccount();if(!a)throw Error('Run firebase login first');
 const t=await getAccessToken(a.tokens.refresh_token,['https://www.googleapis.com/auth/cloud-platform','https://www.googleapis.com/auth/firebase','openid','email']);
 const request=async(url,method='GET',body)=>{const r=await fetch(url,{method,headers:{Authorization:'Bearer '+t.access_token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();if(!r.ok)throw Error(r.status+' '+(data.error?.message||'Request failed'));return data;};
 if(process.argv[2]==='enable-api'){
  const operation=await request('https://serviceusage.googleapis.com/v1/projects/716430044131/services/firestore.googleapis.com:enable','POST',{});
  console.log(JSON.stringify({operation:operation.name,done:operation.done}));return;
 }
 const base='https://firestore.googleapis.com/v1/projects/vetri-6cdab/databases';
 const list=await request(base);
 if(process.argv[2]==='create'&&!list.databases?.some(d=>d.name.endsWith('/(default)'))){
  const operation=await request(base+'?databaseId=(default)','POST',{locationId:'asia-south1',type:'FIRESTORE_NATIVE',deleteProtectionState:'DELETE_PROTECTION_ENABLED'});
  console.log(JSON.stringify({operation:operation.name,done:operation.done}));
 }else console.log(JSON.stringify(list,null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
