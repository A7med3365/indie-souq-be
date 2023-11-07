import mongoose from 'mongoose';
import { User } from './user';

interface ProjectAttrs {
  title: string;
  creator: mongoose.Types.ObjectId;
}

interface Reward {
  title: string;
  subtitle: string;
  fund: number;
  bulletin: string[];
}

interface ProjectDoc extends mongoose.Document {
  title: string;
  isDetailsComplete: boolean;
  isPublished: boolean;
  creator: mongoose.Types.ObjectId;
  type: string;
  genre: string[];
  poster: string;
  details: {
    goal: number;
    raised: number;
    stage: string;
    endOfCampaign: string;
    media: string[];
    story: string;
    rewards: Reward[];
  };
}

interface ProjectModel extends mongoose.Model<ProjectDoc> {
  build(attrs: ProjectAttrs): ProjectDoc;
}

const rewardSchema = new mongoose.Schema<Reward>({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  fund: {
    type: Number,
  },
  bulletin: {
    type: [String],
  },
});

const projectSchema = new mongoose.Schema<ProjectDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    isDetailsComplete: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
    },
    genre: {
      type: [String],
    },
    poster: {
      type: String,
    },
    details: {
      goal: {
        type: Number,
      },
      raised: {
        type: Number,
        default: 0,
      },
      stage: {
        type: String,
      },
      endOfCampaign: {
        type: String,
      },
      media: {
        type: [String],
      },
      story: {
        type: String,
      },
      rewards: {
        type: [rewardSchema],
      },
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

projectSchema.statics.build = (attrs: ProjectAttrs) => {
  return new Project(attrs);
};

const Project = mongoose.model<ProjectDoc, ProjectModel>(
  'Project',
  projectSchema
);

export { Project };
