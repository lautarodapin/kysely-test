
import { DB } from '@/db/types'
import { Kysely, Migrator, FileMigrationProvider, SqliteDialect } from 'kysely'
import { run } from 'kysely-migration-cli'
import * as path from 'path'
import SQLite from 'better-sqlite3'
import { promises as fs } from 'fs'

const PATH = path.join(process.cwd(), 'db.sqlite3')
console.log({ PATH })
const db = new Kysely<DB>({
    dialect: new SqliteDialect({
        // connectionString: process.env.DATABASE_URL,
        // connectionString: "file:./db.sqlite",
        database: new SQLite(PATH),
    }),
})

const migrator = new Migrator({
    db,
    // provider: new FileMigrationProvider('./migrations'),
    provider: new FileMigrationProvider({
        migrationFolder: path.join(__dirname, '../migrations'),
        fs,
        path,
    }),
})

run(db, migrator)
