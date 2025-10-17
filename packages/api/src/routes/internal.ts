import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const ADMIN_HEADER = "x-admin-token";

export default function internalRouter(prisma: PrismaClient) {
  const router = Router();

  router.get("/db-status", async (req, res) => {
    const token = req.header(ADMIN_HEADER);
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    try {
      const events = await prisma.event.count();
      const bookings = await prisma.booking.count();
      const mappoints = await prisma.mapPost.count();
      return res.json({ events, bookings, mappoints });
    } catch (err: any) {
      console.error("DB status error:", err);
      return res.status(500).json({ error: "DB query failed", detail: err.message });
    }
  });

  return router;
}
