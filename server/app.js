// 정통 수행이라 귀찮으므로 DB를 사용하지 않았습니다.
// JSON 파일로 커버
const express = require('express');
const app = express();
const passport = require('passport') // passport 로그인 구현을 위해 사용
    , LocalStrategy = require('passport-local').Strategy; // Passport Local
const session = require('express-session'); // Session
const cookieParser = require('cookie-parser')

app.use(session({
    secret: 'Andy0414',
    resave: false,
    saveUninitialized: true,
})) // 세션 스토리지

app.use(passport.initialize()); // 패스포트 사용
app.use(passport.session()); // 패스포트 세션 사용

app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false })); // body parser
app.use(cookieParser()); // 쿠키파서
app.use(express.static('public')); // 정적 파일

passport.use(new LocalStrategy(
    (username, password, done) => {
        //구현해야함
    }
)); // 로그인 조건 - local

passport.serializeUser((user, done) => { // 세션 생성
    if (!user) return done(null, false);
    done(null, user);
});

passport.deserializeUser((user, done) => { // 세션 확인
    done(null, user);
});

app.listen(3333, () => {
    console.log("Server Open")
})

app.use((req, res, next) => { // 로그인 유무 확인 미들웨어
    req.isLogin = (req.user ? true : false)
    next()
})

app.post('/',(req,res)=>{
    console.log(req.body)
    res.send(req.body)
})

const authRouter = require('./routers/auth'); // 라우터 로딩

app.use('/auth', authRouter); // 라우터 연결