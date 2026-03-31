var express = require("express");
var router = express.Router();
let { CheckLogin } = require('../utils/authHandler')
let messageSchema = require('../schemas/messages')
let { uploadFile } = require('../utils/uploadHandler')

// GET / - lấy message cuối cùng của mỗi user mà user hiện tại nhắn tin
router.get('/', CheckLogin, async function (req, res, next) {
    try {
        let user = req.user;
        let messages = await messageSchema.aggregate([
            {
                $match: {
                    $or: [
                        { from: user._id },
                        { to: user._id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $addFields: {
                    otherUser: {
                        $cond: {
                            if: { $eq: ["$from", user._id] },
                            then: "$to",
                            else: "$from"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$otherUser",
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$lastMessage" }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        await messageSchema.populate(messages, [
            { path: 'from', select: 'username fullName avatarUrl' },
            { path: 'to', select: 'username fullName avatarUrl' }
        ]);
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET /:userID - lấy toàn bộ message giữa user hiện tại và userID
router.get('/:userID', CheckLogin, async function (req, res, next) {
    try {
        let user = req.user;
        let otherUserID = req.params.userID;
        let messages = await messageSchema.find({
            $or: [
                { from: user._id, to: otherUserID },
                { from: otherUserID, to: user._id }
            ]
        }).sort({ createdAt: 1 })
          .populate('from', 'username fullName avatarUrl')
          .populate('to', 'username fullName avatarUrl');
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST / - gửi message đến userID
router.post('/', CheckLogin, uploadFile.single('file'), async function (req, res, next) {
    try {
        let user = req.user;
        let to = req.body.to;
        if (!to) {
            res.status(400).send({ message: "to is required" });
            return;
        }

        let messageContent;
        if (req.file) {
            messageContent = {
                type: "file",
                text: req.file.path
            };
        } else {
            if (!req.body.text) {
                res.status(400).send({ message: "text is required" });
                return;
            }
            messageContent = {
                type: "text",
                text: req.body.text
            };
        }

        let newMessage = new messageSchema({
            from: user._id,
            to: to,
            messageContent: messageContent
        });
        await newMessage.save();
        await newMessage.populate('from', 'username fullName avatarUrl');
        await newMessage.populate('to', 'username fullName avatarUrl');
        res.status(200).send(newMessage);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
