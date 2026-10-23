/** LSS Bridge hero ratings: read-only summaries from the same RPC as movie-ratings.js. */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const db = createClient(
  'https://yvzplqilaxuqwdrhsgrl.supabase.co',
  'sb_publishable_d1LXYWzfZHwmWYb_hj5Ztw_GtpIRQ4h',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }
);
const badges = [...document.querySelectorAll('.lss-hero-rating[data-movie-id]')];
const movieIds = [...new Set(badges.map(el => el.dataset.movieId))];
let inFlight = false;

async function refreshHeroRatings() {
  if (!badges.length || inFlight) return;
  inFlight = true;
  try {
    await Promise.all(movieIds.map(async movieId => {
      try {
        const { data, error } = await db.rpc('movie_rating_summary', { p_movie_id: movieId });
        if (error) throw error;
        const summary = Array.isArray(data) ? data[0] : data;
        const count = Number(summary?.rating_count ?? 0);
        const avg = count ? Number(summary?.average_rating) : null;
        badges.filter(badge => badge.dataset.movieId === movieId).forEach(badge => {
          badge.querySelector('.lss-hero-rating-average').textContent = avg !== null && Number.isFinite(avg) ? avg.toFixed(1) : '—';
          badge.querySelector('.lss-hero-rating-count').textContent = count ? `(${count})` : 'NO RATINGS';
          badge.setAttribute('aria-label', count ? `Audience rating ${avg.toFixed(1)} out of 10 from ${count} ratings` : 'No audience ratings yet');
        });
      } catch (error) {
        console.warn(`Could not load hero rating for ${movieId}:`, error);
        badges.filter(badge => badge.dataset.movieId === movieId).forEach(badge => {
          badge.querySelector('.lss-hero-rating-count').textContent = 'UNAVAILABLE';
        });
      }
    }));
  } finally { inFlight = false; }
}

refreshHeroRatings();
// Fresh totals on revisit to the tab, and periodically while the Bridge is open.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refreshHeroRatings();
});
window.addEventListener('pageshow', event => {
  if (event.persisted) refreshHeroRatings();
});
window.setInterval(() => { if (!document.hidden) refreshHeroRatings(); }, 60000);
