const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
