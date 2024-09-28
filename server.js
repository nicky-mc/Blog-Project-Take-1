const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

// Initialize Firebase Admin SDK (you'll need to add your own credentials)
const { db } = require("./firebase");
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

app.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "blog.html"));
});

app.post("/api/blog", (req, res) => {
  const { title, article, summary, bannerImage } = req.body;

  db.collection("blogs")
    .add({
      title,
      article,
      summary,
      bannerImage,
      publishedAt: new Date().toISOString(),
    })
    .then((docRef) => {
      res.json({ id: docRef.id, message: "Blog post created successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error adding document" });
    });
});

app.get("/api/blog/:id", (req, res) => {
  const id = req.params.id;

  db.collection("blogs")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).json({ error: "Blog post not found" });
      } else {
        res.json(doc.data());
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Error fetching document" });
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
          title: doc.data().title,
          summary: doc.data().summary,
          bannerImage: doc.data().bannerImage,
        });
      });
      res.json(blogs);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error fetching blogs" });
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
