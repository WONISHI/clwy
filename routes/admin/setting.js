const express = require("express");
const router = express.Router();
const { Setting } = require("../../models");
const { success, failure } = require("../../utils/responses");
const { NotFoundError } = require('http-errors');


// 查询系统设置详情
router.get("/list/", async function (req, res) {
  try {
    // 获取系统设置 ID
    const setting = await getSetting();
    success(res, "查询系统设置成功", setting);
  } catch (error) {
    failure(res, error);
  }
});


// 更新系统设置
router.put("/", async function (req, res) {
  try {
    const setting = await getSetting();
    if (setting) {
      await setting.update(filterBody(req));
      success(res, "更新系统设置成功", setting);
    }
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{copyright: (string|*), icp: (string|string|DocumentFragment|*), name}}
 */
function filterBody(req) {
    return {
      name: req.body.name,
      icp: req.body.icp,
      copyright: req.body.copyright
    };
  }

async function getSetting() {
  const { id } = req.params;
  const setting = await Setting.findOne(id);
  if (!setting) {
    throw new NotFoundError(`ID:${id}的系统设置未找到`);
  }
  return setting;
}

module.exports = router;
