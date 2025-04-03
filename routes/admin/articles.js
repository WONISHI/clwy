const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");

// 查询文章列表
router.get("/list", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = query.currentPage || 1;
    const pageSize = query.pageSize || 10;
    const offset = (currentPage - 1) * pageSize;
    const condition = {
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
    };
    const { count, rows } = await Article.findAndCountAll(condition);
    res.json({
      status: true,
      message: "查询列表成功",
      data: {
        articles: rows,
        pagination: { currentPage, pageSize, total: count },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "查询文章列表失败",
      error: [error.message],
    });
  }
});

// 查询文章详情
router.get("/list/:id", async function (req, res) {
  try {
    // 获取文章 ID
    const { id } = req.params;

    // 查询文章
    const article = await Article.findByPk(id);
    if (article) {
      res.json({
        status: true,
        message: "查询文章成功。",
        data: article,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "文章不存在。",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "查询文章失败。",
      errors: [error.message],
    });
  }
});

// 创建文章
router.post("/", async function (req, res) {
  try {
    const article = await Article.create(findBody(req));
    res.status(201).json({
      status: true,
      message: "创建文章成功。",
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
    });
  }
});

// 删除文章
router.delete("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (article) {
      await article.destroy();
      res.json({
        status: true,
        message: "删除文章成功。",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "文章不存在。",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "删除文章失败。",
      errors: [error.message],
    });
  }
});

// 更新文章
router.put("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (article) {
      await article.update(findBody(req));
      res.json({
        status: true,
        message: "更新文章成功。",
        data: article,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "文章不存在。",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "更新文章失败。",
      errors: [error.message],
    });
  }
});

// 模糊搜索
router.get("/search", async function (req, res) {
  try {
    const { title } = req.query;
    const condition = {
      order: [["id", "DESC"]],
    };
    if (title) {
      condition.where = {
        title: {
          [Op.like]: `%${title}%`,
        },
      };
    }
    const articles = await Article.findAll(condition);
    res.json({ status: true, message: "查询列表成功", data: { articles } });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "查询文章列表失败",
      error: [error.message],
    });
  }
});

function findBody(req) {
  return {
    title: req.body.title,
    content: req.body.content,
  };
}

module.exports = router;
