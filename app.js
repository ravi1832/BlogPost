var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var methodOverride=require('method-override');
var sanitizer=require('express-sanitizer');

//App config
mongoose.connect('mongodb+srv://[username]:[password]@firstcluster-qhq8d.mongodb.net/test?retryWrites=true&w=majority',{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true,useFindAndModify: false  });

app.use(methodOverride("_method"));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(sanitizer());

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body: String,
    created: {type:Date,default: Date.now}
});

var Blog=mongoose.model('Blog',blogSchema);


//Routes

app.get('/',function(req,res){
    res.redirect('/blogs');
})
app.get('/blogs',function(req,res){
    Blog.find({},function(err,Blogs){
        if(err){
            console.log('Error!');
        }
        else{
            res.render('index',{Blogs : Blogs});
        }
    });
   
});

app.get('/blogs/new',function(req,res){
    res.render('new');
})
app.post('/blogs',function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render('new');
        }
        else{
            res.redirect('/blogs');
        }
    })
})


app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,findBlog){
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.render('show',{blog:findBlog});
        }
    })
})

app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render('edit',{blog: foundBlog});
        }
    })
   
})

app.put('/blogs/:id',function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs/'+req.params.id);
        }
    })
})

app.delete('/blogs/:id',function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs');
        }
    })
})


app.listen(process.env.PORT || 3000,function(){
    console.log("Server started! ");
})
