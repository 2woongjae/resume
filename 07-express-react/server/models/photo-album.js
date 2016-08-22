import mongoose from 'mongoose';

const photoAlbumSchema = new mongoose.Schema({
  group: {
    type: String,
    default: 'Family Album'
  },
  album: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  isNewTag: {
    type: Boolean,
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

export default mongoose.model('photoAlbum', photoAlbumSchema);
