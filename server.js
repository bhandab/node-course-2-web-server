const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname+'/views/partials')
app.set('view engine','hbs');

//next() is called here. seccond app.use works therefore
app.use((req, res, next)=>{
    var now = new Date().toString();
    var log = (`${now}: ${req.method} ${req.url}`);
    console.log(log);
    fs.appendFile('server.log',log+'\n',(err)=>{
        if (err){
            console.log(`Unable to append to server.log`);
        }
    });
    next();
});
/*
//without calling next() rest of the code after this middleware
//will not be executed
app.use((req, res, next)=>{
    res.render('maintenance.hbs');
});*/

//app.use creates middlware that lets you configure how
//your express app works
//Here it is creating a middleware that lets you serve
//a static file to the server
app.use(express.static(__dirname+'/public'));

hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text)=>{
    return text.toUpperCase();
})
//app.get sets up HTTP request handler
app.get('/',(req, res)=>{
    //res.send('<h1>Hello Express!</h1)');
    res.render('home.hbs',{
        pageTitle:'Home Page',
        welcomeMessage:'Welcome to my website'
    });
});

//
app.get('/about',(req, res)=>{
    res.render('about.hbs',{
       pageTitle:'About page',
    });
});

app.get('/bad',(req, res)=>{
    res.send({
        errorMessage:'Unable to handle request'
    });
});
app.listen(3000,()=>{
    console.log('Server is up on port 3000');
});