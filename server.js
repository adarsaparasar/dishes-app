require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Dish = require('./dishmodels');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.port;

app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.json());
app.use(cors());
const mongourl = process.env.url;
mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    io.on('connection', (socket) => {
      console.log('a user connected');
    });

    // Fetch all dishes
    app.get('/api/dishes', async (req, res) => {
      try {
        const dishes = await Dish.find({});
        res.json(dishes);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching dishes' });
      }
    });

    // Toggle the published status
    app.put('/api/dishes/:dishId/toggle', async (req, res) => {
      const { dishId } = req.params;
      try {
        const dish = await Dish.findOne({ dishId });
        if (dish) {
          dish.isPublished = !dish.isPublished;
          await dish.save();
          io.emit('dishUpdated', dish);
          res.json(dish);
        } else {
          res.status(404).send('Dish not found');
        }
      } catch (error) {
        res.status(500).json({ error: 'Error toggling dish status' });
      }
    });

    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });