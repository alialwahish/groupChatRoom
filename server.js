const express = require('express');
const path = require('path')
const app=express();
app.use(express.static(__dirname+'/static'));

app.set('views',path.join(__dirname,'public'));
app.set('view engine','ejs');


const server=app.listen(8000);
const io = require('socket.io')(server);
var loggedUsers=[]
var prvChat='';


io.on('connection',function(socket){
    io.emit("logdUsers",loggedUsers);
    socket.emit('lodChat',prvChat);
    socket.on('new_user_in',function(data){
        
        user={name:data,
            id:socket.id}
        loggedUsers.push(user);
        socket.emit("sinUser",user.name);
        io.emit("logdUsers",loggedUsers)
        
    });

    socket.on('newMsg',function(msg){
        prvChat+=msg+"<br>";
        socket.broadcast.emit('dispMsg',msg);
    })

           


})


app.get('/',function(req,res){
    res.render('index',{data:loggedUsers})
})

