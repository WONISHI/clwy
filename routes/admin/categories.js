const express = require("express");
const router = express.Router();
const { Category, Course } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, success, failure } = require("../../utils/responses");

// 查询分类列表
router.get("/list", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = query.currentPage || 1;
    const pageSize = query.pageSize || 10;
    const offset = (currentPage - 1) * pageSize;
    const condition = {
      order: [
        ["rank", "ASC"],
        ["id", "DESC"],
      ],
      limit: pageSize,
      offset,
    };
    const { count, rows } = await Category.findAndCountAll(condition);
    success(res, "查询分类列表成功", {
      categories: rows,
      pagination: { currentPage, pageSize, total: count },
    });
  } catch (error) {
    failure(res, error);
  }
});

// 查询分类详情
router.get("/list/:id", async function (req, res) {
  try {
    // 获取分类 ID
    const category = await getCategory(req);
    success(res, "查询分类成功", category);
  } catch (error) {
    failure(res, error);
  }
});

// 创建分类
router.post("/", async function (req, res) {
  try {
    const category = await Category.create(findBody(req));
    success(res, "查询分类成功", category, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除分类
router.delete("/:id", async function (req, res) {
  try {
    const category = await getCategory(req);
    const count = await Course.count({ where: { categoryId: req.params.id } });
    if (count > 0) {
      throw new NotFoundError(`该分类下有课程，不能删除`);
    }
    if (category) {
      await category.destroy();
      success(res, "删除分类成功");
    }
  } catch (error) {
    failure(res, error);
  }
});

// 更新分类
router.put("/:id", async function (req, res) {
  try {
    const category = await getCategory(req);
    if (category) {
      await category.update(findBody(req));
      success(res, "更新分类成功", category);
    }
  } catch (error) {
    failure(res, error);
  }
});

// 模糊搜索
router.get("/search", async function (req, res) {
  try {
    const { name } = req.query;
    const condition = {
      order: [["id", "DESC"]],
    };
    if (name) {
      condition.where = {
        name: {
          [Op.like]: `%${name}%`,
        },
      };
    }
    const categories = await Category.findAll(condition);
    success(res, "查询列表成功", { categories });
  } catch (error) {
    failure(res, error);
  }
});

function findBody(req) {
  return {
    name: req.body.name,
    rank: req.body.rank,
  };
}

/**
 * 公共方法：查询当前分类
 */
async function getCategory(req) {
  const { id } = req.params;
  const condition = {
    include: [
      {
        model: Course,
        as: "courses",
      },
    ],
  };

  const category = await Category.findByPk(id, condition);
  if (!category) {
    throw new NotFoundError(`ID: ${id}的分类未找到。`);
  }

  return category;
}

module.exports = router;
