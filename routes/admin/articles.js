const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");
const { success, failure } = require("../../utils/responses");
const { NotFoundError } = require('http-errors');

// 查询文章列表
router.get("/list", async function (req, res) {
  console.log(req.query,9999);
  try {
    const query = req.query;
    const currentPage = query.currentPage || 1;
    const pageSize = query.pageSize || 10;
    const offset = (currentPage - 1) * pageSize;
    console.log('offset', offset);
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
    console.log(error);
    failure(res, error);
  }
});

// 查询文章详情
router.get("/list/:id", async function (req, res) {
  try {
    // 获取文章 ID
    console.log("req.params.id", req.params.id);
    const article = await getArticle(req);
    success(res, "查询文章成功", article);
  } catch (error) {
    console.log(error);
    failure(res, error);
  }
});

// 创建文章
router.post("/", async function (req, res) {
  try {
    const article = await Article.create(findBody(req));
    success(res, "查询文章成功", article, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除文章
router.delete("/:id", async function (req, res) {
  try {
    const article = await getArticle(req);
    if (article) {
      await article.destroy();
      success(res, "删除文章成功");
    }
  } catch (error) {
    failure(res, error);
  }
});

// 更新文章
router.put("/:id", async function (req, res) {
  try {
    const article = await getArticle(req);
    if (article) {
      await article.update(findBody(req));
      success(res, "更新文章成功", article);
    }
  } catch (error) {
    failure(res, error);
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
    failure(res, error);
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
