const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
// const {config, client, singleFileUpload} = require('../utils/aliyun');
// const {failure, success} = require('../utils/responses')
// const {BadRequest} = require('http-errors');
// const {Attachment} = require('../models');
// /**
//  * 阿里云 OSS 客户端上传
//  * POST /uploads/aliyun
//  */
// router.post('/aliyun', function (req, res) {
//     try {
//         singleFileUpload(req, res, async function (error) {
//             if (error) {
//                 return failure(res, error);
//             }
//
//             if (!req.file) {
//                 return failure(res, new BadRequest('请选择要上传的文件。'));
//             }
//             // 记录附件信息
//             await Attachment.create({
//                 ...req.file,
//                 // 有部分同学碰到上传中文文件名，数据库中出现乱码问题。
//                 // 可取消以下这行的屏蔽后，再尝试一下。
//                 // originalname: Buffer.from(req.file.originalname, 'latin1').toString()
//                 userId: req.userId,
//                 fullpath: req.file.path + '/' + req.file.filename,
//             })
//             success(res, '上传成功。', { url: req.file.url });
//         });
//     } catch (error) {
//         failure(res, error);
//     }
// })

// /**
//  * 获取直传阿里云 OSS 授权信息
//  * GET /uploads/aliyun_direct
//  */
// router.get('/aliyun_direct', async function (req, res, next) {
//     // 有效期
//     const date = moment().add(1, 'days');
//
//     // 自定义上传目录及文件名
//     const key = `uploads/${uuidv4()}`;
//
//     // 上传安全策略
//     const policy = {
//         expiration: date.toISOString(),  // 限制有效期
//         conditions:
//             [
//                 ['content-length-range', 0, 5 * 1024 * 1024], // 限制上传文件的大小为：5MB
//                 { bucket: client.options.bucket }, // 限制上传的 bucket
//                 ['eq', '$key', key], // 限制上传的文件名
//                 ['in', '$content-type', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']], // 限制文件类型
//             ],
//     };
//
//     // 签名
//     const formData = await client.calculatePostSignature(policy);
//
//     // bucket 域名（阿里云上传地址）
//     const host =
//         `https://${config.bucket}.${(await client.getBucketLocation()).location}.aliyuncs.com`.toString();
//
//     // 返回参数
//     const params = {
//         expire: date.format('YYYY-MM-DD HH:mm:ss'),
//         policy: formData.policy,
//         signature: formData.Signature,
//         accessid: formData.OSSAccessKeyId,
//         host,
//         key,
//         url: host + '/' + key,
//     };
//
//     success(res, '获取阿里云 OSS 授权信息成功。', params);
// });
