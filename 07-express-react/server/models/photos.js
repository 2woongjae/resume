import mongoose from 'mongoose';

const photosSchema = new mongoose.Schema({
  group: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: true
  },
  thumb: {
    type: String,
    required: true
  },
  image: {
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

export default mongoose.model('photos', photosSchema);
