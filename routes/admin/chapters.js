const express = require("express");
const router = express.Router();
const { Chapter, Course } = require("../../models");
const { Op } = require("sequelize");
const { success, failure } = require("../../utils/responses");
const { NotFoundError } = require('http-errors');
const { NotFound, BadRequest } = require('http-errors');

// 查询章节列表
router.get("/list", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = query.currentPage || 1;
    const pageSize = query.pageSize || 10;
    const offset = (currentPage - 1) * pageSize;
    if (!query.courseId) {
      throw new BadRequest('获取章节列表失败，课程ID不能为空。');
    }
    const condition = {
      ...getCondition(),
      order: [
        ["rank", "ASC"],
        ["id", "DESC"],
      ],
      limit: pageSize,
      offset,
    };
    const { count, rows } = await Chapter.findAndCountAll(condition);
    success(res, "查询章节列表成功", {
      chapters: rows,
      pagination: { currentPage, pageSize, total: count },
    });
  } catch (error) {
    failure(res, error);
  }
});

// 查询章节详情
router.get("/list/:id", async function (req, res) {
  try {
    // 获取章节 ID
    const chapter = await getChapter(req);
    success(res, "查询章节成功", chapter);
  } catch (error) {
    failure(res, error);
  }
});

// 创建章节
router.post("/", async function (req, res) {
  try {
    const body=filterBody(req)
    // 创建章节，并增加课程章节
    const chapter = await Chapter.create(body);
    await Chapter.increment('chaptersCount',{where:{id:chapter.courseId}});
    success(res, "查询章节成功", chapter, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除章节
router.delete("/:id", async function (req, res) {
  try {
    const chapter = await getChapter(req);
    if (chapter) {
      await chapter.destroy();
      await Chapter.decrement('chaptersCount',{where:{id:chapter.courseId}});
      success(res, "删除章节成功");
    }
  } catch (error) {
    failure(res, error);
  }
});

// 更新章节
router.put("/:id", async function (req, res) {
  try {
    const chapter = await getChapter(req);
    if (chapter) {
      await chapter.update(filterBody(req));
      success(res, "更新章节成功", chapter);
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
    const chapters = await Chapter.findAll(condition);
    success(res, "查询列表成功", { chapters });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：关联课程数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
  return {
    attributes: { exclude: ["CourseId"] },
    include: [
      {
        model: Course,
        as: "course",
        attributes: ["id", "name"],
      },
    ],
  };
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{rank: (number|*), video: (string|boolean|MediaTrackConstraints|VideoConfiguration|*), title, courseId: (number|*), content}}
 */
function filterBody(req) {
  return {
    courseId: req.body.courseId,
    title: req.body.title,
    content: req.body.content,
    video: req.body.video,
    rank: req.body.rank,
  };
}

async function getChapter(req) {
  const { id } = req.params;
  const condition = getCondition();
  const chapter = await Chapter.findByPk(id, condition);
  if (!chapter) {
    throw new NotFoundError(`ID:${id}的章节未找到`);
  }
  return chapter;
}

module.exports = router;
