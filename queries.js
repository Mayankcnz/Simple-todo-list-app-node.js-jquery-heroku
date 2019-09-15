const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: 'Vuw300384272',
    port: '5432',
});

const getTasks = async(request, response)=>{

    console.log('coming')

    try{
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM todos'); 
        
    if(!result)
        return response.send('No Data Found')
    
        console.log('here');
        response.status(200).json(results.rows)
        client.release();

    }catch (err){
        console.error(err);
        response.send('Error '+err);
    }
}

const createTask = async(request, response) =>{
    const {username, todo} = request.body

    }

const updateTodo = async(request, response) =>{
    const id = parseInt(request.params.id)
    const {username, todo} = request.body

    try {
        const client = await pool.connect();
        client.query("UPDATE todos SET username = $username, todo = $todo WHERE id = $id",[id, username, todo], function(err, result) {
            if(err)
                return response.send('UPDATE FAILED!');
            

            response.status(201).json(result)
            client.release();
        
    })}catch (err){
        console.error(err);
        response.send('Error '+err);
    }
}

const deleteTask = async(request, response) =>{
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM todos WHERE id = $1', [id], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Task deleted with ID: ${id}`)
      })
    }


    module.exports = {
        getTasks,
        createTask,
        updateTodo,
        deleteTask
    }