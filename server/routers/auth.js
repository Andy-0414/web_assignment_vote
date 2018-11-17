const express = require('express'); // express
const router = express.Router(); // 라우터 모듈
const passport = require('passport') // passport 로그인 구현을 위해 사용

router.post('/login', // 로그인
    passport.authenticate('local'),
    (req, res) => {
        res.status(200).end(); // 구현해야함
    });

router.post('/logout', function (req, res, next) { // 로그아웃
    if (req.isLogin) {
        req.logout();
    }
    res.status(200).end(); // 구현해야함
});

router.post('/register', function (req, res, next) {
    // 구현해야함
}); // 회원 가입

module.exports = router; // 내보내기 -> app.js