const express = require('express')
const app = express()
const cors = require('cors')
var mysql = require('mysql');
const port = 4000

app.use(cors());
app.use(express.json())

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"pase"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/product' , (req , res)=>{

   const sql = 'insert into product set ?';
   con.query(sql , req.body , (err,result)=>{
    if(err){
       console.log(err);
    }
    else{
        res.send("successfully added")
    }
   })

})


app.post('/newUser',(req,res)=>{

  const data = req.body;

  const sql = 'insert into users set ?';
  con.query(sql,data,(err,result)=>{

    if(err){
      console.log(err);
    }
    else{
      res.send("success")
    }
  })
})


app.post('/admin' , (req,res)=>{

  const emailClient = req.body.email;
  const passwordClient = req.body.password;

  const sql = `select * from admin where email = '${emailClient}' && password = '${passwordClient}'`;

  con.query(sql,(err,result)=>{

    if(err) throw err;
    else{
        if(result.length>0){
          res.send(true)
        }
        else{
          res.send(false);
        }
    }
  })
})


app.get('/get' , (req , res) =>{

    const sql = 'select * from product';

    con.query(sql , (err , result)=>{

        if(err) throw err;
        else{
            res.send(result)
        }
    })
})

app.get('/singleProduct/:id' , (req,res)=>{

  const sql = `select * from product where id = '${req.params.id}'`;
  con.query(sql , (err , result) =>{
    if(err){

      throw err;
    }
    else{
      res.send(result)
    }
  })
})

app.get('/user/:user' , (req,res)=>{

  const sql = `select * from validuser where id = '${req.params.user}'`;
  con.query(sql , (err , result) =>{
    if(err){

      throw err;
    }
    else{
      res.send(result)
    }
  })
})

app.get('/users' , (req,res)=>{

  const sql = 'select * from users';

  con.query(sql , (err , result)=>{
    if(err) throw err;
    else{
      res.send(result)
    }
  })
})


app.post('/accept' , (req,res)=>{

  const user = req.body;

  const uid = req.body.id;
  const sql1 = 'insert into validuser set ?';
  con.query(sql1,user,(err,result)=>{

    if(err) throw err;
    else{
        const sql2 = `DELETE FROM users WHERE id= '${uid}'`;

        con.query(sql2,(err,result)=>{

          if(err) throw err;
          else{
            res.send(true)
          }
        })
    }
  })
  
})


app.get('/finduser/:id' , (req,res)=>{

  const id = req.params.id;
  console.log(id)

  const sql = `select * from validuser where id='${id}'`;

  con.query(sql,(err,result)=>{

    if(err) throw err;
    else{
      
      res.send(true);
    }
  })
})



app.delete('/reject/:id' ,(req,res)=>{

  const uid = req.params.id;
  const sql2 = `DELETE FROM users WHERE id= '${uid}'`;

  con.query(sql2 , (err , result)=>{
     if(err) throw err;
          else{
            res.send(true)
          }

  })

})


app.post('/cart' , (req,res)=>{

  const product = req.body[0];
  const id = req.body[1];

  var sql = `INSERT INTO cart (pid, uid) VALUES ("${product}", "${id}")`;

  con.query(sql,(err , result) =>{
    if(err) throw err;
    else{
      res.send(true);
    }
  })
})


app.get('/cartInfo/:id' , (req , res)=>{

  const sql = `select * from cart where uid = '${req.params.id}'`;

  con.query(sql,(err , result)=>{

    if(err) throw err;
    else{

      if(result.length === 1){
        res.send(true)
      }
      else{
        res.send(false)
      }
    }
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})