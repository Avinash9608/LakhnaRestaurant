import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema({
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
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'restaurant', 'chef', 'ambiance'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  altText: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  cloudinaryId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Create index for search functionality
galleryItemSchema.index({ title: 'text', description: 'text', tags: 'text' });

const GalleryItem = mongoose.models.GalleryItem || mongoose.model('GalleryItem', galleryItemSchema);

export default GalleryItem; 