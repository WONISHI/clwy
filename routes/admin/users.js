const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const { Op } = require("sequelize");
const { success, failure } = require("../../utils/responses");
const { NotFoundError } = require('http-errors');

// 查询用户列表
router.get("/list", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = query.currentPage || 1;
    const pageSize = query.pageSize || 10;
    const offset = (currentPage - 1) * pageSize;
    const condition = {
      where:{},
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
    };
    const { count, rows } = await User.findAndCountAll(condition);
    success(res, "查询用户列表成功", {
      users: rows,
      pagination: { currentPage, pageSize, total: count },
    });
  } catch (error) {
    failure(res, error);
  }
});

// 查询当前登陆的用户详情
// 路由的顺序需要保证
router.get("/me", async function (req, res) {
  try {
    // 获取用户 ID
    const user = req.user;
    success(res, "查询当前用户信息成功", user);
  } catch (error) {
    failure(res, error);
  }
});

// 查询用户详情
router.get("/list/:id", async function (req, res) {
  try {
    // 获取用户 ID
    const user = await getUser(req);
    success(res, "查询用户成功", user);
  } catch (error) {
    failure(res, error);
  }
});

// 创建用户
router.post("/", async function (req, res) {
  try {
    const body = filterBody(req);
    const user = await User.create(body);
    success(res, "查询用户成功", user, 201);
  } catch (error) {
    failure(res, error);
  }
});



// 更新用户
router.put("/:id", async function (req, res) {
  try {
    const user = await getUser(req);
    if (user) {
      await user.update(filterBody(req));
      success(res, "更新用户成功", user);
    }
  } catch (error) {
    failure(res, error);
  }
});

// 模糊搜索??????where会覆盖搜索字段
router.get("/search", async function (req, res) {
  try {
    let query = req.query;
    const condition = {
      order: [["id", "DESC"]],
    };
    if (query.email) {
      condition.where = {
        email: {
          [Op.eq]: query.email,
        },
      };
    }

    if (query.username) {
      condition.where = {
        username: {
          [Op.eq]: query.username,
        },
      };
    }

    if (query.nickname) {
      condition.where = {
        nickname: {
          [Op.like]: `%${query.nickname}%`,
        },
      };
    }

    if (query.role) {
      condition.where = {
        role: {
          [Op.eq]: query.role,
        },
      };
    }
    const users = await User.findAll(condition);
    success(res, "查询列表成功", { users });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{password, role: (number|string|*), introduce: ({type: *}|*), sex: ({allowNull: boolean, type: *, validate: {notNull: {msg: string}, notEmpty: {msg: string}, isIn: {args: [number[]], msg: string}}}|{defaultValue: number, allowNull: boolean, type: *}|*), nickname: (string|*), company: ({type: *}|*), avatar: ({type: *, validate: {isUrl: {msg: string}}}|*), email: (string|*), username}}
 */
function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar,
  };
}
async function getUser(req) {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFoundError(`ID:${id}的用户未找到`);
  }
  return user;
}

module.exports = router;
