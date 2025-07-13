import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  people: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  confirmationMessage: {
    type: String,
    trim: true,
  },
  confirmedAt: {
    type: Date,
  },
  confirmedBy: {
    type: String,
    trim: true,
  },
  whatsappMessageId: {
    type: String,
    trim: true,
  },
  adminNotes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Create indexes for better performance
bookingSchema.index({ date: 1, time: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ phone: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking; 