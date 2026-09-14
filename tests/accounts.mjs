import assert from 'node:assert/strict';
import {clean,merge,totals,fromGame,toGame} from '../accounts/model.js';
const full={l1:Array.from({length:50},(_,i)=>i+1),l2:Array.from({length:32},(_,i)=>i),l3:Array.from({length:24},(_,i)=>i),assisted:[1,2],lessons:['lcm'],visited:['l2-square']};
assert.equal(totals(full).completed,106);assert.equal(totals(full).gems,1060);
assert.deepEqual(clean({l1:[0,1,1,51,'2'],l2:[-1,0,32],l3:[24,23],assisted:[1,2]}),{l1:[1],l2:[0],l3:[23],assisted:[1],lessons:[],visited:[]});
assert.deepEqual(merge({l1:[1],l2:[3]},{l1:[2],l3:[0]}).l1,[1,2]);
assert.deepEqual(fromGame(toGame(full)),{...clean(full),visited:[]});
assert.deepEqual(merge(full,full),clean(full));
console.log('Account model: all 106 missions, deduplication, sanitisation and round-trip isolation passed.');
