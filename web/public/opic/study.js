'use strict';
(async () => {
const $=id=>document.getElementById(id);
let data,saved={},audioManifest=new Set();try{saved=JSON.parse(localStorage.getItem('mark-opic')||'{}')}catch{}
const params=new URLSearchParams(location.hash.slice(1));
let lang=(params.get('lang')||saved.lang)==='zh'?'zh':'en';
let index=Math.max(0,Math.min(59,(Number(params.get('q')||saved.q)||1)-1));
let hidden=false,playing=false,audioRun=0;
const audio=new Audio();audio.preload='auto';
const number=()=>String(index+1).padStart(2,'0');
const audioId=role=>`${lang}-q${number()}-${role}`;
const hasAudio=()=>audioManifest.has(audioId('question'))&&audioManifest.has(audioId('answer'));
const audioUrl=role=>`./audio/${lang}/q${number()}-${role}.mp3`;
function updateAudioUI(message=''){
  const available=hasAudio(),button=$('speech-toggle');
  button.disabled=!available;
  button.setAttribute('aria-pressed',String(playing));
  $('speech-label').textContent=playing?'정지':'연속 재생';
  button.querySelector('.play-icon').textContent=playing?'■':'▶';
  $('speech-status').textContent=message||(available?'AI 생성 음성':'음성 준비 중');
}
function stopAudio(message=''){
  audioRun++;playing=false;audio.pause();audio.removeAttribute('src');audio.load();updateAudioUI(message);
}
function playPart(part,run){
  if(!playing||run!==audioRun)return;
  audio.src=audioUrl(part);audio.currentTime=0;
  updateAudioUI(part==='question'?'질문 재생 중 · 여성 음성':'답안 재생 중 · 남성 음성');
  audio.onended=()=>{
    if(!playing||run!==audioRun)return;
    if(part==='question'){playPart('answer',run);return}
    if($('repeat-one').checked){playPart('question',run);return}
    if(index<59){index++;render();if(hasAudio())playPart('question',run);else stopAudio('다음 문항 음성 준비 중')}
    else stopAudio('전체 재생 완료');
  };
  audio.onerror=()=>{if(run===audioRun)stopAudio('음성을 재생할 수 없습니다')};
  audio.play().catch(()=>{if(run===audioRun)stopAudio('재생 버튼을 다시 눌러주세요')});
}
function startAudio(){
  if(!hasAudio()){updateAudioUI('음성 준비 중');return}
  audioRun++;const run=audioRun;playing=true;audio.pause();updateAudioUI('재생 준비 중');playPart('question',run);
}
const block=(lines,tag='p')=>{const el=document.createElement(tag);el.append(document.createTextNode(lines[0]||''));if(lines[1]){const small=document.createElement('small');small.className='pinyin';small.lang='zh-Latn';small.textContent=lines.slice(1).join(' ');el.append(small)}return el};
function render(){const item=data[lang][index];$('topic').textContent=`Q${number()} · ${item.title}`;$('jump').value=index;$('position').textContent=`${number()} / 60`;$('question').replaceChildren(block(item.question,'div'));$('answer').replaceChildren(...item.answer.map(x=>block(x)));$('answer').hidden=hidden;$('answer-toggle').textContent=hidden?'답안 보기':'답안 가리기';$('answer-toggle').setAttribute('aria-expanded',String(!hidden));$('vocab').replaceChildren(...item.vocab.flatMap(v=>{const dt=block(v.slice(1),'dt');const dd=document.createElement('dd');dd.lang='ko';dd.textContent=v[0];return[dt,dd]}));for(const id of ['en','zh'])$(id).setAttribute('aria-pressed',String(lang===id));for(const id of ['question','answer','vocab'])$(id).lang=lang==='zh'?'zh-Hans':'en';$('prev').disabled=index===0;$('next').disabled=index===59;document.querySelectorAll('.qa,aside,.sheet').forEach(x=>x.scrollTop=0);history.replaceState(null,'',`#q=${index+1}&lang=${lang}`);try{localStorage.setItem('mark-opic',JSON.stringify({q:index+1,lang}))}catch{}updateAudioUI()}
function move(delta){const next=Math.min(59,Math.max(0,index+delta));if(next!==index){const resume=playing;index=next;if(resume)stopAudio();render();if(resume&&hasAudio())startAudio()}}
try{const [dataResponse,manifestResponse]=await Promise.all([fetch('./data.json'),fetch('./audio-manifest.json')]);if(!dataResponse.ok)throw Error('load');data=await dataResponse.json();if(manifestResponse.ok){const manifest=await manifestResponse.json();audioManifest=new Set(manifest.completed||[])}for(const [i,item]of data.en.entries()){const o=document.createElement('option');o.value=i;o.textContent=`Q${String(i+1).padStart(2,'0')} · ${item.title}`;$('jump').append(o)}render();$('study').setAttribute('aria-busy','false')}catch{$('topic').textContent='자료를 불러오지 못했습니다. 새로고침해 주세요.';return}
$('prev').onclick=()=>move(-1);$('next').onclick=()=>move(1);$('jump').onchange=e=>{const resume=playing;if(resume)stopAudio();index=Number(e.target.value);render();if(resume&&hasAudio())startAudio()};for(const id of ['en','zh'])$(id).onclick=()=>{const resume=playing;if(resume)stopAudio();lang=id;render();if(resume&&hasAudio())startAudio()};$('answer-toggle').onclick=()=>{hidden=!hidden;render()};$('speech-toggle').onclick=()=>playing?stopAudio('재생 정지'):startAudio();$('downloads').onclick=()=>$('download-dialog').showModal();$('close-dialog').onclick=()=>$('download-dialog').close();
document.addEventListener('keydown',e=>{if($('download-dialog').open||/SELECT|INPUT|TEXTAREA/.test(e.target.tagName)||e.altKey||e.metaKey||e.ctrlKey)return;if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}});
let start=null;$('study').addEventListener('touchstart',e=>{if(e.touches.length!==1||e.target.closest('button,select,a')){start=null;return}const t=e.touches[0];start={x:t.clientX,y:t.clientY,time:Date.now()}},{passive:true});$('study').addEventListener('touchend',e=>{if(!start)return;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.8&&Date.now()-start.time<1000)move(dx<0?1:-1);start=null},{passive:true});$('study').addEventListener('touchcancel',()=>start=null,{passive:true});
window.addEventListener('hashchange',()=>{const p=new URLSearchParams(location.hash.slice(1));if(playing)stopAudio();index=Math.max(0,Math.min(59,(Number(p.get('q'))||1)-1));lang=p.get('lang')==='zh'?'zh':'en';render()});
window.addEventListener('pagehide',()=>stopAudio());
})();
