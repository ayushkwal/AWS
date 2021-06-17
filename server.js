
const express = require('express');
const app = express();
// const {save} = require('./dynamo/write')
const insert = require('./dynamo/insert')
const bodyParser = require('body-parser');



// app.use(express.json())
app.set('view engine', 'ejs');
app.set('views', 'views');





app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


class InMemoryFriends {
  constructor() {
      this.list = [];
  }

  add(name) {
      this.list.push(name);
  }

  getAll() {
      return this.list;
  }
}
const friendsList = new InMemoryFriends();









app.get('/', (req, res) => {
  res.render('index', {personList: friendsList.getAll()});
});


app.get('/home1',(req,res)=>{
  console.log('hi')
  res.send('aa')
})

app.get('/home2',(req,res)=>{
  console.log('home page ifr');
  res.send('hhhhhhhhhhhhh')
})


app.post('/submit', (req, res) => {
  friendsList.add(req.body.friendName);
  res.render('person-added', { personName: req.body.friendName, personList: friendsList.getAll() });
});


app.post('/submitmsg',(req,res)=>{
  console.log(req.body);
  console.log('hello got to server');
  // res.json({data:'data sent'});
  res.send('hllerwlld');

})




module.exports = app;










// app.post('/joincommunity',insert.save)





