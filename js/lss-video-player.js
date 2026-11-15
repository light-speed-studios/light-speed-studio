/* LSS reusable trailer player: native HTML5 video controls */
(()=>{'use strict';
const svgPlay='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 4L43 24L13 44Z"/></svg>';
const svgPause='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 5h8v38h-8zM28 5h8v38h-8z"/></svg>';
const svgVolume='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z M16 9q4 3 0 6 M18 6q7 6 0 12"/></svg>';
const svgMute='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z M16 9l5 6 M21 9l-5 6"/></svg>';
const svgFull='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3H3v6 M15 3h6v6 M3 15v6h6 M21 15v6h-6"/></svg>';
const svgExit='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h6V3 M21 9h-6V3 M3 15h6v6 M21 15h-6v6"/></svg>';
const formatTime=s=>{if(!Number.isFinite(s))return '0:00';s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=String(s%60).padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${sec}`:`${m}:${sec}`};
function setup(root){if(root.dataset.lssVpReady)return;root.dataset.lssVpReady='true';
 const video=root.querySelector('.lss-vp-video'),seek=root.querySelector('.lss-vp-seek'),fill=root.querySelector('.lss-vp-fill'),buffer=root.querySelector('.lss-vp-buffer'),current=root.querySelector('.lss-vp-current'),duration=root.querySelector('.lss-vp-duration'),play=root.querySelector('.lss-vp-play'),mute=root.querySelector('.lss-vp-mute'),full=root.querySelector('.lss-vp-full'),volumeGroup=root.querySelector('.lss-vp-volume-group'),volumePanel=root.querySelector('.lss-vp-volume-panel'),volume=root.querySelector('.lss-vp-volume');
 if(!video||!seek||!fill||!current||!duration||!play||!mute||!full)return;
 let idleTimer,dragging=false;
 const update=()=>{const total=Number.isFinite(video.duration)?video.duration:0;const pct=total?Math.min(100,100*video.currentTime/total):0;fill.style.width=pct+'%';current.textContent=formatTime(video.currentTime);duration.textContent=formatTime(total);seek.setAttribute('aria-valuemax',String(Math.max(0,Math.floor(total))));seek.setAttribute('aria-valuenow',String(Math.floor(video.currentTime||0)));seek.setAttribute('aria-valuetext',`${formatTime(video.currentTime)} of ${formatTime(total)}`);if(video.buffered.length&&total){let end=0;for(let i=0;i<video.buffered.length;i++){if(video.buffered.start(i)<=video.currentTime)end=Math.max(end,video.buffered.end(i))}buffer.style.width=Math.min(100,100*end/total)+'%'}};
 const show=()=>{root.classList.remove('is-idle');clearTimeout(idleTimer);if(!video.paused&&!video.ended)idleTimer=setTimeout(()=>{if(!root.matches(':has(:focus-visible)')&&!dragging&&(!volumePanel||volumePanel.hidden))root.classList.add('is-idle')},1400)};
 const sync=()=>{const active=!video.paused&&!video.ended;root.classList.toggle('is-playing',active);play.innerHTML=active?svgPause:svgPlay;play.setAttribute('aria-label',active?'Pause trailer':'Play trailer');show()};
 const toggle=()=>{if(video.paused||video.ended){if(video.ended)video.currentTime=0;const promise=video.play();if(promise?.catch)promise.catch(()=>{root.classList.remove('is-playing');show()})}else video.pause()};
 const seekAt=x=>{if(!Number.isFinite(video.duration)||!video.duration)return;const rect=seek.getBoundingClientRect();video.currentTime=Math.min(video.duration,Math.max(0,(x-rect.left)/rect.width*video.duration));update();show()};
 play.addEventListener('click',toggle);video.addEventListener('click',toggle);
 seek.addEventListener('pointerdown',e=>{dragging=true;seek.setPointerCapture?.(e.pointerId);seekAt(e.clientX)});seek.addEventListener('pointermove',e=>{if(dragging)seekAt(e.clientX)});seek.addEventListener('pointerup',e=>{if(dragging)seekAt(e.clientX);dragging=false;show()});seek.addEventListener('pointercancel',()=>{dragging=false;show()});
 seek.addEventListener('keydown',e=>{const step=e.shiftKey?10:5;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();video.currentTime=Math.max(0,Math.min(video.duration||0,video.currentTime+(e.key==='ArrowRight'?step:-step)));update();show()}else if(e.key==='Home'||e.key==='End'){e.preventDefault();video.currentTime=e.key==='Home'?0:(video.duration||0);update();show()}});
 const syncVolume=()=>{if(!volume)return;volume.value=String(Math.round(video.muted?0:video.volume*100));volume.style.setProperty('--volume-level',volume.value+'%');mute.innerHTML=(video.muted||video.volume===0)?svgMute:svgVolume};
 const closeVolume=()=>{if(!volumePanel)return;volumePanel.hidden=true;mute.setAttribute('aria-expanded','false');mute.setAttribute('aria-label','Show volume slider');show()};
 mute.addEventListener('click',()=>{if(!volumePanel)return;const willOpen=volumePanel.hidden;volumePanel.hidden=!willOpen;mute.setAttribute('aria-expanded',String(willOpen));mute.setAttribute('aria-label',willOpen?'Hide volume slider':'Show volume slider');show()});
 if(volume){volume.addEventListener('input',()=>{video.volume=Number(volume.value)/100;video.muted=Number(volume.value)===0;syncVolume();show()});video.addEventListener('volumechange',syncVolume)}
 document.addEventListener('pointerdown',e=>{if(volumePanel&&!volumePanel.hidden&&!volumeGroup.contains(e.target))closeVolume()});
 root.addEventListener('keydown',e=>{if(e.key==='Escape'&&volumePanel&&!volumePanel.hidden){e.preventDefault();closeVolume();mute.focus()}});
 const updateFull=()=>{const isFull=document.fullscreenElement===root;full.innerHTML=isFull?svgExit:svgFull;full.setAttribute('aria-label',isFull?'Exit fullscreen':'Enter fullscreen')};
 full.addEventListener('click',async()=>{try{if(document.fullscreenElement===root)await document.exitFullscreen();else if(root.requestFullscreen)await root.requestFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen()}catch(e){/* fullscreen can be blocked by browser */}show()});document.addEventListener('fullscreenchange',updateFull);
 ['loadedmetadata','durationchange','timeupdate','progress','seeked'].forEach(name=>video.addEventListener(name,update));['play','pause','ended'].forEach(name=>video.addEventListener(name,sync));video.addEventListener('error',()=>root.classList.add('has-error'));
 root.addEventListener('pointermove',show);root.addEventListener('pointerdown',show);root.addEventListener('focusin',show);root.addEventListener('focusout',()=>setTimeout(show,0));root.addEventListener('pointerleave',()=>{if(!video.paused&&!root.matches(':has(:focus-visible)')&&(!volumePanel||volumePanel.hidden))root.classList.add('is-idle')});
 root.addEventListener('keydown',e=>{if(e.target===seek||e.target.tagName==='BUTTON')return;if(e.key===' '||e.key==='k'){e.preventDefault();toggle()}else if(e.key==='m'){e.preventDefault();video.muted=!video.muted;syncVolume()}else if(e.key==='f'){e.preventDefault();full.click()}});
 play.innerHTML=svgPlay;syncVolume();full.innerHTML=svgFull;update();sync();
}
function init(){document.querySelectorAll('.lss-video-player').forEach(setup)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
