import mongoose from 'mongoose';

const popularItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  dataAiHint: {
    type: String,
    required: [true, 'AI Hint is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create text index for search functionality
popularItemSchema.index({ name: 'text', description: 'text' });

const PopularItem = mongoose.models.PopularItem || mongoose.model('PopularItem', popularItemSchema);

export default PopularItem; 