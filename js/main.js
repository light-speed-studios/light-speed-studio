/**
 * WAVE | Light Speed Studios
 * WaveSurfer.js v7, SoundCloud-style bars.
 * Add BunnyCDN MP3 links to TRACKS below. Empty URLs are intentional placeholders.
 * IMPORTANT: Bunny CDN must permit cross-origin GET (CORS) for the audio assets.
 */
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';

const TRACKS = [
  {"title": "Under the Sea", "source": "Kingdom of Atlantis / Aquaman OST / Instrumental Remix", "category": "cinematic", "type": "featured", "description": "A remix of Kingdom of Atlantis from the Aquaman soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Atlantis.mp3"},
  {"title": "NightFall", "source": "Fiction by The xx / Instrumental Remix", "category": "ambient", "type": "featured", "description": "A remix of Fiction by The xx.", "url": "https://light-speed-studios.b-cdn.net/Bring%20on%20the%20Night.mp3"},
  {"title": "Catch You", "source": "Into the Dark by Ferry Corsten / Instrumental Remix", "category": "electronic", "type": "featured", "description": "A remix of Into the Dark by Ferry Corsten.", "url": "https://light-speed-studios.b-cdn.net/Catch%20You.mp3"},
  {"title": "Into the Fight", "source": "No Man’s Land / Wonder Woman OST / Instrumental Remix", "category": "cinematic", "type": "featured", "description": "A remix of No Man’s Land from the Wonder Woman soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Charge.mp3"},
  {"title": "Fearless", "source": "Lanterns OST / Extended Remix", "category": "cinematic", "type": "featured", "description": "An extended remix inspired by the Lanterns soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Fearless.mp3"},
  {"title": "Luna", "source": "Original Track", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/Luna.mp3"},
  {"title": "Delimma", "source": "Sucre’s Dilemma / Maricruz / Prison Break OST / Instrumental Remix", "category": "cinematic", "type": "featured", "description": "A remix combining Sucre’s Dilemma and Maricruz from Prison Break.", "url": "https://light-speed-studios.b-cdn.net/Maricruz.mp3"},
  {"title": "Waiting", "source": "Miracle by Beachwood / Instrumental Remix", "category": "ambient", "type": "featured", "description": "A remix of Miracle by Beachwood.", "url": "https://light-speed-studios.b-cdn.net/MIRACLE.mp3"},
  {"title": "Outer Range", "source": "Original Track", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/Range.mp3"},
  {"title": "Signal to the Stars", "source": "Deus Ex Machina by If These Trees Could Talk / Instrumental Remix", "category": "cinematic", "type": "featured", "description": "A remix of Deus Ex Machina by If These Trees Could Talk.", "url": "https://light-speed-studios.b-cdn.net/Signal%20to%20the%20Stars.mp3"},
  {"title": "Sky Fall", "source": "Go Beyond by Matthew Hales & Benjamin Hales / Instrumental Remix", "category": "cinematic", "type": "featured", "description": "A remix of Go Beyond by Matthew Hales and Benjamin Hales.", "url": "https://light-speed-studios.b-cdn.net/Sky%20Fall.mp3"},
  {"title": "SpeedForce", "source": "At the Speed of Force / Zack Snyder’s Justice League OST / Instrumental Remix", "category": "cinematic", "type": "featured", "description": "A remix of At the Speed of Force from Zack Snyder’s Justice League.", "url": "https://light-speed-studios.b-cdn.net/speed.mp3"},
  {"title": "Stay", "source": "Don’t Let Me Down (Intro) by The Chainsmokers / Instrumental Remix", "category": "electronic", "type": "featured", "description": "A remix of the intro to Don’t Let Me Down by The Chainsmokers.", "url": "https://light-speed-studios.b-cdn.net/Stay.mp3"},
  {"title": "Strike", "source": "Original Track", "category": "electronic", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/STRIKE.mp3"},
  {"title": "The Brain in the Machine", "source": "Doom Patrol Intro / Instrumental Remix", "category": "cinematic", "type": "featured", "description": "A remix of the Doom Patrol intro.", "url": "https://light-speed-studios.b-cdn.net/The%20Brain%20in%20the%20Machine.mp3"},
  {"title": "The Edge", "source": "End of the World by Ivan Shpilevsky / Instrumental Remix", "category": "cinematic", "type": "featured", "description": "A remix of End of the World by Ivan Shpilevsky.", "url": "https://light-speed-studios.b-cdn.net/The%20Edge.mp3"},
  {"title": "The Last Fall", "source": "Original Track", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/The%20Last%20Fall.mp3"},
  {"title": "Void", "source": "The Expanse Intro / Instrumental Remix", "category": "ambient", "type": "featured", "description": "A remix of the intro to The Expanse.", "url": "https://light-speed-studios.b-cdn.net/The%20Void.mp3"},
  {"title": "Wide Awake", "source": "Wake Up / Slingshot OST / Instrumental Remix", "category": "cinematic", "type": "featured", "description": "A remix of Wake Up from the Slingshot soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Woke%20up.mp3"},
];

const $ = (selector) => document.querySelector(selector);
const els = {
  title: $('#player-heading'), source: $('#wave-source'), description: $('#wave-description'),
  category: $('#wave-category'), type: $('#wave-type'), number: $('#wave-track-number'),
  current: $('#wave-current-time'), duration: $('#wave-duration'),
  play: $('#wave-play'), previous: $('#wave-previous'), next: $('#wave-next'),
  volume: $('#wave-volume'), mute: $('#wave-mute'), status: $('#wave-player-message'),
  label: $('#wave-status-label'), mode: $('#wave-player-mode'),
  placeholder: $('#waveform-placeholder'), trackList: $('#wave-track-list'),
  filters: $('#wave-filters'), empty: $('#wave-empty-state'),
  count: $('#wave-library-count'),
};

let selectedIndex = TRACKS.findIndex(track => track.title === 'Wide Awake');
let activeFilter = 'all';
let loadToken = 0;
let lastNonzeroVolume = 0.75;
let surfer;
let previousReady = () => {};
let previousError = () => {};

function timeString(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
function setMessage(message) { els.status.textContent = message; }
function waveformHeights(seed, size) {
  // Decorative bars only. Actual file waveform is rendered by WaveSurfer in main player.
  return Array.from({ length: size }, (_, i) => {
    const a = Math.abs(Math.sin((i + seed * 11) * 0.43) * Math.cos((i + seed * 7) * 0.17));
    const b = Math.abs(Math.sin((i + seed) * 0.09));
    return Math.round(9 + (a * 0.72 + b * 0.28) * 86);
  });
}
function populatePlaceholder(index) {
  els.placeholder.replaceChildren();
  waveformHeights(index + 1, 130).forEach(height => {
    const bar = document.createElement('span');
    bar.style.height = `${height}%`;
    els.placeholder.append(bar);
  });
}
function updatePlayIcon(isPlaying) {
  els.play.classList.toggle('is-playing', isPlaying);
  els.play.setAttribute('aria-label', isPlaying ? 'Pause track' : 'Play track');
  els.play.title = isPlaying ? 'Pause track' : 'Play track';
  els.label.textContent = isPlaying ? 'NOW PLAYING' : 'SELECTED TRACK';
}
function updateTrackMetadata(index) {
  const track = TRACKS[index];
  els.title.textContent = track.title;
  els.source.textContent = track.source;
  els.description.textContent = track.description || 'Instrumental remix';
  els.category.textContent = track.category.toUpperCase();
  els.type.textContent = track.type === 'original' ? 'ORIGINAL TRACKS' : 'FEATURED REMIXES';
  els.number.textContent = `TRACK ${String(index + 1).padStart(2, '0')}`;
  els.current.textContent = '0:00';
  els.duration.textContent = '0:00';
  els.mode.textContent = track.url ? 'LOADING AUDIO' : 'PREVIEW';
  populatePlaceholder(index);
  els.placeholder.classList.remove('is-hidden');
  updatePlayIcon(false);
}
function renderLibrary() {
  const filtered = TRACKS.map((track, index) => ({ ...track, index })).filter(track => {
    return activeFilter === 'all' || track.category === activeFilter || track.type === activeFilter;
  });
  els.trackList.replaceChildren();
  filtered.forEach(track => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `wave-track${track.index === selectedIndex ? ' is-selected' : ''}`;
    row.setAttribute('aria-label', `Select ${track.title}, ${track.source}`);
    row.setAttribute('aria-pressed', String(track.index === selectedIndex));
    const left = document.createElement('span'); left.className = 'wave-track-left';
    const play = document.createElement('span'); play.className = 'wave-list-play'; play.setAttribute('aria-hidden', 'true'); play.textContent = track.index === selectedIndex && surfer?.isPlaying() ? 'Ⅱ' : '▶';
    const details = document.createElement('span'); details.style.minWidth = '0';
    const title = document.createElement('span'); title.className = 'wave-track-name'; title.textContent = track.title;
    const sub = document.createElement('span'); sub.className = 'wave-track-sub'; sub.textContent = track.source;
    const artist = document.createElement('span'); artist.className = 'wave-track-artist'; artist.textContent = 'DIGITAL SALVATION';
    details.append(title, sub, artist); left.append(play, details);
    const mini = document.createElement('span'); mini.className = 'wave-mini'; mini.setAttribute('aria-hidden', 'true');
    waveformHeights(track.index + 1, 75).forEach(h => { const bar = document.createElement('i'); bar.style.height = `${h}%`; mini.append(bar); });
    const length = document.createElement('span'); length.className = 'wave-track-length'; length.textContent = track.duration || '—';
    row.append(left, mini, length);
    row.addEventListener('click', () => {
      if (selectedIndex === track.index && track.url && surfer) { surfer.playPause(); return; }
      selectTrack(track.index, Boolean(track.url));
    });
    els.trackList.append(row);
  });
  els.empty.hidden = filtered.length !== 0;
  els.count.textContent = `/ ${String(filtered.length).padStart(2, '0')}`;
}
function selectTrack(index, autoPlay = false) {
  selectedIndex = (index + TRACKS.length) % TRACKS.length;
  const currentToken = ++loadToken;
  const track = TRACKS[selectedIndex];
  surfer.pause();
  // Clear the old waveform while a new URL loads.
  surfer.empty();
  updateTrackMetadata(selectedIndex);
  renderLibrary();
  if (!track.url) {
    setMessage('Preview only. Add this track’s BunnyCDN MP3 URL in js/wave.js to enable playback.');
    return;
  }
  setMessage('Loading audio…');
  const onReady = () => {
    if (currentToken !== loadToken) return;
    els.placeholder.classList.add('is-hidden');
    els.mode.textContent = 'WAVEFORM';
    els.duration.textContent = timeString(surfer.getDuration());
    setMessage('Click the waveform to seek through the track.');
    if (autoPlay) surfer.play().catch(() => setMessage('Press Play to start audio.'));
  };
  const onError = error => {
    if (currentToken !== loadToken) return;
    els.placeholder.classList.remove('is-hidden');
    els.mode.textContent = 'UNAVAILABLE';
    setMessage(`Audio unavailable. Check the MP3 URL, public access, and CDN CORS settings. ${error?.message || ''}`);
  };
  surfer.un('ready', previousReady);
  surfer.un('error', previousError);
  previousReady = onReady;
  previousError = onError;
  surfer.once('ready', onReady);
  surfer.once('error', onError);
  surfer.load(track.url).catch(onError);
}

try {
  surfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#36586B',
    progressColor: '#00AEDE',
    cursorColor: '#00AEDE',
    height: 94,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    normalize: true,
    interact: true,
    dragToSeek: true,
  });
  surfer.setVolume(0.75);
  surfer.on('timeupdate', seconds => { els.current.textContent = timeString(seconds); });
  surfer.on('play', () => { updatePlayIcon(true); renderLibrary(); });
  surfer.on('pause', () => { updatePlayIcon(false); renderLibrary(); });
  surfer.on('finish', () => { selectTrack(selectedIndex + 1, Boolean(TRACKS[(selectedIndex + 1) % TRACKS.length].url)); });
  // A user click on the waveform seeks. If paused, it can begin playback, matching the chosen example.
  surfer.on('interaction', () => { if (TRACKS[selectedIndex].url && !surfer.isPlaying()) surfer.play().catch(() => {}); });
  els.play.addEventListener('click', () => {
    if (!TRACKS[selectedIndex].url) { setMessage('Add a BunnyCDN MP3 link to this track in js/wave.js first.'); return; }
    if (surfer.getDuration() > 0) surfer.playPause();
    else selectTrack(selectedIndex, true);
  });
  els.previous.addEventListener('click', () => selectTrack(selectedIndex - 1, Boolean(TRACKS[(selectedIndex - 1 + TRACKS.length) % TRACKS.length].url)));
  els.next.addEventListener('click', () => selectTrack(selectedIndex + 1, Boolean(TRACKS[(selectedIndex + 1) % TRACKS.length].url)));
  els.volume.addEventListener('input', () => {
    const value = Number(els.volume.value) / 100;
    surfer.setVolume(value);
    if (value > 0) lastNonzeroVolume = value;
    els.mute.setAttribute('aria-label', value === 0 ? 'Unmute' : 'Mute');
  });
  els.mute.addEventListener('click', () => {
    const next = surfer.getVolume() > 0 ? 0 : lastNonzeroVolume;
    surfer.setVolume(next); els.volume.value = String(Math.round(next * 100));
    els.mute.setAttribute('aria-label', next === 0 ? 'Unmute' : 'Mute');
  });
  els.filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    activeFilter = button.dataset.filter;
    els.filters.querySelectorAll('[data-filter]').forEach(item => {
      const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
    });
    renderLibrary();
  });
  selectTrack(selectedIndex);
} catch (error) {
  populatePlaceholder(0);
  els.trackList.textContent = 'Audio player failed to initialize. Verify the WaveSurfer.js CDN is accessible.';
  setMessage(`Could not initialize audio. ${error?.message || ''}`);
}
