import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./firebase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/editor", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "editor.html"));
});

app.get("/blog/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "blog.html"));
});

app.post("/api/blog", (req, res) => {
  const { title, article, summary, bannerImage } = req.body;

  console.log("Received blog post data:", { title, summary, bannerImage });
  console.log("Article content length:", article ? article.length : 0);

  db.collection("blogs")
    .add({
      title,
      article,
      summary,
      bannerImage,
      publishedAt: new Date().toISOString(),
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      res.json({ id: docRef.id, message: "Blog post created successfully" });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      res
        .status(500)
        .json({ error: "Error adding document", details: error.message });
    });
});

app.get("/api/blog/:id", (req, res) => {
  const id = req.params.id;
  console.log("Fetching blog post with id:", id);

  db.collection("blogs")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("Document not found");
        res.status(404).json({ error: "Blog post not found" });
      } else {
        console.log("Document data:", doc.data());
        res.json(doc.data());
      }
    })
    .catch((error) => {
      console.error("Error fetching document:", error);
      res
        .status(500)
        .json({ error: "Error fetching document", details: error.message });
    });
});

app.get("/api/blogs", (req, res) => {
  db.collection("blogs")
    .get()
    .then((snapshot) => {
      const blogs = [];
      snapshot.forEach((doc) => {
        blogs.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      res.json(blogs);
    })
    .catch((error) => {
      console.error("Error fetching blogs: ", error);
      res
        .status(500)
        .json({ error: "Error fetching blogs", details: error.message });
    });
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
