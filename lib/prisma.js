import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

if (!globalThis.__dbConnectionLogged) {
  globalThis.__dbConnectionLogged = true;

  db.$connect()
    .then(() => {
      console.log("[DB] Prisma connected successfully");
    })
    .catch((error) => {
      console.error("[DB] Prisma connection failed:", error);
    });
}

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.
