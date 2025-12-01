const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("mongoose");
const axios = require("axios");

exports.createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const content = req.body.content;
    const user = await User.findById(req.userId);
    if (!user || user.isDeleted) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "User not found or account deleted.",
        error: {},
      });
    }
    const post = new Post({ userId, content });
    await post.save();
    // Success response
    return res.status(201).json({
      status: 201,
      data: post,
      message: "Post created successfully.",
      error: {},
    });
  } catch (error) {
    console.error("createPost error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while creating post.",
      error: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.postId;
    const content = req.body.content;
    const postData = await Post.findOne({ _id: postId, isDeleted: false });
    if (!postData) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "Post not found.",
        error: {},
      });
    }
    if (postData.userId.toString() !== userId) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "Post could be edited only by its owner.",
        error: {},
      });
    }
    const updatedPostData = await Post.findByIdAndUpdate(
      postId,
      { content, updatedAt: Date.now() },
      { new: true }
    );
    return res.status(200).json({
      status: 200,
      data: updatedPostData,
      message: "Post updated successfully",
      error: {},
    });
  } catch (error) {
    console.error("updatePost error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while updating post.",
      error: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.postId;
    const postData = await Post.findOne({ _id: postId, isDeleted: false });
    if (!postData) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "Post not found.",
        error: {},
      });
    }
    if (postData.userId.toString() !== userId) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "Post could be deleted only by its owner.",
        error: {},
      });
    }
    await Post.findByIdAndUpdate(postId, { isDeleted: true }, { new: true });
    return res.status(200).json({
      status: 200,
      data: {},
      message: "Post deleted successfully",
      error: {},
    });
  } catch (error) {
    console.error("deletePost error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while deleting post.",
      error: error.message,
    });
  }
};

exports.archivePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.postId;
    const postData = await Post.findOne({ _id: postId, isDeleted: false });
    if (!postData) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "Post not found.",
        error: {},
      });
    }
    if (postData.userId.toString() !== userId) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "Post could be deleted only by its owner.",
        error: {},
      });
    }
    let message;
    if (postData.isArchive) {
      await Post.findByIdAndUpdate(postId, { isArchive: false }, { new: true });
      message = "Post unarchive successfully";
    } else {
      await Post.findByIdAndUpdate(postId, { isArchive: true }, { new: true });
      message = "Post archive successfully";
    }
    return res.status(200).json({
      status: 200,
      data: {},
      message: message,
      error: {},
    });
  } catch (error) {
    console.error("deletePost error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while deleting post.",
      error: error.message,
    });
  }
};

exports.pinnedPost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.postId;
    const postData = await Post.findOne({ _id: postId, isDeleted: false });
    if (!postData) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "Post not found.",
        error: {},
      });
    }
    if (postData.userId.toString() !== userId) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "Post could be deleted only by its owner.",
        error: {},
      });
    }
    let message = "";
    if (postData.isPin) {
      await Post.findByIdAndUpdate(postId, { isPin: false }, { new: true });
      message = "Post unpinned successfully";
    } else {
      await Post.findByIdAndUpdate(postId, { isPin: true }, { new: true });
      message = "Post pinned successfully";
    }
    return res.status(200).json({
      status: 200,
      data: {},
      message: message,
      error: {},
    });
  } catch (error) {
    console.error("deletePost error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while deleting post.",
      error: error.message,
    });
  }
};

exports.listPost = async (req, res) => {
  try {
    const userId = req.userId;
    const postData = await Post.find({ userId, isDeleted: false, isArchive: false }).sort({
      isPin: -1,
    });
    return res.status(200).json({
      status: 200,
      data: postData,
      message: "Post list successfully",
      error: {},
    });
  } catch (error) {
    console.error("listPost error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while listing post.",
      error: error.message,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const postData = await Post.findOne({ _id: postId, isDeleted: false });
    if (!postData) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "Post not found.",
        error: {},
      });
    }
    return res.status(200).json({
      status: 200,
      data: postData,
      message: "Post fetched successfully",
      error: {},
    });
  } catch (error) {
    console.error("getPost error:", error);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while fetching post.",
      error: error.message,
    });
  }
};

exports.generateCaption = async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        messages: [
          {
            role: "user",
            content: `Generate a caption for: ${prompt}`,
          },
        ],
      }),
    });
    const data = await response.json();
    const aiRaw = data?.choices?.[0]?.message?.content || "No caption generated";
    // Clean extra quotes
    const aiOutput =
      aiRaw.startsWith('"') && aiRaw.endsWith('"')
        ? aiRaw.slice(1, -1)
        : aiRaw;
    return res.status(200).json({
      status: 200,
      data: aiOutput,
      message: "Caption generated successfully",
      error: {},
    });
  } catch (error) {
    console.error("generateCaption error:", error.message);
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Server error while generating caption.",
      error: error.message,
    });
  }
}
