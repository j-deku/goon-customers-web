// src/utils/loadAssets.js

async function preload(urls) {
  const promises = urls.map((url) =>
    new Promise((resolve) => {
      const isMedia = /\.(mp3|mp4|wav|ogg|json|web|webp|png|jpeg|gif|ico||svg)$/i.test(url);
      if (isMedia) {
        const audio = new Audio();
        audio.oncanplaythrough = resolve;
        audio.onerror = resolve;
        audio.src = url;
      } else {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = url;
      }
    })
  );
  await Promise.all(promises);
}

export async function loadBundledAssets() {
  let urls = [];

  if (import.meta.env.PROD) {
    try {
      const manifest = await fetch('/manifest.json').then((r) => r.json());
      urls = Object.values(manifest)
        .flatMap((entry) => [entry.file, ...(entry.css || []), ...(entry.assets || [])])
        .filter((u) => /\.(png|jpe?g|svg|webp|gif|ico|mp3|mp4|json|web|webp|wav)$/i.test(u))
        .map((u) => (u.startsWith('/') ? u : `/${u}`));
    } catch (e) {
      console.warn('Failed to load manifest.json, falling back to glob eager', e);
    }
  }

  if (!urls.length) {
    // import all assets eagerly during dev
    const modules = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg,webp,gif,ico,mp3,mp4}', { eager: true });
    urls = Object.values(modules).map((mod) => mod.default);
  }

  await preload(urls);
      console.log("Assets asstes loaded");
}

/**
 * Load public assets (from public/).
 * Automatically glob all files under public via Vite.
 */
export async function loadPublicAssets() {
  // Glob all public assets eagerly
  const modules = import.meta.glob('/*.{png,jpg,jpeg,svg,webp,gif,ico,mp3,mp4}', { eager: true });
  const urls = Object.values(modules).map((mod) => mod.default);

  if (sessionStorage.getItem('publicAssetsLoaded')) return;
    console.log("Public asstes loaded");
  await preload(urls);
  sessionStorage.setItem('publicAssetsLoaded', 'true');
}

/**
 * Load all assets: bundled + public.
 */
export async function loadAllAssets() {
  await loadBundledAssets();
  await loadPublicAssets();
  console.log('✅ All assets preloaded');
}
