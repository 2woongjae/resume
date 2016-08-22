import mongoose from 'mongoose';
import { musicCategories } from '../../utils/staticData';

const musicSchema = new mongoose.Schema({
  categories: [{
    name: {
      type: String,
      required: true,
      enum: musicCategories
        .map(category => category.name)
    },
    newRank: {
      type: Number,
      default: 1
    },
    recRank: {
      type: Number,
      default: 1
    },
    hotRank: {
      type: Number,
      default: 1
    }
  }],
  newRank: {
    type: Number,
    default: 1
  },
  recRank: {
    type: Number,
    default: 1
  },
  hotRank: {
    type: Number,
    default: 1
  },
  title: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  singer: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: true
  },
  lyric: {
    type: String,
    default: ''
  },
  albumContents: [{
    type: String,
    required: true,
    validate: [(val) => val.length >= 8, '{PATH} exceeds the limit of 8']
  }],
  isRemoved: {
    // 삭제 플래그
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('music', musicSchema);
