/**
 * Prisma singleton setup for Next.js / Node.js environments
 *
 * WHY THIS FILE EXISTS
 * ------------------------------------------------------------------
 * PrismaClient is the generated ORM client that talks to your actual
 * PostgreSQL database (Neon in this project).
 *
 * Architecture:
 *
 *   Application code
 *         ↓
 *   Prisma Client (this file exports it)
 *         ↓
 *   Prisma query engine
 *         ↓
 *   Postgres connection pool
 *         ↓
 *   Neon PostgreSQL database
 *
 * Prisma itself is NOT the database.
 * Prisma is the type-safe client / ORM layer.
 *
 * Example:
 *
 *   await prisma.user.findUnique({
 *     where: { email: "test@example.com" }
 *   });
 *
 * Prisma translates that into SQL roughly like:
 *
 *   SELECT * FROM "User"
 *   WHERE email='test@example.com'
 *   LIMIT 1;
 *
 * and sends that query to PostgreSQL.
 */

import { PrismaClient } from "@/generated/prisma/client";

/**
 * NODE GLOBAL OBJECT
 * ------------------------------------------------------------------
 * In Node.js, `global` is similar to `window` in the browser.
 *
 * Browser:
 *   window.localStorage
 *   window.fetch
 *
 * Node:
 *   global.process
 *   global.setTimeout
 *
 * The important part:
 *
 * `global` persists for the lifetime of the current Node process.
 *
 * That means if we attach:
 *
 *   global.prisma = someInstance
 *
 * then future module reloads in the SAME process can reuse it.
 */

/**
 * TYPESCRIPT ISSUE
 * ------------------------------------------------------------------
 * TypeScript does NOT know that `global.prisma` exists.
 *
 * If we try:
 *
 *   global.prisma = prisma
 *
 * TS errors:
 *
 *   Property 'prisma' does not exist on type 'typeof globalThis'
 *
 * So we explicitly tell TypeScript:
 *
 * "Treat global as an object that can contain prisma."
 *
 * Why `unknown`?
 *
 * Direct casting:
 *
 *   global as { prisma: PrismaClient }
 *
 * can complain depending on TS strictness.
 *
 * So we do:
 *
 *   global → unknown → desired type
 *
 * which is the standard escape hatch.
 */
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * PRISMA SINGLETON LOGIC
 * ------------------------------------------------------------------
 * This is the critical line.
 *
 * Logic:
 *
 * If a Prisma instance already exists globally:
 *   reuse it
 *
 * Otherwise:
 *   create a new Prisma client
 *
 * Equivalent logic:
 *
 *   if (global.prisma exists)
 *     use existing instance
 *   else
 *     create new PrismaClient()
 *
 * WHY THIS MATTERS:
 *
 * In Next.js development mode:
 *
 *   npm run dev
 *
 * the dev server hot reloads modules constantly.
 *
 * Every file save can re-import this module.
 *
 * If we did ONLY:
 *
 *   const prisma = new PrismaClient();
 *
 * then every reload creates another client.
 *
 * That means:
 *
 * save file
 *   → new Prisma client
 *
 * save file again
 *   → another Prisma client
 *
 * save repeatedly
 *   → dozens of DB connections
 *
 * Eventually PostgreSQL says:
 *
 *   too many connections
 *
 * or
 *
 *   connection pool exhausted
 *
 * This singleton pattern prevents that.
 */
const prisma = globalForPrisma.prisma ?? new PrismaClient();

/**
 * DEVELOPMENT VS PRODUCTION
 * ------------------------------------------------------------------
 * In development:
 *
 * Next.js hot reload causes repeated module execution.
 *
 * So we cache Prisma globally:
 *
 *   global.prisma = prisma
 *
 * Future reloads reuse it.
 *
 * Timeline:
 *
 * First import:
 *
 *   global.prisma = undefined
 *   → create PrismaClient
 *   → store globally
 *
 * Hot reload:
 *
 *   global.prisma exists
 *   → reuse existing client
 *
 *
 * In production:
 *
 * Hot reload is NOT the issue.
 *
 * Also, in serverless environments (like Vercel),
 * runtime instances can be ephemeral.
 *
 * Global state persistence is less meaningful there.
 *
 * So in production we avoid mutating global unnecessarily.
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * EXPORT
 * ------------------------------------------------------------------
 * Export one shared Prisma client for the whole app.
 *
 * Usage:
 *
 *   import prisma from "@/lib/db";
 *
 *   await prisma.user.findMany();
 *   await prisma.workflow.create(...);
 *   await prisma.workflowRun.findMany(...);
 *
 * Result:
 *
 * Development:
 *   one shared Prisma client reused across hot reloads
 *
 * Production:
 *   one Prisma client per runtime process
 */
export default prisma;
