import mongoose from 'mongoose';
import { Password } from '../services/password';

// an interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes the properties
// that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties
// that a User document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  name: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // change _id to id
        ret.id = ret._id;
        delete ret._id;
        // delete password
        delete ret.password;
        // delete __v
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  // if the password is modified
  if (this.isModified('password')) {
    // hash the password
    const hashed = await Password.toHash(this.get('password'));
    // set the password to the hashed one
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

User.build({
  email: 'lkan',
  password: 'lkan',
});

export { User, UserAttrs };
