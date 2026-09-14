import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,getDocs,collection,updateDoc,serverTimestamp,deleteDoc} from 'firebase/firestore';
import {readFile} from 'node:fs/promises';
const env=await initializeTestEnvironment({projectId:'demo-mathcraft',firestore:{rules:await readFile('firestore.rules','utf8')}});
try {
await env.clearFirestore();
const a=env.authenticatedContext('learner-a',{email:'a@example.test',email_verified:true}).firestore();
const b=env.authenticatedContext('learner-b',{email:'b@example.test',email_verified:true}).firestore();
const admin=env.authenticatedContext('owner',{email:'csunpandian@gmail.com',email_verified:true}).firestore();
const unverified=env.authenticatedContext('owner',{email:'csunpandian@gmail.com',email_verified:false}).firestore();
const anon=env.unauthenticatedContext().firestore();
const row={email:'a@example.test',nickname:'Fox',avatar:'🦊',l1:[],l2:[],l3:[],assisted:[],lessons:[],visited:[],sessions:1,createdAt:serverTimestamp(),lastActive:serverTimestamp()};
const ref=doc(a,'learners','learner-a');
await assertSucceeds(setDoc(ref,row));
await assertSucceeds(getDoc(ref));
await assertSucceeds(setDoc(doc(b,'learners','learner-b'),{...row,email:'b@example.test'}));
for(const db of [b,anon,unverified]){await assertFails(getDoc(doc(db,'learners','learner-a')));await assertFails(getDocs(collection(db,'learners')));await assertFails(setDoc(doc(db,'learners','learner-a'),row));}
await assertFails(getDocs(collection(a,'learners')));
await assertSucceeds(getDocs(collection(admin,'learners')));
await assertSucceeds(getDoc(doc(admin,'learners','learner-a')));
await assertFails(updateDoc(doc(admin,'learners','learner-a'),{nickname:'Changed',lastActive:serverTimestamp()}));
await assertFails(updateDoc(ref,{role:'admin',lastActive:serverTimestamp()}));
await assertFails(updateDoc(ref,{email:'csunpandian@gmail.com',lastActive:serverTimestamp()}));
await assertFails(updateDoc(ref,{l1:[51],lastActive:serverTimestamp()}));
await assertFails(updateDoc(ref,{l2:[0,0],lastActive:serverTimestamp()}));
await assertFails(updateDoc(ref,{l3:[24],lastActive:serverTimestamp()}));
await assertFails(updateDoc(ref,{sessions:100,lastActive:serverTimestamp()}));
await assertFails(updateDoc(ref,{visited:['unknown'],lastActive:serverTimestamp()}));
await assertFails(updateDoc(ref,{assisted:[1],lastActive:serverTimestamp()}));
await assertFails(updateDoc(ref,{nickname:'x'.repeat(25),lastActive:serverTimestamp()}));
await assertFails(deleteDoc(ref));
await assertSucceeds(updateDoc(ref,{l1:Array.from({length:50},(_,i)=>i+1),l2:Array.from({length:32},(_,i)=>i),l3:Array.from({length:24},(_,i)=>i),assisted:[1],lessons:['lcm'],visited:['l2-square','l3-cuberoots'],sessions:2,lastActive:serverTimestamp()}));
await assertFails(updateDoc(ref,{l1:[],lastActive:serverTimestamp()}));
await assertSucceeds(updateDoc(ref,{nickname:'Star Explorer',avatar:'🚀',lastActive:serverTimestamp()}));
console.log('Rules passed: two isolated learners, verified owner access, denied privilege escalation, immutable email, bounded activity, all 106 missions and no expression-limit failures.');
} finally {await env.cleanup();}
