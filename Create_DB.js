const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('findmybuys.db');


db.serialize(() => {

  // create a new database table:
  db.run("CREATE TABLE users (Uid INTEGER PRIMARY KEY, name TEXT NOT NULL, Fname TEXT NOT NULL, Mail TEXT NOT NULL, Phone TEXT NOT NULL, Password TEXT NOT NULL)");
  // insert First default user
  db.run("INSERT INTO users VALUES (2, 'Ran', 'Cohen', 'rcrancohen@gmail.com', '0526210822', '5129')");

  // print them out to confirm their contents:
  db.each("SELECT Uid, name, Fname, Mail, Phone, Password FROM users", (err, row) => {
      console.log(row);
  });

  // create a new database table:
  db.run("CREATE TABLE allbuys (BuyN INTEGER PRIMARY KEY, Descr TEXT NOT NULL, Pdate TEXT NOT NULL, Adate TEXT NOT NULL, SuppDetails TEXT NOT NULL, Status INTEGER NOT NULL, Uid INTEGER NOT NULL,FOREIGN KEY (Uid) REFERENCES users (Uid) )");

  db.run("INSERT INTO allbuys VALUES (1, 'New Item', '01012018', '01022018', 'Ebay', 1, 2)");

  db.each("SELECT BuyN , Descr, Pdate, Adate, SuppDetails, Status, Uid FROM allbuys", (err, row1) => {
  console.log(row1);
  });

  // create a new database table:
  db.run("CREATE TABLE user_id_gen (Uid INTEGER PRIMARY KEY)");
  // insert First default user
  db.run("INSERT INTO user_id_gen VALUES (2)");

  // print them out to confirm their contents:
  db.each("SELECT Uid FROM user_id_gen", (err, row2) => {
      console.log(row2);
  });


});

db.close();
