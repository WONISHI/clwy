const express = require('express');
const router = express.Router();
const {config, client, singleFileUpload} = require('../utils/aliyun');
const {failure, success} = require('../utils/responses')
const {BadRequest} = require('http-errors');
const {Attachment} = require('../models');
/**
 * 阿里云 OSS 客户端上传
 * POST /uploads/aliyun
 */
router.post('/aliyun', function (req, res) {
    try {
        singleFileUpload(req, res, async function (error) {
            if (error) {
                return failure(res, error);
            }

            if (!req.file) {
                return failure(res, new BadRequest('请选择要上传的文件。'));
            }
// 记录附件信息
            await Attachment.create({
                ...req.file,
                // 有部分同学碰到上传中文文件名，数据库中出现乱码问题。
                // 可取消以下这行的屏蔽后，再尝试一下。
                // originalname: Buffer.from(req.file.originalname, 'latin1').toString()
                userId: req.userId,
                fullpath: req.file.path + '/' + req.file.filename,
            })
            success(res, '上传成功。', { url: req.file.url });
        });
    } catch (error) {
        failure(res, error);
    }
})

