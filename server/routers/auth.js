const express = require('express'); // express
const router = express.Router(); // 라우터 모듈
const passport = require('passport') // passport 로그인 구현을 위해 사용

const User = require('../schema/userData')

router.post('/login', // 로그인
    passport.authenticate('local',{
        successRedirect : '/',
        failureRedirect : '/'
    }))

router.get('/logout', function (req, res) { // 로그아웃
    if (req.isLogin) {
        req.logout();
    }
    res.redirect('/'); // 구현해야함
});

router.post('/register', function (req, res, next) {
    var email = req.body.email; // 유저 이메일
    var username = req.body.username
    var pw = req.body.password; // 유저 패스워드
    if (!pw || !email || !username) {
        console.log(`[Register] 데이터 없음`)
        res.status(405).end() // 데이터가 없을 시 405
    }
    else {
        User.findOne({ email: email }, function (err, data) {
            if (err) {
                console.log(`[Register] ${err}`)
                res.status(500).send({
                    message: "서버 장애가 발생하였습니다.",
                    succ: false
                })
            }
            if (data) {
                console.log(`[Register] 이미 있는 사용자`)
                res.status(400).send({
                    message: "이미 있는 사용자 입니다.",
                    succ: false
                })
            }
            else {
                var newUser = new User({
                    email: email,
                    username: username,
                    password: pw,
                });
                newUser.save(err => {
                    if (err) {
                        console.log(`[Register] ${err}`)
                        res.status(500).send({
                            message: "서버 장애가 발생하였습니다.",
                            succ: false
                        })
                    }
                    console.log(`[Register] 유저 생성 : ${email}`)
                    res.status(200).redirect('/')
                })
            }
        })
    }
}); // 회원 가입

module.exports = router; // 내보내기 -> app.js