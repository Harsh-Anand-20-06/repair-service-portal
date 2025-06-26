



//external module
const express = require('express');
const path = require('path');
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);  //this package was a function jisme hmne session pass kiya or isne hme store bna k de diya
const multer = require('multer');


//local module
const {adminRouter} =  require("./routes/adminRouter");
const {complaintRouter} = require("./routes/complaintRouter"); //since now hostRouter file is exporting multiple things,we have to destructure it, that is named import
const userRouter = require("./routes/userRouter");
const rootDir = require("./utils/pathUtil");
const authRouter = require('./routes/authRouter');
//const { error } = require('./controllers/errors');
//const authRouter = require('./routes/authRouter');

const app = express();
app.set('view engine','ejs');   
app.set('views','views');

const store = new MongoDBStore({   //ye hmko isisliye bnana pada kyuki pehle ssession server pe store ho rha tha or jabhi server restart ho rha tha to information gayab ho jati thi
    uri: DB_PATH,
    collection: 'sessions'   //name of collection
})

// const randomString = (length)=>{
//     const characters ='abcdefghijklmnopqrstuvwxyz';
//     let result = '';
//     for(let i = 0;i<length;i++)
//     {
//         result+= characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
// }

// const storage = multer.diskStorage({
//    destination: (req,file,cb)=>{
//      cb(null,"uploads/");
//    } ,
//    filename: (req,file,cb)=>{
//     cb(null,randomString(10)+"-"+file.originalname);  //providing unique name to all files
//    }
// });

// const fileFilter = (req,file,cb)=>{        
//     if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')  //allows only jpg,jpeg and png files
//     {
//         cb(null,true);
//     }

//     else{
//         cb(null,false);
//     }
// }

// const multerOptions = {
//     // dest: "uploads/",    //server se aake uploads folder me chala jayega
//     storage,fileFilter  
// }


app.use(express.static(path.join(rootDir,'public')));

// app.use("/uploads",express.static(path.join(rootDir,'uploads')))// /uploads se rquest aaye to uploads folder ko bhi public kar do
// app.use("/host/uploads",express.static(path.join(rootDir,'uploads')))// /host/uploads se rquest aaye tab bhi uploads folder ko bhi public kar do
// app.use("/homes/uploads",express.static(path.join(rootDir,'uploads')))// /host/uploads se rquest aaye tab bhi uploads folder ko bhi public kar do

app.use(express.urlencoded());
// app.use(multer(multerOptions).single('link'));  //must do after multer declaration

app.use(session({
    secret: "KnowledgeGate AI with Complete Coding ",
    resave: false,
    saveUninitialized: true, 
    store: store   // ab ye session ko store me store karega jo hmne bnaya hai upar mongodb par
    //login karke mongodb compass pe dekho
}))

app.use((req,res,next)=>{ //jaise hi request pehli baar server k paas aayi sbse pehle hmne cookies check kar liye
    //agr aayi hai to cookie ko nikal k request me hi set kr do
    // Yes, once a browser gets a cookie like isLoggedIn=true, that cookie is automatically sent with every request to the same domain
    console.log("cookie check middleware",req.get('Cookie'));
  //req.isLoggedIn = req.get('Cookie')? req.get('Cookie').split('=')[1] === 'true' : false;  //console me dekho pura string aaya hai, isisliye value aise split kiya h
  req.isLoggedIn = req.session.isLoggedIn;
   next();
})

app.use(authRouter);
app.use(userRouter);
app.use(complaintRouter); 
// app.use("/admin",(req,res,next)=>{  
//     if(req.isLoggedIn){  
//         next();
//     }
//     else{
//         res.redirect("/login");  //kisiko path yaad bhi h to pehle check hoga ki logged h bhi ki nhi
//     }
// });
app.use(adminRouter); 

//app.use(error);

//orderning of these middlewares is very important.


const port = 3001;

mongoose.connect(DB_PATH).then(()=>{
    console.log('Mongoose Connected');
    app.listen(port,()=>{
        console.log(`http://localhost:${port}`)
    })

}).catch(err =>{
    console.log('Error while connecting to Mongo:' , err);
})



