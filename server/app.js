// 정통 수행이라 귀찮으므로 DB를 사용하지 않았습니다.
// JSON 파일로 커버
const express = require('express');
const app = express();
const passport = require('passport') // passport 로그인 구현을 위해 사용
    , LocalStrategy = require('passport-local').Strategy; // Passport Local
const session = require('express-session'); // Session
const cookieParser = require('cookie-parser')

const db = require('./modules/mongoConnect').getDB()

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

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

const Post = require('./schema/posts')
const User = require('./schema/userData')

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({ email: username }, (err, data) => {
            if (err) {
                console.log(`[Login] ${err}`)
                return done(err)
            }
            if (!data) {
                console.log(`[Login] 이메일이 일치하지 않음 : ${username}`)
                return done(null, false, { message: '이메일이 일치하지 않습니다.', succ: false });
            }
            if (data.password != password) {
                console.log(`[Login] 비밀번호가 일치하지 않음 : ${username}`)
                return done(null, false, { message: '비밀번호가 일치하지 않습니다.', succ: false });
            }
            console.log(`[Login] 로그인 성공 : ${username}`)
            delete data[password]
            return done(null, data);
        })
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

app.get('/',(req,res)=>{
    res.render('index',{
        user : req.user
    })
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/create', (req, res) => {
    res.render('newVote')
})
app.get('/join', (req, res) => {
    Post.find((err, data) => {
        data = data.filter(x => x.isOpen & (req.query.search ? (x.title.indexOf(req.query.search) != -1) : 1))
        res.render('voteList', {
            list: data,
            popular: data.sort((a,b)=>{
                return (b.viewCount - a.viewCount)
            }).slice(0,5)
        })
    })
})
app.get('/close', (req, res) => {
    Post.find((err, data) => {
        data = data.filter(x => !x.isOpen & (req.query.search ? (x.title.indexOf(req.query.search) != -1) : 1))
        res.render('oldVoteList', {
            list: data,
            popular: data.sort((a, b) => {
                return (b.viewCount - a.viewCount)
            }).slice(0, 5)
        })
    })
})

const authRouter = require('./routers/auth'); // 라우터 로딩

app.use('/auth', authRouter); // 라우터 연결

const postRouter = require('./routers/post'); // 라우터 로딩

app.use('/post', postRouter); // 라우터 연결