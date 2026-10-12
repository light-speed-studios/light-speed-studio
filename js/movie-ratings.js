/** LSS movie audience rating: Supabase anonymous authentication. */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://yvzplqilaxuqwdrhsgrl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_d1LXYWzfZHwmWYb_hj5Ztw_GtpIRQ4h';
const root = document.getElementById('ffs-audience-rating');

if (root) {
  const movieId = root.dataset.movieId;
  const average = root.querySelector('#ffs-rating-average');
  const count = root.querySelector('#ffs-rating-count');
  const feedback = root.querySelector('#ffs-rating-feedback');
  const stars = [...root.querySelectorAll('.ffs-rate-star')];
  const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  let visitorId = null;
  let currentRating = 0;
  let saving = false;
  const updateStars = (value) => {
    stars.forEach((star, i) => {
      const selected = i < value;
      star.classList.toggle('is-active', selected);
      star.setAttribute('aria-pressed', String(i + 1 === currentRating));
    });
  };
  const showOwnRating = () => {
    feedback.textContent = currentRating ? `YOUR RATING: ${currentRating} / 10 · CHANGE ANYTIME` : 'SELECT YOUR RATING';
    updateStars(currentRating);
  };
  async function loadTotals() {
    const { data, error } = await db.rpc('movie_rating_summary', { p_movie_id: movieId });
    if (error) throw error;
    const summary = Array.isArray(data) ? data[0] : data;
    const n = Number(summary?.rating_count ?? 0);
    count.textContent = n === 0 ? 'NO RATINGS YET' : `${n} ${n === 1 ? 'RATING' : 'RATINGS'}`;
    average.textContent = n ? Number(summary?.average_rating).toFixed(1) : 'NOT YET RATED';
    average.classList.toggle('is-unrated', n === 0);
    const denominator = root.querySelector('#ffs-rating-denominator');
    if (denominator) denominator.hidden = n === 0;
  }
  async function ensureVisitor() {
    const { data: { session }, error } = await db.auth.getSession();
    if (error) throw error;
    if (session?.user) return session.user.id;
    const result = await db.auth.signInAnonymously();
    if (result.error) throw result.error;
    return result.data.user.id;
  }
  async function loadOwnRating() {
    const { data, error } = await db.from('movie_ratings')
      .select('rating').eq('movie_id', movieId).eq('user_id', visitorId).maybeSingle();
    if (error) throw error;
    currentRating = data?.rating ?? 0;
    showOwnRating();
  }
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => { if (!saving) updateStars(Number(star.dataset.rating)); });
    star.addEventListener('focus', () => { if (!saving) updateStars(Number(star.dataset.rating)); });
    star.addEventListener('click', async () => {
      if (saving) return;
      saving = true;
      stars.forEach(button => { button.disabled = true; });
      const chosen = Number(star.dataset.rating);
      feedback.textContent = 'SAVING RATING…';
      try {
        visitorId ||= await ensureVisitor();
        const { error } = await db.from('movie_ratings').upsert(
          { movie_id: movieId, user_id: visitorId, rating: chosen },
          { onConflict: 'movie_id,user_id' }
        );
        if (error) throw error;
        currentRating = chosen;
        showOwnRating();
        await loadTotals();
      } catch (error) {
        console.error('Movie rating could not be saved:', error);
        feedback.textContent = 'RATING UNAVAILABLE · TRY AGAIN';
      } finally {
        saving = false;
        stars.forEach(button => { button.disabled = false; });
      }
    });
  });
  root.querySelector('.ffs-rating-stars').addEventListener('mouseleave', () => { if (!saving) updateStars(currentRating); });
  root.querySelector('.ffs-rating-stars').addEventListener('focusout', event => { if (!root.querySelector('.ffs-rating-stars').contains(event.relatedTarget) && !saving) updateStars(currentRating); });
  (async () => {
    try { await loadTotals(); } catch (error) { console.error('Rating totals unavailable:', error); count.textContent = 'RATINGS UNAVAILABLE'; }
    try {
      visitorId = await ensureVisitor();
      await loadOwnRating();
    } catch (error) {
      console.error('Anonymous ratings unavailable:', error);
      feedback.textContent = 'SELECT A STAR TO TRY AGAIN';
    }
  })();
}
