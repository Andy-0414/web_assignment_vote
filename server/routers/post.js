const express = require('express'); // express
const router = express.Router(); // 라우터 모듈

const Post = require('../schema/posts')

router.get('/:id', (req, res) => {
    Post.findOne({ id: req.params.id }, (err, data) => {
        data.viewCount++;
        //data.join { email:"", answer:[1,3]}
        var myJoin;
        if (req.isLogin) {
            myJoin = data.join.find(x => x.email == req.user.email)
        }
        var answer = [];
        data.list.forEach((x,index)=>{
            answer[index] = 0;
        })
        data.join.forEach((x, index) => {
            x.answer.forEach(y => {
                answer[y]++
            })
        })
        data.save(err => {
            res.render('voteView', {
                post: data,
                user: req.user,
                answer: answer,
                isJoin: (myJoin ? myJoin.answer : [])
            })
        })
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
                console.log(data.join)
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


router.post('/create', function (req, res) { // 로그아웃
    if (req.isLogin) {
        var data = {
            isOpen: true,
            title: req.body.title,
            img: "",
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