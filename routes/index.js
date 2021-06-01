var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

// mongoose set up and database connection
const connectionPath =
  'mongodb+srv://------------:----------@cluster0.ysfmd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

router.use(express.json());
mongoose.connect(
  connectionPath,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) {
      console.log('Database connection succesful');
    }
  }
);

// database Schema files
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connectio error!'));
const Schema = mongoose.Schema;
const agentModel = new Schema({
  name: String,
  email: String,
  country: String,
  rank: String,
  status: Boolean,
});

var Agent = mongoose.model('Agent', agentModel);

// application routes || request and response functions
router.post('/agents', (req, res) => {
  const reqBody = req.body;
  Agent.create(
    {
      name: reqBody.name,
      email: reqBody.email,
      country: reqBody.country,
      rank: reqBody.rank,
      status: reqBody.status,
    },
    (err, newAgent) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        return res
          .status(200)
          .json({ message: 'New Agent created!!!', newAgent });
      }
    }
  );
});

router.get('/agents', (req, res) => {
  Agent.find({}, (err, allAgents) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else if (allAgents.length === 0) {
      return res.status(404).json({ message: 'No Agent Found!!!' });
    } else {
      return res.status(200).json({ message: 'Agents Found!!!', allAgents });
    }
  });
});
router.get('/agents/:id', (req, res) => {
  Agent.findById(req.params.id, (err, agent) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else if (!agent) {
      return res.status(404).json({ message: 'No Agent Found!!!' });
    } else {
      return res.status(200).json({ agent });
    }
  });
});
router.delete('/agents/:id', (req, res) => {
  Agent.findById(req.params.id, (err, agent) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else if (!agent) {
      return res.status(404).json({ message: 'No Agent Found!!!' });
    } else {
      agent.delete();
      return res.status(200).json({ message: 'Agents deleted!!!' });
    }
  });
});

router.put('/agents/:id', (req, res) => {
  Agent.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      country: req.body.country,
      rank: req.body.rank,
      status: req.body.status,
    },
    (err, agent) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else if (!agent) {
        return res.status(404).json({ message: 'No Agent Found!!!' });
      } else {
        agent.save((err, agent) => {
          if (err) return res.status(400).json({ message: err });
          return res.status(404).json({ message: 'No Agent Found!!!' });
        });
        return res.status(200).json({ message: 'Updated Agent Record' });
      }
    }
  );
});
/* GET home page. */
router.get('/', function (req, res) {
  res.send('Hello Wolrd');
});

module.exports = router;
