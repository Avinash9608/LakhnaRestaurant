import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  contact: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  code: { 
    type: String, 
    required: true,
    unique: true
  },
  used: { 
    type: Boolean, 
    default: false 
  },
  discountPercentage: {
    type: Number,
    default: 10
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Code expires in 30 days
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Create index for faster lookups
discountSchema.index({ contact: 1 });
discountSchema.index({ code: 1 });
discountSchema.index({ expiresAt: 1 });

const Discount = mongoose.models.Discount || mongoose.model('Discount', discountSchema);

export default Discount; 