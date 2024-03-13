import { column, defineDb, defineTable } from "astro:db";
import { asDrizzleTable } from "@astrojs/db/utils";

export const users = defineTable({
    columns: {
        id: column.text({ primaryKey: true }),
        username: column.text({ unique: true }),
        password: column.text(),
    },
});

export const sessions = defineTable({
    columns: {
        id: column.text({ primaryKey: true }),
        expiresAt: column.text(),
        userId: column.text({ references: () => users.columns.id }),
    },
});

export const drizzleUser = asDrizzleTable("user", {
    columns: users.columns,
    deprecated: false,
});

export const drizzleSession = asDrizzleTable("session", {
    columns: sessions.columns,
    deprecated: false,
});

export default defineDb({
    tables: {
        users,
        sessions,
    },
});
