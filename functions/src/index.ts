import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

export const redirectToGame = onRequest((req, res) => {
  const userAgent = req.get("User-Agent") || "";

  // Simple validation: allow only app clients (adjust logic)
  if (!userAgent.includes("MyFlutterApp")) {
    res.status(403).send("Forbidden");
    return;
  }
  const targetUrl = "https://firebasestorage.googleapis.com/v0/b/lingosound-fe5f3.firebasestorage.app/o/lessons%2Fcolors%2Fred%2FThe%20color%20red.mp4?alt=media&token=5c1dac57-d153-4850-8e2e-c5989d932f3d";
  logger.info(`Redirecting to: ${targetUrl}`);
  res.redirect(targetUrl);
});

export const getSignedLessonUrl = functions.onRequest(async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    res.status(401).send("Missing ID token");
    return;
  }

  try {
    await admin.auth().verifyIdToken(idToken);
    // const uid = decoded.uid;

    // You can also check roles, email, etc. here if needed

    const filePath = "lessons/colors/red/The color red.mp4";

    const [signedUrl] = await admin
      .storage()
      .bucket()
      .file(filePath)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + 5 * 60 * 1000, // valid for 5 minutes
      });

    res.status(200).send({ url: signedUrl });

  } catch (err) {
    console.error("Auth sfailed:", err);
    res.status(403).send(err);
  }
});
