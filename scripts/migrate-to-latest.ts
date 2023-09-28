import * as path from 'path'
import SQLite from 'better-sqlite3'
import { promises as fs } from 'fs'
import {
    Kysely,
    Migrator,
    SqliteDialect,
    FileMigrationProvider,
} from 'kysely'
import { type DB } from '@/db/types'
const PATH = path.join(process.cwd(), 'db.sqlite3')
console.log({ PATH })

async function migrateToLatest() {
    const db = new Kysely<DB>({
        dialect: new SqliteDialect({
            database: new SQLite(`${PATH}`),
        }),
    })

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: path.join(__dirname, '../migrations'),
        }),
    })

    const { error, results } = await migrator.migrateToLatest()

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        console.error('failed to migrate')
        console.error(error)
        process.exit(1)
    }

    await db.destroy()
}

void migrateToLatest().catch(console.error).then(console.info)