import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  dataAiHint: {
    type: String,
    required: true,
    trim: true,
  },
  ingredients: [{
    type: String,
    trim: true,
  }],
  category: {
    type: String,
    required: true,
    enum: ['Burgers', 'Sandwiches', 'Sides', 'Beverages', 'Desserts', 'Appetizers', 'Main Courses'],
  },
  modelColor: {
    type: String,
    required: true,
    default: '#3B82F6',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create index for search functionality
menuItemSchema.index({ name: 'text', description: 'text', ingredients: 'text' });

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

export default MenuItem; 