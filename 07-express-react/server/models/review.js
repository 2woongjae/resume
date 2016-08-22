import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  vodId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    max: 5,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isRemoved: {
    // 삭제 플래그
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('review', reviewSchema);
