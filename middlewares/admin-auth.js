const jwt = require("jsonwebtoken");
const {User} = require("../models");
const createError = require('http-errors');
const {success, failure} = require("../utils/responses");

module.exports = async (req, res, next) => {
    try {
        const {token} = req.headers;
        if (!token) {
            throw createError(401, "当前接口需要认证才能访问。");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {userId} = decoded;
        const user = await User.findByPk(userId);
        if (!user) {
            throw createError(401, "用户不存在。");
        }
        if (user.role !== 100) {
            throw createError(401, "您没有权限使用当前接口。");
        }
        req.user = user;
        next();
    } catch (error) {
        failure(res, error);
    }
};
