import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountedPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['combo', 'discount', 'free-delivery', 'buy-one-get-one'],
  },
  terms: {
    type: String,
    required: true,
    trim: true,
  },
  maxUses: {
    type: Number,
    min: 0,
  },
  currentUses: {
    type: Number,
    default: 0,
    min: 0,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create index for search functionality
offerSchema.index({ title: 'text', description: 'text' });

// Add validation to ensure endDate is after startDate
offerSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);

export default Offer; 