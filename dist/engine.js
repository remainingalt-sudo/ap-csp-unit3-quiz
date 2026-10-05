(function(root) {
  const shuffle = (items, random = Math.random) => {
    const a = [...items];
    for (let i=a.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  };
  const percent = (correct,total) => total ? Math.round(correct/total*100) : 0;
  const empty = () => ({version:1,totalAnswered:0,totalCorrect:0,bestScore:null,topics:{},recentMissed:[],history:[],session:null,lastResult:null});
  function balanced(bank,count) {
    const buckets=shuffle([...new Set(bank.map(q=>q.topic))]).map(t=>shuffle(bank.filter(q=>q.topic===t)));
    const picked=[];
    while(picked.length<Math.min(count,bank.length)) for(const b of buckets) {if(b.length && picked.length<count) picked.push(b.pop());}
    return shuffle(picked);
  }
  function create(bank,mode,ids,topic) {
    let pool=ids ? [...new Set(ids)].map(id=>bank.find(q=>q.id===id)).filter(Boolean) : topic ? bank.filter(q=>q.topic===topic) : bank;
    let questions=mode==='full' ? balanced(pool,25) : shuffle(pool).slice(0,mode==='quick'?10:pool.length);
    if(!questions.length) return null;
    return {mode,topic:topic||null,ids:questions.map(q=>q.id),orders:questions.map(q=>shuffle([0,1,2,3])),index:0,selected:null,locked:false,answers:[],round:1,startedAt:Date.now()};
  }
  function answer(state,bank) {
    const s=state.session;
    if(!s || s.locked || s.selected===null) return false;
    const q=bank.find(q=>q.id===s.ids[s.index]);
    const choice=s.orders[s.index][s.selected];
    const correct=choice===q.correctAnswer;
    s.answers.push({id:q.id,topic:q.topic,choice,correct});s.locked=true;
    state.totalAnswered++;state.totalCorrect+=Number(correct);
    const t=state.topics[q.topic]||(state.topics[q.topic]={answered:0,correct:0});t.answered++;t.correct+=Number(correct);
    state.recentMissed=state.recentMissed.filter(id=>id!==q.id);
    if(!correct) state.recentMissed.unshift(q.id);
    state.recentMissed=state.recentMissed.slice(0,40);
    return true;
  }
  function result(s) {
    const topics={};
    for(const a of s.answers) { const t=topics[a.topic]||(topics[a.topic]={answered:0,correct:0});t.answered++;t.correct+=Number(a.correct); }
    const correct=s.answers.filter(a=>a.correct).length;
    return {mode:s.mode,topic:s.topic,ids:[...s.ids],answered:s.answers.length,correct,percentage:percent(correct,s.answers.length),topics,missed:[...new Set(s.answers.filter(a=>!a.correct).map(a=>a.id))],weak:Object.keys(topics).filter(t=>percent(topics[t].correct,topics[t].answered)<80),finishedAt:Date.now(),complete:s.answers.length===s.ids.length,round:s.round};
  }
  function finish(state) {
    if(!state.session) return state.lastResult;
    const r=result(state.session);
    if(r.answered) {
      state.history.unshift({correct:r.correct,answered:r.answered,percentage:r.percentage,mode:r.mode,finishedAt:r.finishedAt});state.history=state.history.slice(0,20);
      if(r.complete && (!state.bestScore || r.percentage>state.bestScore.percentage || (r.percentage===state.bestScore.percentage&&r.answered>state.bestScore.answered))) state.bestScore={percentage:r.percentage,correct:r.correct,answered:r.answered};
    }
    state.lastResult=r;state.session=null;return r;
  }
  function validSession(s,bank) {
    const known=new Set(bank.map(q=>q.id));
    return s&&Array.isArray(s.ids)&&s.ids.length&&new Set(s.ids).size===s.ids.length&&s.ids.every(id=>known.has(id))&&Array.isArray(s.orders)&&s.orders.length===s.ids.length&&s.orders.every(o=>Array.isArray(o)&&o.length===4&&[...o].sort().join()==='0,1,2,3')&&Number.isInteger(s.index)&&s.index>=0&&s.index<s.ids.length&&Array.isArray(s.answers)&&s.answers.length===s.index+Number(s.locked===true)&&s.answers.every(a=>known.has(a.id)&&typeof a.correct==='boolean')&&(s.selected===null||Number.isInteger(s.selected)&&s.selected>=0&&s.selected<4);
  }
  function load(raw,bank) {
    if(!raw) return empty();
    const saved=JSON.parse(raw);const state=Object.assign(empty(),saved);
    state.totalAnswered=Math.max(0,Number(state.totalAnswered)||0);state.totalCorrect=Math.min(state.totalAnswered,Math.max(0,Number(state.totalCorrect)||0));
    state.topics=state.topics&&typeof state.topics==='object'&&!Array.isArray(state.topics)?state.topics:{};
    for(const [id,t] of Object.entries(state.topics)) { if(!t||typeof t!=='object'){delete state.topics[id];continue;} t.answered=Math.max(0,Number(t.answered)||0);t.correct=Math.min(t.answered,Math.max(0,Number(t.correct)||0)); }
    state.recentMissed=Array.isArray(state.recentMissed)?[...new Set(state.recentMissed)].filter(id=>bank.some(q=>q.id===id)).slice(0,40):[];
    state.history=Array.isArray(state.history)?state.history.slice(0,20):[];
    state.session=validSession(state.session,bank)?state.session:null;
    return state;
  }
  root.QuizEngine={shuffle,percent,empty,balanced,create,answer,result,finish,load,validSession};
})(typeof window==='undefined'?globalThis:window);
