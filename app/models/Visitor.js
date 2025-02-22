import mongoose from 'mongoose';
import Order from './Order';
const visitorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
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
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  lastOrderDetails: {
    fullName: String,
    phone: String,
    address: String,
    city: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
visitorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create a unique compound index on email and phone
visitorSchema.index({ email: 1, phone: 1 }, { unique: true });

const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);

export default Visitor; 