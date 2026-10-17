
/**
 * WAVE | Light Speed Studios
 * WaveSurfer.js v7, SoundCloud-style bars.
 * Add BunnyCDN MP3 links to TRACKS below. Empty URLs are intentional placeholders.
 * IMPORTANT: Bunny CDN must permit cross-origin GET (CORS) for the audio assets.
 */
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const TRACKS = [
  {"title": "Under the Sea", "source": "Kingdom of Atlantis / Aquaman OST", "category": "cinematic", "type": "featured", "description": "A remix of Kingdom of Atlantis from the Aquaman soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Atlantis1.mp3"},
  {"title": "Into the Fight", "source": "No Man’s Land / Wonder Woman OST", "category": "cinematic", "type": "featured", "description": "A remix of No Man’s Land from the Wonder Woman soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Charge.mp3"},
  {"title": "Luna", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/Luna.mp3"},
  {"title": "Delimma", "source": "Sucre’s Dilemma / Maricruz / Prison Break OST", "category": "cinematic", "type": "featured", "description": "A remix combining Sucre’s Dilemma and Maricruz from Prison Break.", "url": "https://light-speed-studios.b-cdn.net/Maricruz.mp3"},
  {"title": "Waiting", "source": "Miracle / Beachwood", "category": "ambient", "type": "featured", "description": "A remix of Miracle / Beachwood.", "url": "https://light-speed-studios.b-cdn.net/MIRACLE.mp3"},
  {"title": "Daybreak", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/Range.mp3"},
  {"title": "Signal to the Stars", "source": "Deus Ex Machina / If These Trees Could Talk", "category": "cinematic", "type": "featured", "description": "A remix of Deus Ex Machina / If These Trees Could Talk.", "url": "https://light-speed-studios.b-cdn.net/Signal%20to%20the%20Stars.mp3"},
  {"title": "Sky Fall", "source": "Go Beyond / Matthew Hales & Benjamin Hales", "category": "cinematic", "type": "featured", "description": "A remix of Go Beyond / Matthew Hales and Benjamin Hales.", "url": "https://light-speed-studios.b-cdn.net/Sky%20Fall.mp3"},
  {"title": "SpeedForce", "source": "At the Speed of Force / Zack Snyder’s Justice League OST", "category": "cinematic", "type": "featured", "description": "A remix of At the Speed of Force from Zack Snyder’s Justice League.", "url": "https://light-speed-studios.b-cdn.net/speed.mp3"},
  {"title": "Stay", "source": "Don’t Let Me Down (Intro) / The Chainsmokers", "category": "electronic", "type": "featured", "description": "A remix of the intro to Don’t Let Me Down / The Chainsmokers.", "url": "https://light-speed-studios.b-cdn.net/stayy.mp3"},
  {"title": "SuperNova", "source": "Original Track / Digital Salvation", "category": "electronic", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/STRIKE.mp3"},
  {"title": "The Edge", "source": "End of the World / Ivan Shpilevsky", "category": "cinematic", "type": "featured", "description": "A remix of End of the World / Ivan Shpilevsky.", "url": "https://light-speed-studios.b-cdn.net/The%20Edge.mp3"},
  {"title": "Sirens of the Stars", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/The%20Last%20Fall.mp3"},
  {"title": "Wide Awake", "source": "Wake Up / Slingshot OST", "category": "cinematic", "type": "featured", "description": "A remix of Wake Up from the Slingshot soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Wokeup.mp3"},
  {"title": "First Light", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/Syrens%20Call.mp3"},
  {"title": "Solar Rush", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/LeftIntheDust.mp3"},
  {"title": "Caught in the Undertow", "source": "He's a Pirate (Remix) / DJ Tiesto", "category": "cinematic", "type": "featured", "description": "A remix of DJ Tiesto's remix of He's a Pirate from Pirates of the Caribbean.", "url": "https://light-speed-studios.b-cdn.net/IntotheOcean.mp3"},
  {"title": "Sailing to Orion", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/Traveler1.mp3"},
];

// WAVE likes use only the public, browser-safe Supabase key.
const supabase = createClient(
  'https://yvzplqilaxuqwdrhsgrl.supabase.co',
  'sb_publishable_d1LXYWzfZHwmWYb_hj5Ztw_GtpIRQ4h',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }
);

// IDs remain stable even when MP3 filenames or track titles change.
const TRACK_IDS = [
  'under-the-sea', 'into-the-fight', 'luna', 'delimma', 'waiting',
  'outer-range', 'signal-to-the-stars', 'sky-fall', 'speedforce', 'stay',
  'strike', 'the-edge', 'the-last-fall', 'wide-awake', 'call-from-the-deep',
  'dust-and-daylight', 'caught-in-the-undertow', 'elsewhere'
];
const likeCounts = new Map();
const likedTracks = new Set();
const busyLikes = new Set();
let likesAvailable = false;

// Keep the main-player heart in sync with the playlist and current track.
function updateFeatureLike() {
  const button = document.querySelector('#wave-feature-like');
  const count = document.querySelector('#wave-feature-like-count');
  if (!button || !count) return;
  const id = TRACK_IDS[selectedIndex];
  const track = TRACKS[selectedIndex];
  const liked = likedTracks.has(id);
  button.classList.toggle('is-liked', liked);
  button.setAttribute('aria-pressed', String(liked));
  button.setAttribute('aria-label', `${liked ? 'Unlike' : 'Like'} ${track.title}`);
  button.title = `${liked ? 'Unlike' : 'Like'} ${track.title}`;
  button.disabled = busyLikes.has(id);
  count.textContent = likesAvailable ? String(likeCounts.get(id) || 0) : '…';
}

function setLikeNotice(message) {
  const target = document.querySelector('#wave-like-notice');
  if (target) target.textContent = message;
}

async function refreshLikes() {
  const { data, error } = await supabase.rpc('wave_like_totals');
  if (error) {
    likesAvailable = false;
    setLikeNotice('Likes are temporarily unavailable.');
    renderLibrary();
    return;
  }
  likesAvailable = true;
  likeCounts.clear();
  likedTracks.clear();
  (data || []).forEach(item => {
    likeCounts.set(item.track_id, Number(item.like_count) || 0);
    if (item.viewer_liked) likedTracks.add(item.track_id);
  });
  setLikeNotice('');
  renderLibrary();
}

async function toggleTrackLike(trackId) {
  if (busyLikes.has(trackId)) return;
  busyLikes.add(trackId);
  setLikeNotice('');
  renderLibrary();
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    let session = sessionData.session;
    if (!session) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      session = data.session;
    }
    const userId = session?.user?.id;
    if (!userId) throw new Error('Unable to start anonymous sign-in.');

    // Always refresh first so a returning visitor's own vote is recognized.
    const { data: current, error: totalsError } = await supabase.rpc('wave_like_totals');
    if (totalsError) throw totalsError;
    const alreadyLiked = (current || []).some(item => item.track_id === trackId && item.viewer_liked);
    let result;
    if (alreadyLiked) {
      result = await supabase.from('wave_likes')
        .delete().eq('track_id', trackId).eq('user_id', userId);
    } else {
      result = await supabase.from('wave_likes')
        .insert({ track_id: trackId, user_id: userId });
    }
    if (result.error) throw result.error;
    await refreshLikes();
  } catch (error) {
    setLikeNotice('Could not update your like. Please try again.');
    console.error('WAVE like request failed:', error);
  } finally {
    busyLikes.delete(trackId);
    renderLibrary();
  }
}

const $ = (selector) => document.querySelector(selector);
const els = {
  title: $('#player-heading'), source: $('#wave-source'),
  type: $('#wave-type'), number: $('#wave-track-number'),
  current: $('#wave-current-time'), duration: $('#wave-duration'),
  play: $('#wave-play'), previous: $('#wave-previous'), next: $('#wave-next'),
  volume: $('#wave-volume'), mute: $('#wave-mute'), status: $('#wave-player-message'),
  label: $('#wave-status-label'), mode: $('#wave-player-mode'),
  placeholder: $('#waveform-placeholder'), trackList: $('#wave-track-list'),
  filters: $('#wave-filters'), empty: $('#wave-empty-state'),
  count: $('#wave-library-count'),
};

// Playback order: featured opening track, then all remaining titles A–Z.
// Keep TRACKS and TRACK_IDS in their original positions so likes remain mapped correctly.
const playbackOrder = TRACKS.map((track, index) => index).sort((a, b) => {
  if (TRACKS[a].title === 'Wide Awake') return -1;
  if (TRACKS[b].title === 'Wide Awake') return 1;
  return TRACKS[a].title.localeCompare(TRACKS[b].title, undefined, { sensitivity: 'base' });
});
function adjacentTrackIndex(direction) {
  const position = playbackOrder.indexOf(selectedIndex);
  return playbackOrder[(position + direction + playbackOrder.length) % playbackOrder.length];
}
let selectedIndex = TRACKS.findIndex(track => track.title === 'Wide Awake');
let activeFilter = 'all';
let loadToken = 0;
let lastNonzeroVolume = 0.75;
let surfer;
let pendingAutoplay = false;
let audioLoadFailed = false;

function timeString(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
function setMessage(message) { els.status.textContent = message; }
function waveformHeights(seed, size) {
  // Deterministic, full-song silhouette with distinct quiet and loud passages.
  const sections = [0.48, 0.76, 0.87, 0.91, 0.84, 0.35, 0.57, 0.70, 0.83, 0.95, 0.72, 0.86, 0.18];
  return Array.from({ length: size }, (_, i) => {
    const p = i / Math.max(1, size - 1) * (sections.length - 1);
    const index = Math.floor(p);
    const mix = p - index;
    const envelope = sections[index] * (1 - mix) + sections[Math.min(index + 1, sections.length - 1)] * mix;
    const transient = 0.66 + 0.22 * Math.abs(Math.sin((i + seed) * 1.47)) +
      0.12 * Math.abs(Math.sin(i * 0.34 + seed * 0.11));
    return Math.round(Math.max(5, Math.min(96, envelope * transient * 100)));
  });
}
let placeholderDecayFrame = 0;
let placeholderDecayStarted = 0;
function animatePlaceholderDecay() {
  if (placeholderDecayFrame) cancelAnimationFrame(placeholderDecayFrame);
  placeholderDecayStarted = performance.now();
  const bars = [...els.placeholder.children];
  const original = bars.map(bar => Number.parseFloat(bar.style.height) || 0);
  const duration = 2500;
  function step(now) {
    const p = Math.min(1, (now - placeholderDecayStarted) / duration);
    const remaining = Math.pow(1 - p, 2.1);
    bars.forEach((bar, i) => {
      const ripple = 1 + 0.06 * Math.sin(p * 15 + i * 0.13) * (1 - p);
      bar.style.height = `${Math.max(0, original[i] * remaining * ripple)}%`;
    });
    if (p < 1 && !els.placeholder.classList.contains('is-hidden')) {
      placeholderDecayFrame = requestAnimationFrame(step);
    } else {
      placeholderDecayFrame = 0;
    }
  }
  placeholderDecayFrame = requestAnimationFrame(step);
}
function populatePlaceholder(index) {
  if (placeholderDecayFrame) cancelAnimationFrame(placeholderDecayFrame);
  placeholderDecayFrame = 0;
  els.placeholder.replaceChildren();
  waveformHeights(index + 1, 230).forEach(height => {
    const bar = document.createElement('span');
    bar.style.height = `${height}%`;
    els.placeholder.append(bar);
  });
  // The opening fades once; subsequent track loads use the static silhouette.
  if (!populatePlaceholder.hasAnimated) {
    populatePlaceholder.hasAnimated = true;
    animatePlaceholderDecay();
  }
}

function updatePlayIcon(isPlaying) {
  els.play.classList.toggle('is-playing', isPlaying);
  els.play.setAttribute('aria-label', isPlaying ? 'Pause track' : 'Play track');
  els.play.title = isPlaying ? 'Pause track' : 'Play track';
  els.label.textContent = isPlaying ? 'NOW PLAYING' : 'SELECTED TRACK';
}
function updateTrackMetadata(index) {
  const track = TRACKS[index];
  updateFeatureLike();
  els.title.textContent = track.title;
  els.source.textContent = track.source;
  els.type.textContent = track.type === 'original' ? 'ORIGINAL TRACKS' : 'FEATURED REMIXES';
  els.number.textContent = `TRACK ${String(index + 1).padStart(2, '0')}`;
  els.current.textContent = '0:00';
  els.duration.textContent = track.duration ? timeString(track.duration) : '—:——';
  els.mode.textContent = track.url ? 'LOADING TRACK' : 'PREVIEW';
  populatePlaceholder(index);
  els.placeholder.classList.remove('is-hidden');
  updatePlayIcon(false);
}
function renderLibrary() {
  updateFeatureLike();
  const filtered = TRACKS.map((track, index) => ({ ...track, index })).filter(track => {
    return activeFilter === 'all' || track.type === activeFilter;
  }).sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  els.trackList.replaceChildren();
  filtered.forEach(track => {
    // Separate buttons prevent a heart click from selecting/playing the song.
    const row = document.createElement('div');
    row.className = `wave-track${track.index === selectedIndex ? ' is-selected' : ''}`;
    const select = document.createElement('button');
    select.type = 'button';
    select.className = 'wave-track-select';
    select.setAttribute('aria-label', `Select ${track.title}, ${track.source}`);
    select.setAttribute('aria-pressed', String(track.index === selectedIndex));

    const left = document.createElement('span'); left.className = 'wave-track-left';
    const play = document.createElement('span');
    play.className = 'wave-list-play';
    play.setAttribute('aria-hidden', 'true');
    const playing = track.index === selectedIndex && Boolean(surfer?.isPlaying());
    play.classList.toggle('is-playing', playing);
    play.innerHTML = `<svg class="wave-list-play-svg" viewBox="0 0 100 100" focusable="false" aria-hidden="true">
      <path class="wave-play-stroke-solid" d="M49.9 2.5C23.6 2.8 2.1 24.4 2.5 50.4 2.9 76.5 24.7 98 50.3 97.5 76.7 96.9 97.7 75.7 97.5 49.8 97.3 23.7 75.7 2.3 49.9 2.5"/>
      <path class="wave-play-stroke-dotted" d="M49.9 2.5C23.6 2.8 2.1 24.4 2.5 50.4 2.9 76.5 24.7 98 50.3 97.5 76.7 96.9 97.7 75.7 97.5 49.8 97.3 23.7 75.7 2.3 49.9 2.5"/>
      <path class="wave-play-triangle" d="M38 69c-1 .5-1.8 0-1.8-1.1V32.1c0-1.1.8-1.6 1.8-1.1l34 18c1 .5 1 1.4 0 1.9L38 69z"/>
      <path class="wave-play-pause" d="M36 31h10v38H36zM55 31h10v38H55z"/>
    </svg>`;
    const details = document.createElement('span'); details.style.minWidth = '0';
    const title = document.createElement('span'); title.className = 'wave-track-name'; title.textContent = track.title;
    details.append(title); left.append(play, details);
    const credit = document.createElement('span');
    credit.className = 'wave-track-credit';
    credit.textContent = track.source;
    const length = document.createElement('span'); length.className = 'wave-track-length'; length.textContent = track.duration ? timeString(track.duration) : '—';
    select.append(left, credit, length);
    select.addEventListener('click', () => {
      if (selectedIndex === track.index && track.url && surfer) {
        surfer.playPause();
        return;
      }
      selectTrack(track.index, Boolean(track.url));
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });

    const id = TRACK_IDS[track.index];
    const liked = likedTracks.has(id);
    const heart = document.createElement('button');
    heart.type = 'button';
    heart.className = `wave-like-button${liked ? ' is-liked' : ''}`;
    heart.setAttribute('aria-pressed', String(liked));
    heart.setAttribute('aria-label', `${liked ? 'Unlike' : 'Like'} ${track.title}`);
    heart.title = liked ? `Unlike ${track.title}` : `Like ${track.title}`;
    heart.disabled = busyLikes.has(id);
    heart.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>`;
    const number = document.createElement('span');
    number.className = 'wave-like-count';
    number.textContent = likesAvailable ? String(likeCounts.get(id) || 0) : '…';
    heart.append(number);
    heart.addEventListener('click', () => toggleTrackLike(id));
    row.append(select, heart);
    els.trackList.append(row);
  });
  els.empty.hidden = filtered.length !== 0;
  // Keep counts inside the existing filter buttons. The heading has no count.
  const counts = {
    all: TRACKS.length,
    featured: TRACKS.filter(track => track.type === 'featured').length,
    original: TRACKS.filter(track => track.type === 'original').length
  };
  const labels = { all: 'ALL TRACKS', featured: 'FEATURED REMIXES', original: 'ORIGINAL TRACKS' };
  els.filters.querySelectorAll('[data-filter]').forEach(button => {
    const filter = button.dataset.filter;
    if (Object.hasOwn(counts, filter)) button.textContent = `${labels[filter]} | ${counts[filter]}`;
  });
}
function selectTrack(index, autoPlay = false) {
  selectedIndex = (index + TRACKS.length) % TRACKS.length;
  const track = TRACKS[selectedIndex];
  ++loadToken;
  pendingAutoplay = autoPlay;
  audioLoadFailed = false;
  if (surfer?.isPlaying()) surfer.pause();
  // WaveSurfer.load() replaces the previous audio and waveform itself.
  // Calling surfer.empty() here can leave its internal media unset.
  updateTrackMetadata(selectedIndex);
  renderLibrary();
  if (!track.url) {
    setMessage('Audio URL has not been added for this track.');
    return;
  }
  setMessage('LOADING TRACK…');
  surfer.load(track.url).catch(error => {
    audioLoadFailed = true;
    els.placeholder.classList.remove('is-hidden');
    els.mode.textContent = 'UNAVAILABLE';
    setMessage('Unable to play this track. Please refresh the page.');
  });
}


// Discover actual durations from MP3 metadata. Only three requests run at once.
// The player itself will also update the active track duration on load.
function loadLibraryDurations() {
  let cursor = 0;
  const workers = Array.from({ length: 3 }, async () => {
    while (cursor < TRACKS.length) {
      const index = cursor++;
      const track = TRACKS[index];
      if (!track.url || track.duration) continue;
      await new Promise(resolve => {
        const media = new Audio();
        let settled = false;
        const timeout = setTimeout(() => finish(), 9000);
        const finish = () => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          media.removeAttribute('src');
          media.load();
          resolve();
        };
        media.preload = 'metadata';
        media.onloadedmetadata = () => {
          if (Number.isFinite(media.duration) && media.duration > 0) {
            track.duration = media.duration;
            if (selectedIndex === index && !surfer?.getDuration()) els.duration.textContent = timeString(media.duration);
            renderLibrary();
          }
          finish();
        };
        media.onerror = finish;
        media.src = track.url;
        media.load();
      });
    }
  });
  return Promise.all(workers);
}


// WAVE custom cyan spectrum ring. Reuses the existing WaveSurfer audio element.
// Idle: a thin cyan circle. Playing: independent radial bars emerging outward.
function installWaveVisualizer(player) {
  const canvas = document.querySelector('#wave-live-visualizer');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const mobileFlux = document.querySelector('#wave-mobile-flux');
  const mobileEcho = document.querySelector('#wave-mobile-echo');
  const mobileFluxCtx = mobileFlux?.getContext('2d');
  const mobileEchoCtx = mobileEcho?.getContext('2d');
  const modeButtons = document.querySelectorAll('[data-wave-visualizer-mode]');
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const media = player.getMediaElement();
  media.crossOrigin = 'anonymous';
  let audioContext = null;
  let analyser = null;
  let frequencyData = null;
  let frame = 0;
  let width = 240;
  let height = 240;
  let mode = 'halo';
  let failed = false;
  let destroyed = false;
  const haloLevels = new Float32Array(112);
  const echoLevels = new Float32Array(88);
  const openingDuration = 3000;
  let openingStart = performance.now();
  let openingEnabled = true;

  function connectAudio() {
    if (failed || destroyed || !AudioContextClass) return;
    try {
      if (!audioContext) {
        audioContext = new AudioContextClass();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.76;
        analyser.minDecibels = -92;
        analyser.maxDecibels = -28;
        const source = audioContext.createMediaElementSource(media);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
      }
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    } catch (error) {
      failed = true;
      console.warn('WAVE visualizer could not initialize:', error);
    }
  }

  function resizeCanvas(target, context) {
    if (!target || !context) return { width: 0, height: 0 };
    const bounds = target.getBoundingClientRect();
    const w = Math.max(1, bounds.width);
    const h = Math.max(1, bounds.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    target.width = Math.round(w * dpr);
    target.height = Math.round(h * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { width: w, height: h };
  }

  function resize() {
    if (destroyed) return;
    ({ width, height } = resizeCanvas(canvas, ctx));
    resizeCanvas(mobileFlux, mobileFluxCtx);
    resizeCanvas(mobileEcho, mobileEchoCtx);
    ensureFrame();
  }

  function drawOne(target, context, drawMode, w, h, playing, opening, openingStrength) {
    if (!target || !context || !w || !h) return false;
    const ctx = context;
    const width = w;
    const height = h;
    ctx.clearRect(0, 0, width, height);
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = size * 0.285;
    const maxLength = size * 0.238;
    const levels = drawMode === 'halo' ? haloLevels : echoLevels;
    let stillMoving = false;

    const averageBand = (from, to) => {
      if (!playing || !frequencyData?.length) return 0;
      const upper = frequencyData.length - 1;
      const start = Math.max(0, Math.min(upper, from | 0));
      const end = Math.max(start, Math.min(upper, to | 0));
      let total = 0;
      for (let idx = start; idx <= end; idx++) total += frequencyData[idx];
      return total / ((end - start + 1) * 255);
    };

    const lowEnergy = averageBand(2, 22);
    const midEnergy = averageBand(23, 90);
    const highEnergy = averageBand(91, 210);
    const playbackFloor = playing ? Math.min(0.095, 0.025 + lowEnergy * 0.055 + midEnergy * 0.025) : 0;

    for (let i = 0; i < levels.length; i++) {
      const angle = i * Math.PI * 2 / levels.length - Math.PI / 2;
      const fraction = i / levels.length;
      let liveTarget = 0;
      if (drawMode === 'halo') {
        // Repeat the same low-to-mid spectrum profile in each quadrant so
        // quiet passages still light the full circle, not only top/bottom.
        const quadrant = levels.length / 4;
        const quarterPosition = (i % quadrant) / Math.max(1, quadrant - 1);
        const primaryBin = Math.floor(8 + Math.pow(quarterPosition, 1.08) * 112);
        const secondaryBin = Math.floor(24 + Math.pow(1 - quarterPosition, 1.18) * 84);
        const tertiaryBin = Math.floor(52 + Math.pow(quarterPosition, 1.45) * 118);
        const sample = (bin) => {
          if (!playing || !frequencyData?.length) return 0;
          const upper = frequencyData.length - 1;
          const center = Math.max(0, Math.min(upper, bin));
          let total = 0;
          let count = 0;
          for (let offset = -2; offset <= 2; offset++) {
            const idx = center + offset;
            if (idx >= 0 && idx <= upper) {
              total += frequencyData[idx];
              count++;
            }
          }
          return count ? (total / count) / 255 : 0;
        };
        const primary = sample(primaryBin);
        const secondary = sample(secondaryBin);
        const tertiary = sample(tertiaryBin);
        // Let individual frequency peaks determine bar heights. A small shared
        // floor keeps all sides visible without washing out stronger passages.
        const localEnergy = primary * 0.78 + secondary * 0.16 + tertiary * 0.06;
        const contrast = Math.max(0, localEnergy - (lowEnergy * 0.17 + midEnergy * 0.09));
        liveTarget = Math.min(0.92, playbackFloor + Math.pow(contrast, 1.25) * 0.86);
      } else {
        // ECHO follows the original independent frequency distribution.
        let bin = Math.floor(2 + Math.pow(fraction, 1.65) * 205);
        bin = Math.min((frequencyData?.length || 512) - 1, bin);
        const amplitude = playing ? frequencyData[bin] / 255 : 0;
        liveTarget = Math.pow(amplitude, 1.15);
      }
      // Symmetric synthetic ending pattern, with subtle evolving micro-movement.
      const quadrantPosition = i % (levels.length / 2);
      const mirroredPosition = Math.min(quadrantPosition, levels.length / 2 - quadrantPosition);
      const phase = mirroredPosition / (levels.length / 4);
      const pattern = 0.31 + 0.51 * Math.abs(Math.sin(phase * 9.3 + 0.7) * Math.cos(phase * 4.1 + 0.2));
      const synthetic = openingStrength * pattern * (0.96 + 0.04 * Math.sin(performance.now() / 145 + phase * 12));
      const target = playing ? liveTarget : synthetic;
      levels[i] += (target - levels[i]) * (target > levels[i] ? 0.35 : 0.18);
      if (levels[i] < 0.0015) levels[i] = 0;
      const level = levels[i];
      if (level > 0) stillMoving = true;
      if (!level) continue;
      const start = radius + size * (drawMode === 'halo' ? 0.010 : 0.013);
      const barLength = (drawMode === 'halo' ? maxLength : size * 0.125) * level;
      const hue = drawMode === 'halo' ? 194 + 17 * Math.sin(angle + 0.6) : 194;
      const lightness = drawMode === 'halo' ? 48 + level * 15 : 34 + level * 22;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * start, cy + Math.sin(angle) * start);
      ctx.lineTo(cx + Math.cos(angle) * (start + barLength), cy + Math.sin(angle) * (start + barLength));
      ctx.strokeStyle = `hsl(${hue} 100% ${lightness}%)`;
      ctx.lineWidth = Math.max(1.4, size * (drawMode === 'halo' ? 0.010 : 0.008));
      ctx.lineCap = drawMode === 'halo' ? 'butt' : 'round';
      ctx.shadowColor = 'rgba(0,174,222,0.36)';
      ctx.shadowBlur = level > 0.4 ? 4 : 0;
      ctx.stroke();
    }
    // Match the Play button's subtle cyan-tinted recessed fill in both modes.
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0, 174, 222, 0.13)';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    // Both modes retain the clean center and static cyan boundary.
    ctx.shadowBlur = Math.max(2, size * 0.014);
    ctx.shadowColor = 'rgba(0,174,222,0.42)';
    ctx.strokeStyle = '#00AEDE';
    ctx.lineWidth = Math.max(1, size * 0.008);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    return stillMoving;
  }

  function draw() {
    if (destroyed) return;
    frame = 0;
    const playing = player.isPlaying() && analyser && audioContext?.state === 'running';
    if (playing) {
      openingEnabled = false;
      analyser.getByteFrequencyData(frequencyData);
    }
    const openingProgress = Math.min(1, (performance.now() - openingStart) / openingDuration);
    const opening = openingEnabled && openingProgress < 1 && !playing;
    const openingStrength = opening ? Math.pow(1 - openingProgress, 1.7) : 0;
    if (!opening && openingProgress >= 1) openingEnabled = false;
    const desktopMoving = drawOne(canvas, ctx, mode, width, height, playing, opening, openingStrength);
    const fluxBounds = mobileFlux?.getBoundingClientRect();
    const echoBounds = mobileEcho?.getBoundingClientRect();
    // Render ECHO once on the right. Copy its exact pixels to the left;
    // the left canvas is flipped horizontally in mobile CSS for a true mirror.
    const echoMoving = drawOne(mobileEcho, mobileEchoCtx, 'echo', echoBounds?.width, echoBounds?.height, playing, opening, openingStrength);
    if (mobileFlux && mobileFluxCtx && mobileEcho && fluxBounds?.width && fluxBounds?.height) {
      mobileFluxCtx.clearRect(0, 0, fluxBounds.width, fluxBounds.height);
      mobileFluxCtx.drawImage(mobileEcho, 0, 0, fluxBounds.width, fluxBounds.height);
    }
    if (playing || opening || desktopMoving || echoMoving) frame = requestAnimationFrame(draw);
  }

  function ensureFrame() { if (!frame) frame = requestAnimationFrame(draw); }
  function changeMode(nextMode) {
    if (nextMode !== 'halo' && nextMode !== 'echo') return;
    mode = nextMode;
    modeButtons.forEach(button => {
      const active = button.dataset.waveVisualizerMode === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    ensureFrame();
  }
  modeButtons.forEach(button => button.addEventListener('click', () => changeMode(button.dataset.waveVisualizerMode)));
  document.querySelector('#wave-play')?.addEventListener('pointerdown', connectAudio, { passive: true });
  document.querySelector('#wave-previous')?.addEventListener('pointerdown', connectAudio, { passive: true });
  document.querySelector('#wave-next')?.addEventListener('pointerdown', connectAudio, { passive: true });
  document.querySelector('#wave-track-list')?.addEventListener('pointerdown', event => {
    if (event.target.closest('.wave-track-select')) connectAudio();
  }, { passive: true });
  document.querySelector('#waveform')?.addEventListener('pointerdown', connectAudio, { passive: true });
  player.on('play', () => { openingEnabled = false; ensureFrame(); });
  player.on('pause', ensureFrame);
  player.on('finish', ensureFrame);
  player.on('destroy', () => {
    destroyed = true;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (audioContext) audioContext.close().catch(() => {});
  });
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement);
    if (mobileFlux) observer.observe(mobileFlux.parentElement);
    if (mobileEcho) observer.observe(mobileEcho.parentElement);
    player.on('destroy', () => observer.disconnect());
  } else window.addEventListener('resize', resize, { passive: true });
  resize();
  ensureFrame();
}

try {
// 1. Match the gradient to WaveSurfer's high-DPI canvas coordinates.
const createResponsiveGradient = (color, opacityStart, opacityEnd) => {
  const container = document.querySelector('#waveform');
  // Read the visible waveform height, including the mobile CSS override.
  const currentHeight = container ? container.clientHeight : 94;
  // WaveSurfer draws in device pixels; account for mobile/desktop DPI and zoom.
  const canvasHeight = currentHeight * (window.devicePixelRatio || 1);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);

  gradient.addColorStop(0, color);
  gradient.addColorStop(0.49, color);
  gradient.addColorStop(0.50, 'transparent');
  gradient.addColorStop(0.51, opacityStart);
  gradient.addColorStop(1, opacityEnd);

  return gradient;
};

// 2. Generate the responsive gradients on load
const unplayedGradient = createResponsiveGradient('#36586B', 'rgba(54, 88, 107, 0.70)', 'rgba(54, 88, 107, 0.25)');
const playedGradient = createResponsiveGradient('#00AEDE', 'rgba(0, 174, 222, 0.70)', 'rgba(0, 174, 222, 0.25)');

// 3. Initialize WaveSurfer exactly like before
surfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: unplayedGradient,      
  progressColor: playedGradient,  
  cursorColor: '#00AEDE',
  height: 94, // Your CSS controls the responsive mobile shrinking
  barWidth: 2,
  barGap: 1,
  barRadius: 0, 
  normalize: true,
  interact: true,
  dragToSeek: true,
});

// 4. Recalculate gradients automatically if the user flips their phone orientation
window.addEventListener('resize', () => {
  if (surfer) {
    const nextUnplayed = createResponsiveGradient('#36586B', 'rgba(54, 88, 107, 0.70)', 'rgba(54, 88, 107, 0.25)');
    const nextPlayed = createResponsiveGradient('#00AEDE', 'rgba(0, 174, 222, 0.70)', 'rgba(0, 174, 222, 0.25)');
    surfer.setOptions({
      waveColor: nextUnplayed,
      progressColor: nextPlayed
    });
  }
});

  // The visualizer shares this WaveSurfer media element and never loads its own MP3.
  installWaveVisualizer(surfer);
  surfer.setVolume(0.75);
  surfer.on('ready', () => {
    if (audioLoadFailed) return;
    // Keep the first placeholder visible until its opening decay reaches the line.
    if (placeholderDecayFrame) {
      const readyIndex = selectedIndex;
      const remaining = Math.max(0, 2500 - (performance.now() - placeholderDecayStarted));
      setTimeout(() => {
        if (selectedIndex === readyIndex) els.placeholder.classList.add('is-hidden');
      }, remaining);
    } else {
      els.placeholder.classList.add('is-hidden');
    }
    els.mode.textContent = 'WAVEFORM';
    const duration = surfer.getDuration();
    if (Number.isFinite(duration) && duration > 0) TRACKS[selectedIndex].duration = duration;
    els.duration.textContent = timeString(duration);
    setMessage('');
    if (pendingAutoplay) {
      pendingAutoplay = false;

      surfer.play().catch(() => setMessage('Press Play to start audio.'));
    }
    renderLibrary();
  });
  surfer.on('error', error => {
    audioLoadFailed = true;
    els.placeholder.classList.remove('is-hidden');
    els.mode.textContent = 'UNAVAILABLE';
    setMessage(`Audio unavailable. Check the MP3 URL and BunnyCDN CORS settings. ${error?.message || ''}`);
  });
  surfer.on('timeupdate', seconds => { els.current.textContent = timeString(seconds); });
  surfer.on('play', () => { updatePlayIcon(true); renderLibrary(); });
  surfer.on('pause', () => { updatePlayIcon(false); renderLibrary(); });
  surfer.on('finish', () => { const next = adjacentTrackIndex(1); selectTrack(next, Boolean(TRACKS[next].url)); });
  // A user click on the waveform seeks. If paused, it can begin playback, matching the chosen example.
  surfer.on('interaction', () => { if (TRACKS[selectedIndex].url && !surfer.isPlaying()) surfer.play().catch(() => {}); });
  els.play.addEventListener('click', () => {
    if (!TRACKS[selectedIndex].url) { setMessage('Add a BunnyCDN MP3 link to this track in js/wave.js first.'); return; }
    if (surfer.getDuration() > 0) surfer.playPause();
    else selectTrack(selectedIndex, true);
  });
  els.previous.addEventListener('click', () => { const previous = adjacentTrackIndex(-1); selectTrack(previous, Boolean(TRACKS[previous].url)); });
  els.next.addEventListener('click', () => { const next = adjacentTrackIndex(1); selectTrack(next, Boolean(TRACKS[next].url)); });
  // Keep the five visible volume bars synced with the native 0-100 slider.
  const volumeBars = [...document.querySelectorAll('.wave-volume-bars i')];
  function updateVolumeBars(value) {
    const activeCount = Math.ceil(Math.max(0, Math.min(100, value)) / 20);
    volumeBars.forEach((bar, index) => bar.classList.toggle('is-active', index < activeCount));
  }
  updateVolumeBars(Number(els.volume.value));
  els.volume.addEventListener('input', () => {
    const value = Number(els.volume.value) / 100;
    surfer.setVolume(value);
    updateVolumeBars(Number(els.volume.value));
    if (value > 0) lastNonzeroVolume = value;
    els.mute.setAttribute('aria-label', value === 0 ? 'Unmute' : 'Mute');
  });
  els.mute.addEventListener('click', () => {
    const next = surfer.getVolume() > 0 ? 0 : lastNonzeroVolume;
    surfer.setVolume(next); els.volume.value = String(Math.round(next * 100));
    updateVolumeBars(Number(els.volume.value));
    els.mute.setAttribute('aria-label', next === 0 ? 'Unmute' : 'Mute');
  });
  els.filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    activeFilter = activeFilter === button.dataset.filter ? 'all' : button.dataset.filter;
    els.filters.querySelectorAll('[data-filter]').forEach(item => {
      const active = item.dataset.filter === activeFilter; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
    });
    renderLibrary();
  });
  // Main-player heart uses exactly the same Supabase operation as playlist hearts.
  document.querySelector('#wave-feature-like')?.addEventListener('click', () => {
    toggleTrackLike(TRACK_IDS[selectedIndex]);
  });
  // Show the collection immediately, even if loading the featured track fails.
  renderLibrary();
  selectTrack(selectedIndex);
  loadLibraryDurations();
  refreshLikes();
} catch (error) {
  populatePlaceholder(0);
  els.trackList.textContent = 'Audio player failed to initialize. Verify the WaveSurfer.js CDN is accessible.';
  setMessage(`Could not initialize audio. ${error?.message || ''}`);
}
