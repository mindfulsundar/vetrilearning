window.MCBridge={
 export(){return JSON.parse(JSON.stringify({l1:progress,l2:L2.exportProgress(),l3:L3.exportProgress()}));},
 load(game,reset=true){progress=game.l1;if(reset){quizIndex=0;resetQuestion();}L2.loadProgress(game.l2,reset);L3.loadProgress(game.l3,reset);},
 catalog(){return [
  ...topics.map(t=>({title:t[1],level:1,key:'l1',ids:questions.filter(q=>q.topic===t[0]).map(q=>q.id)})),
  ...L2_DATA.chapters.map(c=>({title:c.title,level:2,key:'l2',ids:L2_DATA.questions.flatMap((q,i)=>q.topic===c.id?[i]:[])})),
  ...L3_DATA.chapters.map(c=>({title:c.title,level:3,key:'l3',ids:L3_DATA.questions.flatMap((q,i)=>q.topic===c.id?[i]:[])}))
 ];}
};
