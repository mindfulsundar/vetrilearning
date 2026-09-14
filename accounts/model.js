export const OWNER_EMAIL = 'csunpandian@gmail.com';
export const AVATARS = ['🌱','🦊','🐼','🚀','🦉','🐢'];
export const TOPICS = ['lcm','hcf','fractions','mixed','decimals','discounts','simple','compound'];
export const CHAPTERS = [...TOPICS, ...['zero','linear','square','cube','angles','draw','missing','quads'].map(x=>'l2-'+x), ...['rational','linear','quads','roots','cuberoots','compare'].map(x=>'l3-'+x)];
const ids = (xs, min, max) => [...new Set(Array.isArray(xs) ? xs.filter(x=>Number.isInteger(x)&&x>=min&&x<=max):[])].sort((a,b)=>a-b);
export function clean(value={}) {
  const l1=ids(value.l1,1,50);
  return {l1,l2:ids(value.l2,0,31),l3:ids(value.l3,0,23),assisted:ids(value.assisted,1,50).filter(x=>l1.includes(x)),lessons:[...new Set((Array.isArray(value.lessons)?value.lessons:[]).filter(x=>TOPICS.includes(x)))],visited:[...new Set((Array.isArray(value.visited)?value.visited:[]).filter(x=>CHAPTERS.includes(x)))]};
}
export function merge(a={},b={}) {const x=clean(a),y=clean(b);return clean(Object.fromEntries(Object.keys(x).map(k=>[k,[...x[k],...y[k]]])));}
export function totals(p) {const c=clean(p),completed=c.l1.length+c.l2.length+c.l3.length;return {completed,gems:completed*10,levels:[c.l1.length,c.l2.length,c.l3.length]};}
export function fromGame(game) {return clean({l1:Object.keys(game.l1.solved).map(Number),assisted:Object.entries(game.l1.solved).filter(([,v])=>v.assisted).map(([k])=>Number(k)),lessons:Object.keys(game.l1.lessons).filter(k=>game.l1.lessons[k]),l2:Object.keys(game.l2).filter(k=>game.l2[k]===true).map(Number),l3:Object.keys(game.l3).filter(k=>game.l3[k]===true).map(Number)});}
export function toGame(value) {const c=clean(value);return {l1:{solved:Object.fromEntries(c.l1.map(k=>[k,{assisted:c.assisted.includes(k)}])),lessons:Object.fromEntries(c.lessons.map(k=>[k,true])),last:0},l2:Object.fromEntries(c.l2.map(k=>[k,true])),l3:Object.fromEntries(c.l3.map(k=>[k,true]))};}
