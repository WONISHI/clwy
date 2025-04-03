const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, success } = require("../../utils/response");

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
    success(res, "查询文章列表成功", {
      articles: rows,
      pagination: { currentPage, pageSize, total: count },
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
    const article = await getArticle(req);
    success(res, "查询文章成功", article);
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
    success(res, "查询文章成功", article, 201);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((err) => err.message);
      res.status(400).json({
        status: false,
        message: "请求参数错误。",
        errors,
      });
    } else {
      res.status(500).json({
        status: false,
      });
    }
  }
});

// 删除文章
router.delete("/:id", async function (req, res) {
  try {
    const article = await getArticle(req);
    if (article) {
      await article.destroy();
      success(res, "删除文章成功")
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
      success(res, "更新文章成功", article);
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
    success(res, "查询列表成功", { articles });
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

async function getArticle(req) {
  const { id } = req.params;
  const article = await Article.findByPk(id);
  if (!article) {
    throw new NotFoundError(`ID:${id}的文章未找到`);
  }
  return article;
}

module.exports = router;
