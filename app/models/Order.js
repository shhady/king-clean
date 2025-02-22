import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [{
    id: String,
    name: String,
    nameAr: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: {
    type: Number,
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerInfo: {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    required: true
  },
  paymentInfo: {
    creditCard: String,
    expiryDate: String,
    cvv: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  customerType: {
    type: String,
    enum: ['user', 'visitor'],
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'customerType',
    required: true
  }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order; 