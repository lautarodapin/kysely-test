/* eslint-disable @typescript-eslint/no-explicit-any */
import { DB } from '@/db/types'
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<DB>): Promise<void> {
    await db.transaction().execute(async tx => {
        await tx.schema.createTable("Example")
            .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
            .addColumn('name', 'char', col => col.notNull())
            .addColumn('createdAt', 'datetime', col => col.defaultTo(sql`(DATETIME('now'))`).notNull())
            .execute()

        await tx.schema
            .createIndex('name')
            .on('Example')
            .column('name')
            .execute()
        console.log('inserting')
        await tx.insertInto("Example").values({
            name: "First example",
        })
            .execute()
    })
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("Example").execute()
}
