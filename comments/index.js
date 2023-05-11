const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/comments', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const commentSchema = new mongoose.Schema({
    postId: { type: String, required: true },
    content: { type: String, required: true },
    email: { type: String, required: true },
    time: { type: Date, default: Date.now },
  });
  
const Comment = mongoose.model('Comment', commentSchema);

app.get('/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
  
    const comments = await Comment.find({ postId: postId });
  
    res.send(comments);
  });
  
app.post('/posts/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { content, email } = req.body;
    const comment = new Comment({ postId: id, content, email });
    await comment.save();
    res.status(201).send(comment);
  });

app.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.sendStatus(204);
  });
  

app.listen(4001, () => {
    console.log("Listening to port 4001");
})
