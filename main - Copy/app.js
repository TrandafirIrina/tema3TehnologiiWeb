const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storate: 'homework.db'
})

const Student = sequelize.define('student', {
  name: Sequelize.STRING,
  address: Sequelize.STRING,
  age: Sequelize.INTEGER
}, {
  timestamps: false
})

const app = express()
app.use(bodyParser.json())

app.listen(3000, ()=>{
  console.log('The server is running on port 3000')
})

app.get('/create', async (req, res) => {
  try {
    await sequelize.sync({ force: true })
    for (let i = 0; i < 10; i++) {
      const student = new Student({
        name: 'name ' + i,
        address: 'some address on ' + i + 'th street',
        age: 30 + i
      })
      await student.save()
    }
    res.status(201).json({ message: 'created' })
  } catch (err) {
    console.warn(err.stack)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/students', async (req, res) => {
  try {
    const students = await Student.findAll()
    res.status(200).json(students)
  } catch (err) {
    console.warn(err.stack)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/students', async (req, res) => {
  try {
    // TODO
    /*Dacă s-a trimis un request cu un corp gol sau nedefinit, se va returna un json cu următorul 
    format: {"message": "body is missing"}. Codul de răspuns va fi: 400; (0.5 pts)
    Dacă din corpul request-ului lipsesc proprietăți se va returna un json cu următorul format: 
    {"message": "malformed request"}. Codul de răspuns va fi: 400; (0.5 pts)
    Vârsta trebuie să fie un număr pozitiv; în caz contrar se va returna un json cu următorul format: 
    {"message": "age should be a positive number"}. Codul de răspuns va fi: 400; (0.5 pts)
    Dacă studentul trimis prin corpul request-ului este valid, va fi adăugat și se va returna un 
    răspuns cu codul 201. Corpul răspunsului va fi {"message": "created"};(0.5 pts)
    Dacă se face un request GET /students corpul răspunsului trebuie să conțină 11 students, 
    inclusiv cel adăugat anterior; (0.5 pts)*/ 
    /*name: Sequelize.STRING,
  address: Sequelize.STRING,
  age: Sequelize.INTEGER*/
    if(typeof(req.body) == undefined || Object.keys(req.body).length === 0){
      return res.status(400).json({message: "body is missing"});
    }else if(typeof(req.body.name)== undefined || typeof(req.body.address)== undefined || typeof(req.body.age)
    == undefined || Object.keys(req.body).length !== 3){
      return res.status(400).json({message: "malformed request"})
    }else if(req.body.age < 0){
      return res.status(400).json({message:"age should be a positive number"})
    }else {
      const student = await Student.create(req.body);
      res.status(201).json({message:"created"})
    }
  } catch (err) {
    console.warn(err.stack)
    res.status(500).json({ message: 'server error' })
  }
})

module.exports = app
