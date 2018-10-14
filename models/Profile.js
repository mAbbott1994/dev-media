const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  github: {
    type: String
  },
  experience: [
    {
      title: {
        type: String
      },
      comapany: {
        type: String
      },
      to: {
        required: true,
        type: Date
      },
      from: {
        type: Date
      }
    }
  ],
  website: String,
  education: {
    school: {
      required: true,
      type: String
    },
    degree: {
      type: String,
      required: true
    },
    subjects: [
      {
        name: String,
        required: true,
        description: {
          type: String,
          max: 200
        }
      }
    ],
    to: {
      required: true,
      type: Date
    },
    from: {
      type: Date
    }
  },
  social: [
    {
      instagram: String,
      twitter: String,
      facebook: String,
      linkedin: String
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Profile", ProfileSchema);
