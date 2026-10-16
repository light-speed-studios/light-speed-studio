/**
 * WAVE | Light Speed Studios
 * WaveSurfer.js v7, SoundCloud-style bars.
 * Add BunnyCDN MP3 links to TRACKS below. Empty URLs are intentional placeholders.
 * IMPORTANT: Bunny CDN must permit cross-origin GET (CORS) for the audio assets.
 */
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const TRACKS = [
  {"title": "Under the Sea", "source": "Kingdom of Atlantis / Aquaman OST", "category": "cinematic", "type": "featured", "description": "A remix of Kingdom of Atlantis from the Aquaman soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Atlantis.mp3"},
  {"title": "NightFall", "source": "Fiction / The XX", "category": "ambient", "type": "featured", "description": "A remix of Fiction / The XX.", "url": "https://light-speed-studios.b-cdn.net/Bring%20on%20the%20Night.mp3"},
  {"title": "Catch You", "source": "Into the Dark / Ferry Corsten", "category": "electronic", "type": "featured", "description": "A remix of Into the Dark / Ferry Corsten.", "url": "https://light-speed-studios.b-cdn.net/Catch%20You.mp3"},
  {"title": "Into the Fight", "source": "No Man’s Land / Wonder Woman OST", "category": "cinematic", "type": "featured", "description": "A remix of No Man’s Land from the Wonder Woman soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Charge.mp3"},
  {"title": "Fearless", "source": "Lanterns OST / Extended Remix", "category": "cinematic", "type": "featured", "description": "An extended remix inspired / the Lanterns soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Fearlesss.mp3"},
  {"title": "Luna", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/Luna.mp3"},
  {"title": "Delimma", "source": "Sucre’s Dilemma / Maricruz / Prison Break OST", "category": "cinematic", "type": "featured", "description": "A remix combining Sucre’s Dilemma and Maricruz from Prison Break.", "url": "https://light-speed-studios.b-cdn.net/Maricruz.mp3"},
  {"title": "Waiting", "source": "Miracle / Beachwood", "category": "ambient", "type": "featured", "description": "A remix of Miracle / Beachwood.", "url": "https://light-speed-studios.b-cdn.net/MIRACLE.mp3"},
  {"title": "Outer Range", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/Range.mp3"},
  {"title": "Signal to the Stars", "source": "Deus Ex Machina / If These Trees Could Talk", "category": "cinematic", "type": "featured", "description": "A remix of Deus Ex Machina / If These Trees Could Talk.", "url": "https://light-speed-studios.b-cdn.net/Signal%20to%20the%20Stars.mp3"},
  {"title": "Sky Fall", "source": "Go Beyond / Matthew Hales & Benjamin Hales", "category": "cinematic", "type": "featured", "description": "A remix of Go Beyond / Matthew Hales and Benjamin Hales.", "url": "https://light-speed-studios.b-cdn.net/Sky%20Fall.mp3"},
  {"title": "SpeedForce", "source": "At the Speed of Force / Zack Snyder’s Justice League OST", "category": "cinematic", "type": "featured", "description": "A remix of At the Speed of Force from Zack Snyder’s Justice League.", "url": "https://light-speed-studios.b-cdn.net/speed.mp3"},
  {"title": "Stay", "source": "Don’t Let Me Down (Intro) / The Chainsmokers", "category": "electronic", "type": "featured", "description": "A remix of the intro to Don’t Let Me Down / The Chainsmokers.", "url": "https://light-speed-studios.b-cdn.net/stayy.mp3"},
  {"title": "Strike", "source": "Original Track / Digital Salvation", "category": "electronic", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/STRIKE.mp3"},
  {"title": "The Brain in the Machine", "source": "Doom Patrol Intro", "category": "cinematic", "type": "featured", "description": "A remix of the Doom Patrol intro.", "url": "https://light-speed-studios.b-cdn.net/The%20Brain%20in%20the%20Machine.mp3"},
  {"title": "The Edge", "source": "End of the World / Ivan Shpilevsky", "category": "cinematic", "type": "featured", "description": "A remix of End of the World / Ivan Shpilevsky.", "url": "https://light-speed-studios.b-cdn.net/The%20Edge.mp3"},
  {"title": "The Last Fall", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/The%20Last%20Fall.mp3"},
  {"title": "Void", "source": "The Expanse Intro", "category": "ambient", "type": "featured", "description": "A remix of the intro to The Expanse.", "url": "https://light-speed-studios.b-cdn.net/Void.mp3"},
  {"title": "Wide Awake", "source": "Wake Up / Slingshot OST", "category": "cinematic", "type": "featured", "description": "A remix of Wake Up from the Slingshot soundtrack.", "url": "https://light-speed-studios.b-cdn.net/Wokeup.mp3"},
  {"title": "Call from the Deep", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/Syrens%20Call.mp3"},
  {"title": "Dust & Daylight", "source": "Original Track / Digital Salvation", "category": "ambient", "type": "original", "description": "An original instrumental composition.", "url": "https://light-speed-studios.b-cdn.net/LeftIntheDust.mp3"},
  {"title": "Caught in the Undertow", "source": "He's a Pirate (Remix) / DJ Tiesto", "category": "cinematic", "type": "featured", "description": "A remix of DJ Tiesto's remix of He's a Pirate from Pirates of the Caribbean.", "url": "https://light-speed-studios.b-cdn.net/Into%20the%20Ocean.mp3"},
];

// WAVE likes use only the public, browser-safe Supabase key.
const supabase = createClient(
  'https://yvzplqilaxuqwdrhsgrl.supabase.co',
  'sb_publishable_d1LXYWzfZHwmWYb_hj5Ztw_GtpIRQ4h',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }
);

// IDs remain stable even when MP3 filenames or track titles change.
const TRACK_IDS = [
  'under-the-sea', 'nightfall', 'catch-you', 'into-the-fight', 'fearless',
  'luna', 'delimma', 'waiting', 'outer-range', 'signal-to-the-stars',
  'sky-fall', 'speedforce', 'stay', 'strike', 'the-brain-in-the-machine',
  'the-edge', 'the-last-fall', 'void', 'wide-awake',
  'call-from-the-deep', 'dust-and-daylight', 'caught-in-the-undertow'
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
  });
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
  els.count.textContent = `/ ${String(filtered.length).padStart(2, '0')}`;
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


// Radial bar visualizer adapted from David Lazic's "lounge" canvas concept.
// Uses the same WaveSurfer media element and playback controls.
// No separate player, background panel, or duplicate audio request.
function installWaveVisualizer(player) {
  const canvas = document.querySelector('#wave-live-visualizer');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const media = player.getMediaElement();
  // Must be set before WaveSurfer starts fetching CDN audio.
  media.crossOrigin = 'anonymous';
  let audioContext = null;
  let analyser = null;
  let frequencyData = null;
  let animationId = 0;
  let width = 240;
  let height = 240;
  let smoothed = new Float32Array(88);
  let failed = false;

  function connectAudio() {
    if (failed || !AudioContextClass) return;
    try {
      if (!audioContext) {
        audioContext = new AudioContextClass();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.72;
        analyser.minDecibels = -95;
        analyser.maxDecibels = -28;
        const source = audioContext.createMediaElementSource(media);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
      }
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    } catch (error) {
      failed = true;
      console.warn('WAVE radial visualizer could not initialize:', error);
    }
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!animationId) draw();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = size * 0.35; // Larger ring within the same fixed-size canvas
    const maxLength = size * 0.125;
    const active = player.isPlaying() && analyser && audioContext?.state === 'running';
    if (active) analyser.getByteFrequencyData(frequencyData);

    // A ring of independent frequency bars, not a continuous circular line.
    // Quiet bars remain visible on #040E15; peaks move through brighter cyans.
    const count = smoothed.length;
    for (let i = 0; i < count; i++) {
      // The lower/mid spectrum is most musical; map progressively upward.
      const fraction = i / count;
      const frequencyIndex = Math.min(255, Math.floor(2 + Math.pow(fraction, 1.65) * 205));
      const amplitude = active ? frequencyData[frequencyIndex] / 255 : 0;
      const target = Math.pow(amplitude, 1.15);
      smoothed[i] += (target - smoothed[i]) * (target > smoothed[i] ? 0.35 : 0.14);
      const level = smoothed[i];
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const barLength = size * 0.012 + level * maxLength;
      const inner = radius - barLength * 0.20;
      const outer = radius + barLength * 0.80;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cx + cos * inner, cy + sin * inner);
      ctx.lineTo(cx + cos * outer, cy + sin * outer);
      ctx.lineWidth = Math.max(1.2, size * 0.008);
      ctx.lineCap = 'round';
      if (level > 0.68) ctx.strokeStyle = '#00AEDE';
      else if (level > 0.40) ctx.strokeStyle = '#008FB9';
      else if (level > 0.18) ctx.strokeStyle = '#00779B';
      else if (level > 0.055) ctx.strokeStyle = '#286C86';
      else ctx.strokeStyle = '#376A80';
      ctx.shadowBlur = level > 0.35 ? 7 + level * 8 : 0;
      ctx.shadowColor = 'rgba(0,174,222,.55)';
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    if (player.isPlaying()) animationId = window.requestAnimationFrame(draw);
    else animationId = 0;
  }

  function start() {
    connectAudio();
    if (!animationId) animationId = window.requestAnimationFrame(draw);
  }
  function stop() {
    if (animationId) window.cancelAnimationFrame(animationId);
    animationId = 0;
    draw();
  }

  // Resume Web Audio from an actual user gesture, preserving existing controls.
  document.querySelector('#wave-play')?.addEventListener('pointerdown', connectAudio, { passive: true });
  document.querySelector('#wave-previous')?.addEventListener('pointerdown', connectAudio, { passive: true });
  document.querySelector('#wave-next')?.addEventListener('pointerdown', connectAudio, { passive: true });
  document.querySelector('#wave-track-list')?.addEventListener('pointerdown', event => {
    if (event.target.closest('.wave-track-select')) connectAudio();
  }, { passive: true });
  document.querySelector('#waveform')?.addEventListener('pointerdown', connectAudio, { passive: true });
  player.on('play', start);
  player.on('pause', stop);
  player.on('finish', stop);
  player.on('destroy', () => {
    stop();
    if (audioContext) audioContext.close().catch(() => {});
  });
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas.parentElement);
  else window.addEventListener('resize', resize, { passive: true });
  resize();
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
    els.placeholder.classList.add('is-hidden');
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
