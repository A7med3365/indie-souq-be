import mongoose from 'mongoose';
import { User } from './user';
import { Project } from './project';

interface FundAttrs {
  chargeId: string;
  amount: number;
  user: string;
  project: string;
  status: string;
}

export interface FundDoc extends mongoose.Document {
  chargeId: string;
  amount: number;
  user: mongoose.Schema.Types.ObjectId;
  project: mongoose.Schema.Types.ObjectId;
  status: string;
}

interface ProjectModel extends mongoose.Model<FundDoc> {
  build(attrs: FundAttrs): FundDoc;
}

const fundSchema = new mongoose.Schema<FundDoc>(
  {
    chargeId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

fundSchema.statics.build = (attrs: FundAttrs) => {
  return new Fund(attrs);
};

const Fund = mongoose.model<FundDoc, ProjectModel>('Fund', fundSchema);

export { Fund };
