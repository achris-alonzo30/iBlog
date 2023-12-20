const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });

const app = express();

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const secret = "ajskdhajkshdajshdajk";

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  "mongodb+srv://achrisalonzo30:KWnuBBbpZ9NsUuXU@cluster0.spaxjey.mongodb.net/Usersblog?retryWrites=true&w=majority"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });

    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      return res.status(400).json("User not found");
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
      // Generate a token
      const token = jwt.sign(
        {
          username,
          id: userDoc._id,
        },
        secret
      );

      // Set the token as a cookie
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

      res.json({
        id: userDoc._id,
        username,
      });
    } else {
      res.status(400).json("Wrong Credentials");
    }
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      // Clear the cookie or handle the invalid token case
      res.clearCookie("token");
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logout Successfully!" });
});

app.post("/post", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File not provided" });
    }

    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    const { token } = req.cookies;
    fs.renameSync(path, newPath);

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        file: newPath,
        author: info.id,
      });

      res.json(postDoc);
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/post", upload.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.file,
    });

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(403).json({ message: "Access denied. Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, secret);
      
      // Check if the request includes an author query parameter
      const authorQuery = req.query.author ? { author: req.query.author } : {};

      const posts = await Post.find(authorQuery)
        .populate("author", ["username"])
        .sort({ createdAt: -1 })
        .limit(20);

      res.json(posts);
    } catch (err) {
      return res.status(403).json({ message: "Access denied. Invalid token" });
    }
  } catch (error) {
    console.error("Error while fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.listen(4000);
