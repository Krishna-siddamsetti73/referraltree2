import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },

    isYTMember: { type: Boolean, default: false },
    hasPaid1Rupee: { type: Boolean, default: false },

    upiHash: { type: String, default: '' },

    predecessor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    successors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    referralLink: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
