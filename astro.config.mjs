import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  site: 'https://officesdk.com',
  output: 'static',
  integrations: [react()],
  server: { port: 4173 },
})
