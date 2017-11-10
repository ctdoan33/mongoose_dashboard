var express=require("express");
var app=express();
var path=require("path");
app.use(express.static(path.join(__dirname, "./static")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/dog_dashboard");
var DogSchema=new mongoose.Schema({
	name: {type: String, required: true},
	breed: {type: String, required: true}
});
mongoose.model("Dog", DogSchema);
var Dog=mongoose.model("Dog");

app.get("/", function(req, res){
	Dog.find({}, function(err, dogs){
		if(err){
			dogs=[];
		}
		res.render("index", {dogs:dogs});
	});
});

app.get("/dogs/new", function(req, res){
	dog=new Dog();
	res.render("new", {dog: dog, errors: {}});
});

app.get("/dogs/:id", function(req, res){
	Dog.findOne({_id: req.params.id}, function(err, dog){
		if(err){
			res.redirect("/");
		}else{
			res.render("show", {dog:dog});
		};
	});
});

app.post("/dogs", function(req, res){
	var dog=new Dog({name: req.body.name, breed: req.body.breed});
	dog.save(function(err){
		if(err){
			res.render("new", {dog: dog, errors: dog.errors});
		}else{
			res.redirect("/dogs/"+dog._id);
		}
	});
});

app.get("/dogs/edit/:id", function(req, res){
	Dog.findOne({_id: req.params.id}, function(err, dog){
		if(err){
			res.redirect("/");
		}else{
			res.render("edit", {dog:dog, errors: {}});
		}
	});
});

app.post("/dogs/:id", function(req, res){
	Dog.findOne({_id: req.params.id}, function(err, dog){
		if(err){
			res.redirect("/");
		}else{
			dog.name=req.body.name;
			dog.breed=req.body.breed;
			dog.save(function(err){
				if(err){
					res.render("edit", {errors: dog.errors});
				}else{
					res.redirect("/dogs/"+req.params.id);
				};
			});
		};
	});
});

app.post("/dogs/destroy/:id", function(req, res){
	Dog.remove({_id: req.params.id}, function(err){
		res.redirect("/");
	});
});

app.listen(6789, function(){
    console.log("listening on port 6789");
});