// Centralized error response helper
import { Response } from 'express';

export function sendError(res: Response, status: number, message: string) {
    return res.status(status).json({ error: message });
}
