const OPTIMIZABLE_HOSTS = [
  'images.unsplash.com',
  'firebasestorage.googleapis.com',
  'img.youtube.com',
  'i.ytimg.com',
]

export function shouldSkipNextImageOptimization(source: string): boolean {
  try {
    const hostname = new URL(source).hostname
    return !OPTIMIZABLE_HOSTS.some(host => hostname === host)
      && !hostname.endsWith('.supabase.co')
      && !hostname.endsWith('.googleapis.com')
      && !hostname.endsWith('.firebasestorage.app')
  } catch {
    return true
  }
}
