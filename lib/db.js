import pkg from "pg"
const { Pool } = pkg

const _pool = null

function createPool() {
  return new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5454,
    ssl: {
      rejectUnauthorized: false,
    },
  })
}

const pool = _pool ?? createPool()
if (process.env.NODE_ENV !== "production") global.__PG_POOL__ = pool

export default pool
