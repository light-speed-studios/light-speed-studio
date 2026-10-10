/**
 * WAVE | Light Speed Studios
 * WaveSurfer.js v7, SoundCloud-style bars.
 * Add BunnyCDN MP3 links to TRACKS below. Empty URLs are intentional placeholders.
 * IMPORTANT: Bunny CDN must permit cross-origin GET (CORS) for the audio assets.
 */
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';

const TRACKS = [
  { title: 'Into the Light', source: 'Sunshine / Instrumental Remix', category: 'cinematic', description: 'An atmospheric instrumental reimagining.', durationLabel: '3:42', url: '' },
  { title: 'Event Horizon', source: 'Interstellar / Instrumental Remix', category: 'ambient', description: 'An expansive, ambient reinterpretation.', durationLabel: '4:18', url: '' },
  { title: 'Quiet City', source: 'The Batman / Instrumental Remix', category: 'cinematic', description: 'A quieter journey through a familiar theme.', durationLabel: '3:27', url: '' },
  { title: 'Mach Six', source: 'Speed Racer / Instrumental Remix', category: 'electronic', description: 'A driving electronic instrumental remix.', durationLabel: '3:51', url: '' },
];
// The above sample names and durations are illustrative, not published audio.
// Optional: durationLabel is used in the library until actual file metadata loads.

const $ = (selector) => document.querySelector(selector);
const els = {
  title: $('#player-heading'), source: $('#wave-source'), description: $('#wave-description'),
  category: $('#wave-category'), number: $('#wave-track-number'),
  current: $('#wave-current-time'), duration: $('#wave-duration'),
  play: $('#wave-play'), previous: $('#wave-previous'), next: $('#wave-next'),
  volume: $('#wave-volume'), mute: $('#wave-mute'), status: $('#wave-player-message'),
  label: $('#wave-status-label'), mode: $('#wave-player-mode'),
  placeholder: $('#waveform-placeholder'), trackList: $('#wave-track-list'),
  search: $('#wave-search'), filters: $('#wave-filters'), empty: $('#wave-empty-state'),
  count: $('#wave-library-count'),
};

let selectedIndex = 0;
let activeFilter = 'all';
let loadToken = 0;
let lastNonzeroVolume = 0.75;
let surfer;

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
  els.number.textContent = `TRACK ${String(index + 1).padStart(2, '0')}`;
  els.current.textContent = '0:00';
  els.duration.textContent = track.durationLabel || '0:00';
  els.mode.textContent = track.url ? 'LOADING AUDIO' : 'PREVIEW';
  populatePlaceholder(index);
  els.placeholder.classList.remove('is-hidden');
  updatePlayIcon(false);
}
function renderLibrary() {
  const query = els.search.value.trim().toLowerCase();
  const filtered = TRACKS.map((track, index) => ({ ...track, index })).filter(track => {
    const matchCategory = activeFilter === 'all' || track.category === activeFilter;
    const matchQuery = `${track.title} ${track.source} ${track.category}`.toLowerCase().includes(query);
    return matchCategory && matchQuery;
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
    details.append(title, sub); left.append(play, details);
    const mini = document.createElement('span'); mini.className = 'wave-mini'; mini.setAttribute('aria-hidden', 'true');
    waveformHeights(track.index + 1, 75).forEach(h => { const bar = document.createElement('i'); bar.style.height = `${h}%`; mini.append(bar); });
    const length = document.createElement('span'); length.className = 'wave-track-length'; length.textContent = track.durationLabel || '—';
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
  els.search.addEventListener('input', renderLibrary);
  els.filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    activeFilter = button.dataset.filter;
    els.filters.querySelectorAll('[data-filter]').forEach(item => {
      const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
    });
    renderLibrary();
  });
  selectTrack(0);
} catch (error) {
  populatePlaceholder(0);
  els.trackList.textContent = 'Audio player failed to initialize. Verify the WaveSurfer.js CDN is accessible.';
  setMessage(`Could not initialize audio. ${error?.message || ''}`);
}
