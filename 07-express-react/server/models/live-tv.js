import mongoose from 'mongoose';
import {
  liveTvCategories, videoAges, liveTvChannels, liveTvBroadcasts
} from '../../utils/staticData';

const liveTvSchema = new mongoose.Schema({
  categories: [{
    name: {
      type: String,
      required: true,
      enum: liveTvCategories
        .map(category => category.name)
    },
    hotRank: {
      type: Number,
      default: 1
    }
  }],
  hotRank: {
    type: Number,
    default: 1
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  video: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    max: 5,
    required: true
  },
  age: {
    type: Number,
    required: true,
    enum: videoAges
  },
  story: {
    type: String,
    default: ''
  },
  director: [{
    type: String
  }],
  cast: [{
    type: String
  }],
  isNewTag: {
    type: Boolean,
    required: true
  },
  isHotTag: {
    type: Boolean,
    required: true
  },
  channel: {
    type: Number,
    required: true,
    enum: liveTvChannels
  },
  broadcast: {
    type: String,
    required: true,
    enum: liveTvBroadcasts
  },
  clip: [{
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    video: {
      type: String,
      required: true
    }
  }],
  relateContents: [{
    type: String,
    required: true,
    validate: [(val) => val.length >= 5, '{PATH} exceeds the limit of 5']
  }],
  isRemoved: {
    // 삭제 플래그
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('live-tv', liveTvSchema);
