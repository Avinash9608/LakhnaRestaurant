import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  customerImage: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  orderId: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'service', 'ambiance', 'overall'],
  },
  cloudinaryId: {
    type: String,
  },
}, {
  timestamps: true,
});

// Create index for search functionality
reviewSchema.index({ customerName: 'text', review: 'text', customerEmail: 'text' });

// Add validation to ensure rating is between 1 and 5
reviewSchema.pre('save', function(next) {
  if (this.rating < 1 || this.rating > 5) {
    next(new Error('Rating must be between 1 and 5'));
  }
  next();
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review; 