import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

export const redirectToGame = onRequest((req, res) => {
    const userAgent = req.get("User-Agent") || "";

    // Simple validation: allow only app clients (adjust logic)
    if (!userAgent.includes("MyFlutterApp")) {
        res.status(403).send("Forbidden");
        return;
    }

    const targetUrl = "https://firebasestorage.googleapis.com/v0/b/lingosound-fe5f3.firebasestorage.app/o/lessons%2Fcolors%2Fred%2FThe%20color%20red.mp4?alt=media&token=ae6f3575-0d9a-47f9-b7a0-9654379c3770";
    logger.info(`Redirecting to: ${targetUrl}`);
    res.redirect(targetUrl);
});