const express = require('express');
const session = require('express-session');
const app = express();
const cookieParser = require('cookie-parser');
const authController = require('./controllers/auth');
const shopController = require('./controllers/shop');
const cartController = require('./controllers/cart_item');
const orderController = require('./controllers/cart_order');
const loginDataController = require('./controllers/loginData');
const mongoose = require('mongoose');
const { SECRET, MongoURI } = require('./config');
const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {localStrategyHandler, serializeUser, deserializeUser, isValid} = require('./passport');
const store = new MongoDBStore({
    uri: MongoURI,
    collection: 'mySessions'
});
const cors = require('cors');

const PORT = process.env.PORT || 3005;

const path = require('path');
const staticRoot = __dirname + '/public/';
const fs = require('fs');

const fileUpload = require('express-fileupload');

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

store.on('error', function(error) {
    console.log(error);
});

app.use(require('express-session')({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 
    },
    store: store,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy(localStrategyHandler));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

const init = async () => {
    await mongoose.connect(MongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    app.listen(PORT, (err) => console.log('Server up'));
}

init();

app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
// app.use(cors());

app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/auth')) {
        return next();
    }
    const accept = req.accepts('html', 'json', 'xml');
    if (accept !== 'html') {
        return next();
    }
    const ext = path.extname(req.path);
    if (ext !== '') {
        return next();
    }
    fs.createReadStream(staticRoot + 'index.html').pipe(res);
});
app.use(express.static('public'));


app.get('/test', (req, res) => {
    return res.json({ a: 1, b: 2 });
});

app.use('/api/auth', authController);
app.use('/api/shop', loginDataController);
app.use('*', isValid);

app.post('/upload', (req, res) =>{
    req.files.file.mv(path.join(__dirname, 'public/img', req.files.file.name), (err) =>{
        if (err){
            return res.status(400).json({});
        }
        return res.status(200).json({});
    })
});

app.use('/api/shopping', shopController);
app.use('/api/cart', cartController);
app.use('/api/order', orderController);

app.get('/test', (req, res) => {
    return res.json({ a: 1, b: 2 });
});

// app.get('/', (req, res) => {
//     res.sendfile(path.join(public+'/index.html'));
// });


