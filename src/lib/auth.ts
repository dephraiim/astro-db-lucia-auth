import { Lucia } from "lucia";
import type { DatabaseUser } from "./db";
import { createLocalDatabaseClient } from "@astrojs/db/runtime";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzleSession, drizzleUser } from "../../db/config";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// export const libsqlClient = createClient({
//     url: "sqlite://auth.db",
// });

// export const db = drizzle(libsqlClient);

const db = createLocalDatabaseClient({ dbUrl: "file:auth.db" });

// const userTable = sqliteTable("user", {
//     id: text("id").notNull().primaryKey(),
// });

// const sessionTable = sqliteTable("session", {
//     id: text("id").notNull().primaryKey(),
//     userId: text("user_id")
//         .notNull()
//         .references(() => userTable.id),
//     expiresAt: integer("expires_at").notNull(),
// });

// typescript :)
const adapter = new DrizzleSQLiteAdapter(db as any, drizzleSession as any, drizzleUser as any);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: import.meta.env.PROD,
        },
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: Omit<DatabaseUser, "id">;
    }
}
