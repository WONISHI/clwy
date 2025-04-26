const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const adminAuth = require("./middlewares/admin-auth");
const userAuth = require("./middlewares/user-auth");
const cors = require('cors')

require("dotenv").config();
// 前台路由
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const categoriesRouter = require("./routes/categories");
const coursesRouter = require("./routes/courses");
const chaptersRouter = require("./routes/chapters");
const articlesRouter = require("./routes/articles");
const settingsRouter = require("./routes/settings");
const searchRouter = require("./routes/search");
const authRouter = require("./routes/auth");
const likesRouter = require("./routes/likes");
// 后台路由
const adminArticlesRouter = require("./routes/admin/articles.js");
const adminCategoriesRouter = require("./routes/admin/categories.js");
const adminSettingRouter = require("./routes/admin/setting.js");
const adminUserRouter = require("./routes/admin/users.js");
const adminCourseRouter = require("./routes/admin/courses.js");
const adminChapterRouter = require("./routes/admin/chapters.js");
const adminChartRouter = require("./routes/admin/chart.js");
const adminLoginRouter = require("./routes/admin/auth.js");
const adminAttachmentsRouter = require('./routes/admin/attachments');
// 文件上传
const uploadsRouter = require('./routes/uploads.js');


const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors())
// 前台路由配置
app.use("/", indexRouter);
app.use("/categories", categoriesRouter);
app.use("/courses", coursesRouter);
app.use("/chapters", chaptersRouter);
app.use("/articles", articlesRouter);
app.use("/settings", settingsRouter);
app.use("/search", searchRouter);
app.use("/auth", authRouter);
app.use("/users", userAuth, usersRouter);
app.use("/likes", userAuth, likesRouter);
// 文件上传配置
app.use("/uploads", userAuth, uploadsRouter);
// 后台路由配置
app.use("/admin/articles", adminAuth, adminArticlesRouter);
app.use("/admin/categories", adminAuth, adminCategoriesRouter);
app.use("/admin/setting", adminAuth, adminSettingRouter);
app.use("/admin/users", adminAuth, adminUserRouter);
app.use("/admin/courses", adminAuth, adminCourseRouter);
app.use("/admin/chapters", adminAuth, adminChapterRouter);
app.use("/admin/chart", adminAuth, adminChartRouter);
app.use("/admin/login", adminLoginRouter);
app.use('/admin/attachments', adminAuth, adminAttachmentsRouter);

module.exports = app;
