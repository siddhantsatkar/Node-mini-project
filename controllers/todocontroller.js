var bodyparser = require('body-parser');
var mongoose = require('mongoose');

//Connect to db
mongoose.connect('mongodb://test:test@ds121980.mlab.com:21980/todo-sid');

//Create a schema(like a blueprint)
var todoSchema = new mongoose.Schema({
    item: String
});

//Create model
var Todo = mongoose.model('Todo', todoSchema);

//Create item of the model type (no need for predefined data in db)
/*var itemOne = Todo({item: 'Buy flowers'}).save(function(err){
    if (err) throw err;
    console.log('item saved');
});*/

//var data = [{item: 'get milk'},{item: 'do coding'}, {item: 'apply for jobs'}]; //Dont need predefined data in server
var urlencodedparser = bodyparser.urlencoded({extended: false});
module.exports = function(app){

    app.get('/todo', function(req, res){
        //get data from mongo db and pass it to the view
        Todo.find({}, function(err, data){//Blank quotes inside means to select all itmes present in the db. To select a particular item, write find({item: 'something'})
            if (err) throw err;
            res.render('todo', {todos: data});
        }); 
        
    });

    app.post('/todo',urlencodedparser, function(req, res){
        //get data from the view and add it to monogdb
        var newTodo = Todo(req.body).save(function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });

    app.delete('/todo/:item', function(req, res){
        //delete the requested item from mognodb
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });
};