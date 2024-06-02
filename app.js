const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Define a schema and model for blog posts
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/', async (req, res) => {
    const posts = await Post.find({});
    res.render('index', { posts: posts });
});

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', { post: post });
});

app.get('/new', (req, res) => {
    res.render('new-post');
});

app.post('/new', async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });
    await newPost.save();
    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('edit-post', { post: post });
});

app.post('/edit/:id', async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        content: req.body.content
    });
    res.redirect(`/post/${req.params.id}`);
});

app.post('/delete/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
});
// Define the "About" route
app.get('/about', (req, res) => {
    res.render('about'); 
});

app.get('/contact', (req, res) => {
    res.render('contact'); 
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
