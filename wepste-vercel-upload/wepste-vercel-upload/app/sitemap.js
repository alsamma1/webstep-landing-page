import { servicePages } from '../lib/service-pages';

export default function sitemap() {
  const routes = ['/', ...servicePages.map(({ slug }) => `/services/${slug}`)];

  return routes.map((route) => ({
    url: new URL(route, 'https://wepste.com').toString(),
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
