import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Prerender root invitation page for instant First Contentful Paint
  { path: '', renderMode: RenderMode.Prerender },

  // Fallback for any other dynamic routes
  { path: '**', renderMode: RenderMode.Server }
];
