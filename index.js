const express = require('express');
//const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;
const {Pool} = require('pg');
const router = express.Router();
const queries = require('./queries.js');

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Acess-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
})
// pools will use environment variables
// for connection information
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:true,
});

app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs");

const middlewares = [
    express.static(path.join(__dirname, 'public')),
]
app.use(middlewares)

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json()); // support json encoded bodies


app.get('/', async(req, res) => {
    
    try {
        const client = await pool.connect()
        var result =  await client.query('SELECT * FROM todos');

        if(!result){
            return res.send('No Data Found');
        }else {
            result.rows.forEach(row =>{
                console.log(row);
            });
        }
        res.render('index',{data: result.rows})

        client.release();

       // res.render('pages/')
    }catch(err){
        console.error(err);
        res.send("Error " + err);
    }

});


/** handles the case where taskname or username is changed */
app.put('/:id', async(req, res)=>{


    const id = req.params.id;
    const {task} = req.body;

    completed = true;
    if (task === 'todo-list')
        completed = false;
    try{
        const client = await pool.connect();
        var result = await client.query("UPDATE todos SET completed='"+completed+"'"+"WHERE id="+parseInt(id));

        if(!result){
            return res.send('On Drag Data not updated');
        }
        client.release();
   
    }catch(err){
        console.error(err);
        res.send("Error " + err);
    }

    res.redirect('/');
});


app.put('/task/edit/:id', async(req, res) =>{

    const id = req.params.id;
    const {taskName, username} = req.body.data;

    try{
        const client = await pool.connect();
        var result = await client.query("UPDATE todos SET username='"+username+"', todo='"+taskName+"'"+"WHERE id="+parseInt(id));

        if(!result){
            return res.send("Information update failed");
        }

        client.release();
    }catch(err){
        console.error(err);
        res.send("Error "+err);
    }

    res.redirect('/');
})


app.post('/task/create', async(req, res) => {
    
    const {taskName, username} = req.body.data;

    try{
        const client = await pool.connect();
        var result = client.query("INSERT INTO todos(username, todo, completed) values($1, $2, false)", [username, taskName]);
        if(!result){
            return res.send('New Task Not added')
        }
        client.release();
    
    }catch(err){
        console.error(err);
        res.send('Error '+err);
    }
    res.redirect('/');

    
});

app.delete('/task/delete/', async(req, res) =>{

    const {idNumber} = req.body;
    
    try{
        const client = await pool.connect();

        var result = client.query("DELETE FROM todos WHERE id = '"+parseInt(idNumber)+"'");

        if(!result){
            return res.send('DELETE UNSUCCESSFULL');
        }

        client.release();
    }catch(err){
        console.error(err);
        res.send('Error '+err);
    }

    res.redirect('/');


})
app.listen(PORT, function () {
    console.log('Example app listening on port '+PORT+'!');
   });
