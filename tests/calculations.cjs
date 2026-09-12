const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let fields={},output={innerHTML:'',insertAdjacentHTML(_,s){this.innerHTML+=s}};
const main={addEventListener(){}};
const context=vm.createContext({console,window:{},document:{querySelector:s=>s==='#main'?main:{},querySelectorAll:()=>Object.values(fields).filter(f=>f.type!=='select'),getElementById:id=>id==='lab-result'?output:fields[id]}});
vm.runInContext(fs.readFileSync('data.js','utf8'),context);
vm.runInContext(fs.readFileSync('app.js','utf8').split("document.getElementById('parent').onclick")[0],context);
vm.runInContext(fs.readFileSync('stories.js','utf8').replace(/route\(\);\s*$/,''),context);
function run(topic,values,step=0){fields={};output.innerHTML='';for(const [id,v] of Object.entries(values)){let spec=Array.isArray(v)?v:[v,0,10000,1];fields[id]={value:String(spec[0]),min:String(spec[1]),max:String(spec[2]),step:String(spec[3]),type:id==='mode'||id==='slices'?'select':'number',parentElement:{firstChild:{textContent:id}},setAttribute(){}}}vm.runInContext(`current=${JSON.stringify(topic)};storyStep=${step};refreshLab()`,context);assert(!output.innerHTML.includes('NaN'));return output.innerHTML}
assert.match(run('lcm',{a:7,b:6}),/LCM\(7, 6\) = 42/);
assert.match(run('lcm',{a:11,b:12},132),/11:12/);
assert.match(run('lcm',{a:4,b:6},12),/Both here/);
for(let a=1;a<=12;a++)for(let b=1;b<=12;b++){let expected=a;while(expected%b)expected+=a;assert.match(run('lcm',{a,b}),new RegExp(`LCM\\(${a}, ${b}\\) = ${expected}\\.`))}
for(let a=1;a<=24;a++)for(let b=1;b<=24;b++)for(let p=1;p<=12;p++){const html=run('hcf',{a,b,packs:p},24);assert(html.includes(`Still on the table: ${a%p} strawberry + ${b%p} caramel`));assert(html.includes(`${Math.floor(a/p)} strawberry · ${Math.floor(b/p)} caramel`))}
assert.match(run('fractions',{slices:4},3),/Sharing 3\/4/);
assert.match(run('fractions',{mode:'add',a:1,b:2,c:1,d:4}),/3\/4/);
assert.match(run('fractions',{mode:'subtract',a:1,b:4,c:1,d:2}),/−.*-1\/4/);
assert.match(run('fractions',{mode:'compare',a:3,b:4,c:2,d:3}),/&gt;/);
assert.match(run('mixed',{whole:2,a:3,b:4}),/2 3\/4 = 11\/4/);
assert.match(run('mixed',{whole:2,a:4,b:4}),/Extra slices must be fewer/);
for(let h=0;h<=100;h++)assert(run('decimals',{hundred:h}).includes(`₹${(h/100).toFixed(2)}`));
assert.match(run('discounts',{principal:200,rate:25}),/Sale price: ₹150.00/);
assert.match(run('discounts',{principal:[199.99,0,10000,.01],rate:[12.5,0,100,.01]}),/Sale price: ₹174.99/);
for(const p of [0,200,1000])for(const rate of [0,5,10,50])for(let years=0;years<=5;years++)for(const type of ['simple','compound']){let balance=p;for(let i=0;i<years;i++)balance+=(type==='simple'?p:balance)*rate/100;const expected='₹'+balance.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});assert(run(type,{principal:p,rate},years).includes(`<strong>${expected}</strong>`))}
for(const value of ['',0,13,2.5]){assert.match(run('lcm',{a:[value,1,12,1],b:6}),/Enter a whole number/);assert.equal(fields.a.value,String(value))}
// Independent arithmetic answer key, in worksheet order.
const expected=[12,15,8,18,10,12,24,6,4,5,6,8,1,'2/3','3/4','2/4','5/7','3/4','1/2','3/4','1/2',15,'1/4','11/12','29 1/5','23/3','4 1/4',9,'6 1/3','11/2',.25,.5,3.75,7.67,'3/4',1.25,20,50,150,255,81,100,1300,80,50,1100,110,1210,66.20,10];
const qs=vm.runInContext('questions',context);assert.equal(qs.length,50);qs.forEach((q,i)=>{const normalized=q.answer.replace(/₹|,/g,'').replace(/ (minutes|packs|baskets|apples|cup)$/,'');if(typeof expected[i]==='number')assert.equal(Number(normalized),expected[i],`Quest ${i+1}`);else assert.equal(normalized,expected[i],`Quest ${i+1}`);assert.equal(new Set(q.options).size,4);assert(q.options.includes(q.answer))});
console.log('PASS: 144 LCM pairs; 6,912 packing cases; fractions; mixed numbers; 101 decimal values; discounts; 144 savings cases; input validation; all 50 worksheet answers.');
