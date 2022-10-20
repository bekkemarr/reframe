const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
//const User = require('../models/User')

// comments = comments.map(comment => {
//   const user = await User.findOne({_id:comment.user})
//   return [user, comment]
// })

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      let result = {};
      //Check if there is an image
      if (req.file !== undefined){
        result = await cloudinary.uploader.upload(req.file.path);
      }
      // Upload image to cloudinary
      await Post.create({
        title: req.body.title,
        negativeTitle: req.body.negativeTitle,
        image: result.secure_url,    //why does this work when there isn't an image??
        cloudinaryId: result.public_id, //maybe the create function assumes a null value should be empty and can continue? because it's not required in the schema??? 
        caption: req.body.caption,
        negativeCaption: req.body.negativeCaption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });

      //See if post has an image, and if so delete
      if (post.cloudinaryId !== undefined){
        await cloudinary.uploader.destroy(post.cloudinaryId);
      }

      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
