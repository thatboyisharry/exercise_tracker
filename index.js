const express = require('express');
const app = express();
const cors=require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const User =require('./models/users');
const {Exercise}=require('./models/exercises');
const moment=require('./moment')


const PORT =process.env.PORT || 5000;


//connect to db
dbRoute=process.env.MONGO_URL;
mongoose.connect(dbRoute);
db=mongoose.connection;

db.once('open',()=>{
    console.log("Connected to the database")
  });
  
db.on('error',console.error.bind(console,'Connection to database failed'));
  
//Basic configuration
app.use(cors({optionsSuccessStatus: 200}));
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'/public')));

//API endpoints

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/users',(req,res)=>{
    const username=req.body.username;

    if(username===""||username===null){
        res.send("You submitted an empty usernames field")
    }else{
        let user = new User({username:username});

        user.save((err,userData)=>{
            if(err) return console.error(err);
            res.json({username:userData.username,_id:userData._id});
        });
    }
});

app.get('/api/users',(req,res)=>{
    User.find({},(err,users)=>{
        if(err) return console.log(err);
        let usersArr=[];
        console.log(users);
        users.forEach((user)=>{
            usersArr.push({username:user.username,_id:user._id});
        });
        res.send(usersArr);
    });
});

app.post('/api/users/:_id/exercises',(req,res)=>{
    const id=req.params._id;
    const descr=req.body.description;
    const dura=parseInt(req.body.duration);
    const date_string=req.body.date;
    
    let date=date_string===""
            ? moment().format("ddd MMM DD YYYY")
            : moment(date_string).format("ddd MMM DD YYYY");

    

    
        
    User.findById({_id:id},(err,user)=>{
        if(err) return console.log(err);
        user.log.push({
            description:descr,
            duration:dura,
            date:date
        });
        
        user.save();
        res.json({
            username:user.username,
            description:descr,
            duration:dura,
            date:date,
            _id:user._id
        })
         
        
    });
    
});

app.get('/api/users/:_id/logs',(req,res)=>{
    const id=req.params._id;
    const from=req.query.from;
    const to =req.query.to;
    const limit =req.query.limit;
    

    User.findOne({_id:id},(err,user)=>{
        if(err) return console.log(err);
        let fromDate=from? new Date(from):new Date(0);
        let toDate=to? new Date(to): new Date();
    
        fromDate=fromDate.getTime();
        toDate=toDate.getTime();

        if(limit){
            user.log=user.log.slice(0,parseInt(limit));
        }

        user.log.filter((item)=>{
            let itemDate=new Date(item.date).getTime()
            if(itemDate>=fromDate&&itemDate<=toDate){
                return item;
            }
            
        });

       
        let logData={
            username:user.username,
            count:user.log.length,
            log:user.log
        }

        res.json(logData);
        
    });

    
});
    


var listener=app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});