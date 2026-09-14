// Uses the official Firebase CLI login; never prints or writes access tokens.
const {getGlobalDefaultAccount,getAccessToken}=require('firebase-tools/lib/auth');
(async()=>{
 const account=getGlobalDefaultAccount();if(!account)throw Error('Run firebase login first.');
 const token=await getAccessToken(account.tokens.refresh_token,['https://www.googleapis.com/auth/cloud-platform','https://www.googleapis.com/auth/firebase','openid','email']);
 async function api(path,method='GET',body){const res=await fetch('https://identitytoolkit.googleapis.com/'+path,{method,headers:{Authorization:'Bearer '+token.access_token,'Content-Type':'application/json','x-goog-user-project':'vetri-6cdab'},...(body?{body:JSON.stringify(body)}:{})});const data=await res.json();if(!res.ok)throw Error(res.status+' '+(data.error?.message||'Firebase request failed'));return data;}
 const root='admin/v2/projects/vetri-6cdab';
 const config=await api(root+'/config');
 if(process.argv[2]==='enable-email'){
  const domains=[...new Set([...(config.authorizedDomains||[]),'vetri-pi.vercel.app'])];
  await api(root+'/config?updateMask=signIn.email,authorizedDomains','PATCH',{signIn:{email:{enabled:true,passwordRequired:true}},authorizedDomains:domains});
  console.log('Email/password sign-in and vetri-pi.vercel.app domain enabled.');
 }else if(process.argv[2]==='enable-google'){
  const google=await api(root+'/defaultSupportedIdpConfigs/google.com');
  if(!google.clientId||!google.clientSecret)throw Error('Google OAuth client configuration must first be created in Firebase console.');
  await api(root+'/defaultSupportedIdpConfigs/google.com?updateMask=enabled','PATCH',{enabled:true});
  console.log('Google sign-in enabled using the existing OAuth client.');
 }else{
  console.log(JSON.stringify({name:config.name,subtype:config.subtype,email:config.signIn?.email,authorizedDomains:config.authorizedDomains},null,2));
  try{const g=await api(root+'/defaultSupportedIdpConfigs/google.com');console.log(JSON.stringify({googleEnabled:g.enabled,googleClientConfigured:!!g.clientId&&!!g.clientSecret}));}catch(e){console.log('Google provider: '+e.message);}
 }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
