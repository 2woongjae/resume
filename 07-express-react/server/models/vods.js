import mongoose from 'mongoose';
import {
  vodCategories, videoAges, vodQualities
} from '../../utils/staticData';

const vodSchema = new mongoose.Schema({
  categories: [{
    name: {
      type: String,
      required: true,
      enum: vodCategories
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
    categories: [new mongoose.Schema({
      name: {
        type: String,
        required: true,
        enum: Array.from(new Set(
          vodCategories
            .map(category =>
              (category.subCategories || []).map(category => category.name)
            )
            .filter(category => category.length)
            .reduce((a, b) => a.concat(b))
        ))
      },
      newRank: {
        type: Number,
        default: 1
      },
      recRank: {
        type: Number,
        default: 1
      }
    })]
  }],
  newRank: {
    type: Number,
    default: 1
  },
  recRank: {
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
  isSaleTag: {
    type: Boolean,
    required: true
  },
  time: {
    // 분단위
    type: Number,
    required: true
  },
  thumbnails: [{
    type: String
  }],
  price: {
    type: String,
    required: true
  },
  quality: {
    type: String,
    required: true,
    enum: vodQualities
  },
  expirationDate: {
    type: Number,
    required: true
  },
  year: {
    type: Number
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

export default mongoose.model('vod', vodSchema);
