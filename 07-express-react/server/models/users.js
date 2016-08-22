import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Promise from 'bluebird';

const userSchema = new mongoose.Schema({
  email_address: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  access_token: String
}, {
  timestamps: true
});

const SALT_WORK_FACTOR = 10;
userSchema.pre('save', function(next) {
  var user = this;
  // 패스워드 새로 만들때나 변경시가 아니면 리턴
  if (!user.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  user.password = bcrypt.hashSync(user.password, salt);
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

export default mongoose.model('users', userSchema);
