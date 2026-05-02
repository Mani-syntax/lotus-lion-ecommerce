const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'editor', 'admin', 'super-admin'],
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: isAdmin (backwards compatibility)
userSchema.virtual('isAdmin').get(function () {
  return this.role === 'editor' || this.role === 'admin' || this.role === 'super-admin';
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isBcryptHash = typeof this.password === 'string' && this.password.startsWith('$2');
  if (isBcryptHash) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  // Legacy seed data used insertMany, which bypassed the save hook and left
  // local demo passwords unhashed. Allow one successful match, then the
  // caller's save() will run the hook and upgrade it to bcrypt.
  if (this.password === enteredPassword) {
    this.password = enteredPassword;
    return true;
  }

  return false;
};

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
