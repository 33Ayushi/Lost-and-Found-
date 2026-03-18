const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    item_name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    contact: {
      type: String,
      required: [true, 'Contact info is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
