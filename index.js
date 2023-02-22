const express = require('express')
const app = express()
const cors = require('cors')
const SSLCommerzPayment = require('sslcommerz-lts')
var mysql = require('mysql');
const port = 4000

app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000/'
// }))
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

  //payment

const id = 'pase63f54765b0185';
const password = 'pase63f54765b0185@ssl';
const sslcz = new SSLCommerzPayment(id,password, false);




app.get('/', (req, res) => {
  res.send('Hello World!')
})




/*call the get api for all products information
this is going to the products component
*/
app.get('/get/:option' , (req , res) =>{

  const op = req.params.option;
  console.log(typeof(op))
  if(op === '0'){

    const sql = 'select * from product';
    con.query(sql , (err , result)=>{

      if(err) throw err;
      else{
          res.send(result)
      }
  })
  }

  else{
  const sql = `select * from product where option = '${req.params.option}'`;

   con.query(sql , (err , result)=>{

      if(err) throw err;
      else{
          res.send(result)
      }
  })
}

})


app.get('/multipleProduct/:data' , (req,res)=>{

  //console.log(req.params.data)
  const sql = `select * from product where category = '${req.params.data}'`;
   con.query(sql , (err , result) =>{
    if(err){

      throw err;
    }
    else{
      //console.log(result)
      res.send(result)
    }
  })
})


  //call singleProduct api with id for single product Information
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


   /*
       call this api for user have product or not
       Yes --> valid true 
       No --> valid false

       true --> user can not add product in his/her cart
    */
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


 //new user information will go newUser api for saved in database
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

  //check here user is valid or not form database from valid user
  app.get('/finduser/:id' , (req,res)=>{

    const id = req.params.id;
   
  
    const sql = `select * from validuser where id='${id}'`;
  
    con.query(sql,(err,result)=>{
  
      if(err) throw err;
      else{
        
        res.send(true);
      }
    })
  })



// app.post('/product' , (req , res)=>{

//    const sql = 'insert into product set ?';
//    con.query(sql , req.body , (err,result)=>{
//     if(err){
//        console.log(err);
//     }
//     else{
//         res.send("successfully added")
//     }
//    })

// })



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




app.get('/cart' , (req,res)=>{

  const sql = 'select * from cart';

  con.query(sql , (err , result)=>{

    if(err) throw err;
    else{
      res.send(result)
    }
  })
})


app.post('/userproduct' , (req , res)=>{

  const data = req.body;

  const sql = 'insert into userproduct set ?';
  con.query(sql,data,(err,result)=>{

    if(err){
      console.log(err);
    }
    else{
      res.send("success")
    }
  })
})


app.get('/userproduct' , (req , res) =>{

  const sql = 'select * from userproduct';

  con.query(sql,(err , result)=>{

    if(err) throw err;
    else{
     res.send(result)
    }
  })
})

app.get('/category/:data',(req,res)=>{

  //.log(req.params.data)
})

app.post('/taka' , (req , res)=>{

  const email = req.body.email;
  const money = req.body.memberTaka;

  const sql = `update validuser set taka='${money}' where email = '${email}'`;
  con.query(sql,(err , result)=>{

    if(err) throw err;
    else{
     res.send(result)
    }
  })
})




app.get('/create-session/:data', (req, res) => {

  const arr = req.params.data.split(',');
  const email = arr[0];
  const money = arr[1];
  const taka = arr[2]
  const number = arr[3];
  const data = {
    total_amount: taka,
    currency: 'BDT',
    tran_id: 'REF123', // use unique tran_id for each api call
    success_url: 'http://localhost:4000/ssl-payment-success',
    fail_url: 'http://localhost:3000/ssl-payment-fail',
    cancel_url: 'http://localhost:3000/ssl-payment-cancel',            
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: email,
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: number,
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
};

  
  const sql = `update validuser set taka='${money}' where email = '${email}'`;
  con.query(sql,(err , result)=>{

    if(err) throw err;
    else{
     //res.send(result)
     sslcz.init(data).then(apiResponse => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL
      // res.writeHead(301, {
      //   Location: GatewayPageURL
      // }).end();
    // 
    
    //res.send(GatewayPageURL)
      res.send({GatewayPageURL})
     // res.redirect(GatewayPageURL)
      //console.log('Redirecting to: ', GatewayPageURL)
  });
    }
  })
})


app.post("/ssl-payment-notification", async (req, res) => {

  /** 
  * If payment notification
  */

  return res.status(200).json(
    {
      data: req.body,
      message: 'Payment notification'
    }
  );
})

app.post("/ssl-payment-success", async (req, res) => {

  /** 
  * If payment successful 
  */

  // return res.status(200).json(
  //   {
  //     data: req.body,
  //     message: 'Payment success'
  //   }
  // );

  return res.redirect('http://localhost:3000/profile');
})

app.post("/ssl-payment-fail", async (req, res) => {

  /** 
  * If payment failed 
  */

  // return res.status(200).json(
  //   {
  //     data: req.body,
  //     message: 'Payment failed'
  //   }
  // );
  return res.redirect('http://localhost:3000/profile');
})

app.post("/ssl-payment-cancel", async (req, res) => {

  /** 
  * If payment cancelled 
  */

  // return res.status(200).json(
  //   {
  //     data: req.body,
  //     message: 'Payment cancelled'
  //   }
  // );

  return res.redirect('http://localhost:3000/profile');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})