import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

if (!globalThis.__dbConnectionLogged) {
  globalThis.__dbConnectionLogged = true;

  db.$connect()
    .then(async () => {
      console.log("[DB] Prisma connected successfully");

      const tables = await db.$queryRaw`
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename
      `;

      const migrations = await db.$queryRaw`
        SELECT migration_name, finished_at
        FROM "_prisma_migrations"
        WHERE finished_at IS NOT NULL
        ORDER BY finished_at DESC
      `;

      console.log(
        "[DB] Available tables:",
        tables.map((table) => table.tablename).join(", ")
      );

      if (migrations.length > 0) {
        console.log(
          `[DB] Migrations completed: ${migrations.length}. Latest migration: ${migrations[0].migration_name}`
        );
      } else {
        console.log("[DB] No completed Prisma migrations found");
      }
    })
    .catch((error) => {
      console.error("[DB] Prisma connection failed:", error);
    });
}

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.
