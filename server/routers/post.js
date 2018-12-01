const express = require('express'); // express
const router = express.Router(); // 라우터 모듈
const path = require('path');
const Post = require('../schema/posts')

var multer = require('multer')
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/img/');
        },
        filename: function (req, file, cb) {
            cb(null, `${new Date().getTime()}_${file.originalname}`);
        }
    }),
});


router.get('/:id', (req, res) => {
    Post.findOne({ id: req.params.id }, (err, data) => {
        if(data){
            data.viewCount++;
            //data.join { email:"", answer:[1,3]}
            var myJoin;
            var isOwner = false
            if (req.isLogin) {
                myJoin = data.join.find(x => x.email == req.user.email)
                isOwner = (req.user.email == data.owner)
            }
            var answer = [];
            var all = 0;
            data.list.forEach((x, index) => {
                answer[index] = 0;
            })
            data.join.forEach((x, index) => {
                x.answer.forEach(y => {
                    answer[y]++
                    all++;
                })
            })
            data.save(err => {
                res.render('voteView', {
                    post: data,
                    user: req.user,
                    answer: answer,
                    all: all,
                    isJoin: (myJoin ? myJoin.answer : []),
                    isOwner: isOwner
                })
            })
        }
        else{
            res.redirect('/')
        }
    })
})

router.post('/:id/answer', (req, res) => {
    if (req.isLogin) {
        Post.findOne({ id: req.params.id }, (err, data) => {
            if (data.join.findIndex(x => x.email == req.user.email) == -1) {
                data.join.push({
                    email: req.user.email,
                    answer: [...req.body.answer]
                })
                data.save(err => {
                    res.redirect(`/post/${data.id}`)
                })
            }
            else {
                res.redirect(`/post/${data.id}`)
            }
        })
    }
    else {
        res.redirect('/')
    }
})

router.post('/:id/comment', (req, res) => {
    if (req.isLogin) {
        Post.findOne({ id: req.params.id }, (err, data) => {
            data.comment.push({
                email: req.user.email,
                username: req.user.username,
                content: req.body.content,
                date: new Date().toLocaleTimeString()
            })
            data.save(err => {
                res.redirect(`/post/${data.id}`)
            })
        })
    }
    else {
        res.redirect('/')
    }
})

router.post('/:id/close', (req, res) => {
    if (req.isLogin) {
        Post.findOne({ id: req.params.id }, (err, data) => {
            if (data.owner == req.user.email) {
                data.isOpen = false
                data.date = new Date().toLocaleTimeString()
                data.save(err => {
                    res.redirect(`/post/${data.id}`)
                })
            }
            else {
                res.redirect(`/post/${data.id}`)
            }
        })
    }
    else {
        res.redirect('/')
    }
})

router.post('/:id/delete', (req, res) => {
    if (req.isLogin) {
        Post.findOne({ id: req.params.id }, (err, data) => {
            if (data.owner == req.user.email) {
                data.delete(err => {
                    res.redirect(`/join`)
                })
            }
            else {
                res.redirect(`/join`)
            }
        })
    }
    else {
        res.redirect('/')
    }
})


router.post('/create', upload.single('img'), function (req, res) { // 로그아웃
    if (req.isLogin) {
        var data = {
            isOpen: true,
            title: req.body.title,
            img: (req.file ? '/img/' + req.file.filename : ''),
            list: req.body.list,
            isMulti: (req.body.isMulti == "on"),
            date: new Date().toLocaleDateString(),

            subTitle: req.body.subtitle,
            content: req.body.content,

            viewCount: 0,

            comment: [],

            ownerName: req.user.username,
            owner: req.user.email,
        }
        var newPost = new Post(data)
        newPost.nextCount((err, count) => {
            newPost.save(err => {
                res.redirect(`/post/${count}`)
            })
        })

    }
    else {
        res.redirect('/')
    }
});

module.exports = router; // 내보내기 -> app.js