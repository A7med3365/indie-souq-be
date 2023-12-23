import mongoose from 'mongoose';
import { Password } from '../services/password';

// an interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isFilmmaker: boolean;
  isAdmin: boolean;
}

// an interface that describes the properties
// that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties
// that a User document has
interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
  isFilmmaker: boolean;
  isAdmin: boolean;
  location: string;
  languages: string[];
  avatar: string;
  banner: string;
  bio: string;
  tags: string[];
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'User',
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isFilmmaker: {
      type: Boolean,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    location: {
      type: String,
      default: 'Bahrain',
    },
    languages: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
      default: '',
    },
    banner: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
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

// User.build({
//   email: 'lkan',
//   password: 'lkan',
// });

export { User, UserAttrs };
