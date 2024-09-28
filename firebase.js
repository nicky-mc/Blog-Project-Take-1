import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(
  readFileSync(
    path.join(__dirname, "nicky-s-blog-firebase-adminsdk-ni947-c860e6ad7c.json")
  )
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export { db };
