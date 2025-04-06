var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 后台路由
var adminArticlesRouter = require('./routes/admin/articles.js');
var adminCategoriesRouter = require('./routes/admin/categories.js');
var adminSettingRouter = require('./routes/admin/setting.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 后台路由配置
app.use('/admin/articles', adminArticlesRouter);
app.use('/admin/categories', adminCategoriesRouter);
app.use('/admin/setting', adminSettingRouter);

module.exports = app;
