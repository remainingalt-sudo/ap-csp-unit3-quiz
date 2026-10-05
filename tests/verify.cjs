const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const context=vm.createContext({console});
for(const file of ['questions.js','scenarios.js','engine.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist',file),'utf8'),context);
const {QUESTIONS:bank,TOPICS:topics,QuizEngine:E}=context;
assert.equal(bank.length,112);assert.equal(bank.filter(q=>q.kind==='scenario').length,32);
assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
assert.equal(new Set(bank.map(q=>q.question.toLowerCase().replace(/[^a-z0-9]/g,''))).size,bank.length);
for(const q of bank){assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert(topics.some(t=>t.id===q.topic));assert(['Easy','Medium','Hard'].includes(q.difficulty));assert(Number.isInteger(q.correctAnswer)&&q.correctAnswer>=0&&q.correctAnswer<4);assert(q.explanation.length>20);if(q.code)new vm.Script(q.code,{filename:q.id});}
for(const t of topics){const qs=bank.filter(q=>q.topic===t.id);assert.equal(qs.length,14);assert.equal(qs.filter(q=>q.kind==='scenario').length,4);assert.equal(new Set(qs.filter(q=>q.kind==='scenario').map(q=>q.difficulty)).size,3);}
const signatures=new Set(),orderSignatures=new Set();
for(let n=0;n<200;n++){
 const s=E.create(bank,'quick');assert.equal(s.ids.length,10);assert.equal(new Set(s.ids).size,10);signatures.add(s.ids.join());
 for(let i=0;i<s.ids.length;i++){const q=bank.find(q=>q.id===s.ids[i]);assert.equal(s.orders[i].length,4);assert.equal(new Set(s.orders[i]).size,4);orderSignatures.add(s.orders[i].join());assert.equal(s.orders[i][s.orders[i].indexOf(q.correctAnswer)],q.correctAnswer);}
 const full=E.create(bank,'full');assert.equal(full.ids.length,25);
 for(const t of topics){const num=full.ids.filter(id=>bank.find(q=>q.id===id).topic===t.id).length;assert(num===3||num===4);}
}
assert(signatures.size>180);assert.equal(orderSignatures.size,24);
for(const mode of ['quick','full','endless','topic','missed','weak','retry']){
 const s=E.create(bank,mode,mode==='missed'?bank.slice(0,4).map(q=>q.id):null,mode==='topic'?'events':null);assert(s);assert.equal(new Set(s.ids).size,s.ids.length);assert(E.validSession(s,bank));
}
const state=E.empty();state.session=E.create(bank,'quick');const s=state.session;
for(let i=0;i<10;i++){s.index=i;const q=bank.find(q=>q.id===s.ids[i]);s.selected=s.orders[i].indexOf(i<7?q.correctAnswer:(q.correctAnswer+1)%4);s.locked=false;assert(E.answer(state,bank));assert(!E.answer(state,bank));const restored=E.load(JSON.stringify(state),bank);assert.equal(restored.totalAnswered,i+1);assert.equal(restored.session.locked,true);assert.equal(restored.session.selected,s.selected);}
assert.equal(state.totalAnswered,10);assert.equal(state.totalCorrect,7);assert.equal(state.recentMissed.length,3);
assert.equal(Object.values(state.topics).reduce((a,t)=>a+t.answered,0),10);
const r=E.finish(state);assert.equal(r.percentage,70);assert.equal(r.correct,7);assert.equal(r.missed.length,3);assert.equal(state.history.length,1);assert.equal(state.bestScore.percentage,70);
const missed=E.create(bank,'missed',r.missed);assert.equal(missed.ids.length,3);assert(missed.ids.every(id=>r.missed.includes(id)));
const weak=E.create(bank,'weak',bank.filter(q=>r.weak.includes(q.topic)).map(q=>q.id));assert(weak.ids.every(id=>r.weak.includes(bank.find(q=>q.id===id).topic)));
state.session=missed;const mq=bank.find(q=>q.id===missed.ids[0]);missed.selected=missed.orders[0].indexOf(mq.correctAnswer);E.answer(state,bank);assert(!state.recentMissed.includes(mq.id));
const legacy=context.QUESTIONS.filter(q=>q.kind!=='scenario');const legacyState=E.empty();legacyState.session=E.create(legacy,'quick');const upgraded=E.load(JSON.stringify(legacyState),bank);assert.equal(upgraded.session.ids.length,10);
const bad=E.empty();bad.session={ids:['unknown']};assert.equal(E.load(JSON.stringify(bad),bank).session,null);
console.log('PASS: 112 questions; 32 additive scenarios; bank integrity and snippet syntax; all modes; balanced coverage; 200 randomization trials; shuffled-answer scoring; locked answers; missed/weak practice; topic totals; saved session persistence and backward compatibility.');
