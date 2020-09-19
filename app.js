let mysql = require('mysql');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db_config = {
  host: "readme.crmkq7ncuwo3.ap-northeast-2.rds.amazonaws.com",
  user: "readme",
  password: "readme1234",
  database: "readme"
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);


  connection.connect(function (err) {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);

    }
  })
  connection.on('error', function(err){
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
      handleDisconnect();
    } else {
      throw err;
    }
  })

}

handleDisconnect();

app.use('/notice', (req, res) => {
  let sql = 'SELECT  * FROM notice';

  connection.query(sql, function (err, result) {
    res.json({ notice: result });
  });
})

app.use('/new', (req, res) => {
  let sql = 'SELECT * FROM new';

  connection.query(sql, function(err, result){
    res.json({new: result});
  });
})

app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(5000, () => {
  console.log('server connected!')
})




// connection.connect(function (err) {
//   if (err) {
//     console.log('error when connecting to db:', err);
//     setTimeout(handleDisconnect,2000);

//   } else {

//     connection.query("SELECT * FROM pledge", function (err, rows, fields) {
//       console.log(rows);
//       connection.end();
//     })

//     app.use('/db', (req, res) => {
//       let sql = 'SELECT  * FROM pledge';

//       connection.query(sql, function (err, result) {
//         res.json({ pledge: result });
//       });
//     })
//   }
// });
