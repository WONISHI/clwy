var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const adminAuth = require("./middlewares/adminAuth");
require("dotenv").config();
// 前台路由
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const categoriesRouter = require('./routes/categories');
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapters');
const articlesRouter = require('./routes/articles');
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
// 后台路由
var adminArticlesRouter = require("./routes/admin/articles.js");
var adminCategoriesRouter = require("./routes/admin/categories.js");
var adminSettingRouter = require("./routes/admin/setting.js");
var adminUserRouter = require("./routes/admin/users.js");
var adminCourseRouter = require("./routes/admin/courses.js");
var adminChapterRouter = require("./routes/admin/chapters.js");
var adminChartRouter = require("./routes/admin/chart.js");
var adminLoginRouter = require("./routes/admin/login.js");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// 前台路由配置
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use('/categories', categoriesRouter);
app.use('/courses', coursesRouter);
app.use('/chapters', chaptersRouter);
app.use('/articles', articlesRouter);
app.use('/settings', settingsRouter);
app.use('/search', searchRouter);
// 后台路由配置
app.use("/admin/articles", adminAuth, adminArticlesRouter);
app.use("/admin/categories", adminAuth, adminCategoriesRouter);
app.use("/admin/setting", adminAuth, adminSettingRouter);
app.use("/admin/users", adminAuth, adminUserRouter);
app.use("/admin/courses", adminAuth, adminCourseRouter);
app.use("/admin/chapters", adminAuth, adminChapterRouter);
app.use("/admin/chart", adminAuth, adminChartRouter);
app.use("/admin/login", adminLoginRouter);

module.exports = app;
