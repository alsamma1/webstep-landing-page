export default function sitemap() {
  const routes = ['/'];

  return routes.map((route) => ({
    url: new URL(route, 'https://wepste.com').toString(),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
