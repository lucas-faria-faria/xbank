const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // conversao JSON **

// Configurando BD
const dbConfig = require('./config/database.config.js');
//const mongoose = require('mongoose');

/*mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Sucesso ao conectar no Banco de Dados");    
}).catch(err => {
    console.log('Falha ao conectar no Banco de Dados. Saindo agora...');
    process.exit();
});*/

const MongoClient = require('mongodb').MongoClient;
var db

MongoClient.connect('mongodb://admin:1q2w3e4r@ds113942.mlab.com:13942/contasbanco', (err, client) => {
  if (err) return console.log(err)
  db = client.db('contasbanco')
  app.listen(3000, () => {
    console.log('Servidor Rodando na porta 3000')
  })
})

// --- ROTAS ---//
app.post('/addTransaction', (req, res) => {
  db.collection('transactions').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('Registro Salvo no BD')
    res.redirect('/success')
  })
})

app.post('/add', (req, res) => {
  db.collection('clientes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('Registro Salvo no BD')
    res.redirect('/success')
  })
})

app.get('/', (req,res) => {
  res.render('home.ejs')
})

app.get('/success', (req,res) => {
    res.render('success.ejs')
})

app.get('/cadastro', (req,res) => {
  res.render('cadastro.ejs')
})

app.get('/transaction', (req,res) => {
  db.collection('clientes').find().toArray(function(err, results) {
    console.log(results)
    res.render('transactions.ejs',{clientes: results})
})
});

app.get('/extratos', (req,res) => {
  db.collection('clientes').find().toArray(function(err, results) {
    console.log(results)
    res.render('extratos.ejs',{clientes: results})
})
});

app.get('/extratos/cc', function(req,res){
  var cc = req.params.cc;  
  db.collection('clientes').find({account:"'"+cc+"'"}).toArray(function(err, result) {
    console.log(result)
    console.log("'"+cc+"'")
    res.render('extratosId.ejs',{extrato: result})    
})
});

app.get('/saldos', (req,res) => {
  db.collection('clientes').find().toArray(function(err, results) {
  console.log(results)
  res.render('saldos.ejs',{clientes: results})  
});

});

app.get('/relatorios', (req,res) => {
  db.collection('transactions').find().toArray(function(err, results) {
  console.log(results)
  res.render('relatorios.ejs',{transactions: results})  
});

});
app.set('view engine', 'ejs')

// Require Notes routes
require('./app/routes/note.routes.js')(app)

