
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/signup', '/profile'],
    },
    sitemap: 'https://www.snaptheplant.com/sitemap.xml',
  }
}
