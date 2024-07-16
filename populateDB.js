require('dotenv').config();
const mongoose = require('mongoose');
const Dish = require('./dishmodels');

const sampleData = [
    {
        "dishName": "Jeera Rice",
        "dishId": "1",
        "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/jeera-rice.jpg",
        "isPublished": true
    },
    {
        "dishName": "Paneer Tikka",
        "dishId": "2",
        "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/paneer-tikka.jpg",
        "isPublished": true
    },
    {
        "dishName": "Rabdi",
        "dishId": "3",
        "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/rabdi.jpg",
        "isPublished": true
    },
    {
        "dishName": "Chicken Biryani",
        "dishId": "4",
        "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/chicken-biryani.jpg",
        "isPublished": true
    },
    {
        "dishName": "Alfredo Pasta",
        "dishId": "5",
        "imageUrl": "https://nosh-assignment.s3.ap-south-1.amazonaws.com/alfredo-pasta.jpg",
        "isPublished": true
    }
];



const mongourl = process.env.url;


mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const promises = sampleData.map(dishData => {
      const dish = new Dish(dishData);
      return dish.save().then(savedDish => {
        console.log(`Saved: ${savedDish.dishName}`);
      }).catch(error => {
        console.error(`Error saving ${dishData.dishName}:`, error);
      });
    });

    return Promise.all(promises);
  })
  .then(() => {
    console.log('All dishes saved');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
