const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('your-stripe-secret-key'); // Replace with your Stripe secret key

// Create or update cart
router.post('/cart', async (req, res) => {
  const { items } = req.body;
  let totalAmount = 0;

  try {
    // Calculate total amount
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
      totalAmount += menuItem.price * item.quantity;
    }

    const token = uuidv4();

    // Create or update cart
    const cart = await Cart.findOneAndUpdate(
      { token },
      { items, totalAmount, token },
      { new: true, upsert: true }
    );

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Process payment
router.post('/cart/payment', async (req, res) => {
  const { token, paymentMethodId } = req.body;

  try {
    const cart = await Cart.findOne({ token });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Process payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.totalAmount * 100, // Amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    res.json({ success: true, paymentIntent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
