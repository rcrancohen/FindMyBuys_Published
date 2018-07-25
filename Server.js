const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('findmybuys.db');


app.set('view engine', 'ejs');
app.use(express.static('./public'));


//************************Wellcome server functions****************************************
//URL default Findmybuys
  app.get('/', (req, res) => {
      res.sendFile(__dirname+'/views/Welcome.html');
    });
//URL /Wellcome
  app.get('/welcome', (req, res) => {
      res.sendFile(__dirname+'/views/Welcome.html');
    });
//URL /wellcome:mail - Return Mail user from DB
  app.get('/Welcome/:mail', (req, res) => {
    const nameToLookup = req.params.mail; // matches ':userid' above

      console.log(nameToLookup);
      // db.all() fetches all results from an SQL query into the 'rows' variable:
      db.all(
        'SELECT * FROM users WHERE mail=$mail',
        // parameters to SQL query:
        {
          $mail: nameToLookup
        },
        // callback function to run when the query finishes:
        (err, rows) => {
          console.log(rows);
          if (rows.length > 0) {
            res.send(rows[0]);
          } else {
            res.send({}); // failed, so return an empty object instead of undefined
          }
        }
      );
    });
//**********************************************************************************************
//**********************************************************************************************

//************************MyBuys server functions****************************************
//URL /mubuys
  app.get('/mybuys', (req, res) => {
      res.render(__dirname +'/views/MyBuys.ejs');
    });

//URL /mybuys:Uid - Return User ID user from DB
      app.get('/mybuys/:Uid', (req, res) => {
        const nameToLookup = req.params.Uid; // matches ':userid' above

          console.log(nameToLookup);
          // db.all() fetches all results from an SQL query into the 'rows' variable:
          db.all(
            'SELECT * FROM allbuys WHERE Uid=$Uid',
            // parameters to SQL query:
            {
              $Uid: nameToLookup
            },
            // callback function to run when the query finishes:
            (err, rows) => {
              db.all(
                'SELECT * FROM users WHERE Uid=$Uid',
                // parameters to SQL query:
                {
                  $Uid: nameToLookup
                },
                // callback function to run when the query finishes:
                (err, rows1) => {

                  var data = {
                                BuysData: rows,
                                UserData: rows1
                              };
                  res.render(__dirname+'/views/MyBuys.ejs',{Data: data});
                }
              );
            }
          );
      //  res.render(__dirname+'/views/MyBuys.ejs', {BuysData: temprows}, {UserData: temprows1});

        });
//**********************************************************************************************
//**********************************************************************************************



//************************SignUp server functions****************************************
    app.get('/signup', (req, res) => {
        res.sendFile(__dirname+'/views/SignUp.html');
      });
//************************** Post data to data-base************************
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // hook up with your app

      app.post('/signup', (req, res) =>
      {
        var DB_UID;
        //TODO - add capability to get last aviable ID number from data base
        db.all(
          'SELECT * FROM user_id_gen',
          // callback function to run when the query finishes:
          (err, rows) => {
            console.log(rows);
            DB_UID = rows[0];
          }
        );
        DB_UID++;
      db.run(
          'INSERT INTO users VALUES ($Uid, $name, $Fname, $Mail, $Phone, $Password)',
          // parameters to SQL query:
          {
            $Uid: DB_UID,
            $name: req.body.name,
            $Fname: req.body.Fname,
            $Mail: req.body.Mail,
            $Phone: req.body.Phone,
            $Password: req.body.Password
          },

          'INSERT INTO user_id_gen VALUES ($DB_UID)',
          // parameters to SQL query:
          {
            $Uid: DB_UID,
          },

          db.each("SELECT Uid, name, Fname, Mail, Phone, Password FROM users", (err, row1) => {
            console.log(row1);
          }),

          (err) => {
            if (err) {
              res.send({message: 'error in app.post(/SignUp)'});
            } else {
              res.send({message: 'successfully run app.post(/SignUp)'});
            }
          }

      );
      });

//**********************************************************************************************



// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
