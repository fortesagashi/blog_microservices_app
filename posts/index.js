const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};
const fs = require('fs');
const mongoose = require('mongoose');

// Set the CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/posts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  id: String,
  title: String,
  main_content: String,
  tags: String,
  date: {
    type: Date,
    default: Date.now
  },
  count: {
    type: Number,
    default: 0
  },
  image: {
    data: Buffer,
    contentType: String
  }
});


const Post = mongoose.model('Post', postSchema);

app.get('/posts', async (req, res) => {
    const posts = await Post.find({});
    res.send(posts);
});
  
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    await Post.deleteOne({ id });
    res.sendStatus(204);
});
  
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/posts', upload.single('image'), async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title, main_content, tags, date } = req.body;

  const post = new Post({ id, title, main_content, tags, date, count: 0 });
  console.log(req.file);
  
  // If an image was uploaded, store the file path in the post object
  if (req.file) {
    post.image = {
      data: fs.readFileSync(req.file.path),
      contentType: 'image/png'
    };
  }

  try {
    console.log(post);
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/posts/:id/count', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOneAndUpdate({ id: id }, { $inc: { count: 1 } });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Count updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(4000, () => {
    console.log("Listening on 4000");
});
