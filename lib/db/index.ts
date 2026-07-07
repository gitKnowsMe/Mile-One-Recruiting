import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let cached: NeonHttpDatabase<typeof schema> | undefined

function getDb() {
  if (!cached) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set')
    }
    cached = drizzle(neon(process.env.DATABASE_URL), { schema })
  }
  return cached
}

// Lazy so importing this module (e.g. during `next build`'s page-data
// collection) doesn't require DATABASE_URL — only an actual query does.
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver)
  },
})
