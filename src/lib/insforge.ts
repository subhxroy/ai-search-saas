import { createClient } from '@insforge/sdk'

export const insforge = createClient({
  baseUrl: process.env.INSFORGE_URL || 'https://x4dgwv4n.us-east.insforge.app',
  anonKey: process.env.INSFORGE_ANON_KEY || 'ik_18128c41ad74d924e69e4bd38adc37d5',
})
