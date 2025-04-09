const express = require("express");
const router = express.Router();
const { Course,User, Category,Chapter } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, success, failure } = require("../../utils/response");

// 查询课程列表
router.get("/list", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = query.currentPage || 1;
    const pageSize = query.pageSize || 10;
    const offset = (currentPage - 1) * pageSize;
    const condition = {
      ...getCondition(),
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    };    
    const { count, rows } = await Course.findAndCountAll(condition);
    success(res, "查询课程列表成功", {
      coursess: rows,
      pagination: { currentPage, pageSize, total: count },
    });
  } catch (error) {
    failure(res, error);
  }
});

// 查询课程详情
router.get("/list/:id", async function (req, res) {
  try {
    // 获取课程 ID
    const course = await getCourse(req);
    success(res, "查询课程成功", course);
  } catch (error) {
    failure(res, error);
  }
});

// 创建课程
router.post("/", async function (req, res) {
  try {
    const course = await Course.create(filterBody(req));
    success(res, "查询课程成功", course, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除课程
router.delete("/:id", async function (req, res) {
  try {
    const course = await getCourse(req);
    const count = await Chapter.count({ where: { courseId: req.params.id } });
    if (count > 0) {
      throw new Error("当前课程有章节，无法删除");
    }
    if (course) {
      await course.destroy();
      success(res, "删除课程成功");
    }
  } catch (error) {
    failure(res, error);
  }
});

// 更新课程
router.put("/:id", async function (req, res) {
  try {
    const course = await getCourse(req);
    if (course) {
      await course.update(filterBody(req));
      success(res, "更新课程成功", course);
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
    if (query.categoryId) {
      condition.where = {
        categoryId: {
          [Op.eq]: query.categoryId
        }
      };
    }
    
    if (query.userId) {
      condition.where = {
        userId: {
          [Op.eq]: query.userId
        }
      };
    }
    
    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${ query.name }%`
        }
      };
    }
    
    if (query.recommended) {
      condition.where = {
        recommended: {
          // 需要转布尔值
          [Op.eq]: query.recommended === 'true'
        }
      };
    }
    
    if (query.introductory) {
      condition.where = {
        introductory: {
          [Op.eq]: query.introductory === 'true'
        }
      };
    }
    const courses = await Course.findAll(condition);
    success(res, "查询列表成功", { courses });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: *, name, introductory: (boolean|*), userId: (number|*), categoryId: (number|*), content, recommended: (boolean|*)}}
 */
function filterBody(req) {
  return {
    categoryId: req.body.categoryId,
    userId: req.body.userId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content
  };
}

/**
 * 公共方法：关联分类、用户数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
  return {
    attributes: { exclude: ['CategoryId', 'UserId'] },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }
    ]
  }
}

// 然后修改查询单条数据这里

/**
 * 公共方法：查询当前课程
 */
async function getCourse(req) {
  const { id } = req.params;
  const condition = getCondition();

  const course = await Course.findByPk(id, condition);
  if (!course) {
    throw new NotFoundError(`ID: ${ id }的课程未找到。`)
  }

  return course;
}

module.exports = router;
