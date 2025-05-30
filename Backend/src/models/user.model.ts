import {Schema,model,Document} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export interface IUser extends Document {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  coverImage?: string;
  userSession?: Array<any>; // Adjust type as needed for user sessions
}

const SessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
  },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    device: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },

    // Add any other fields related to user sessions as needed
});

const userSchema = new Schema<IUser>({
 
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Exclude password from queries by default
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    userSession: []
}, {
  timestamps: true,
});

userSchema.pre<IUser>("save", async function ( next) {
  // Hash the password before saving the user model
    if (this.isModified("password")) {
        // Use a hashing function here, e.g., bcrypt
         const saltRounds: number = 10;

        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // Compare the provided password with the hashed password
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function (sessionId : string): string {
  // Generate a JWT token for the user
  const payload = {
    id: this._id,
    email: this.email,
    sessionId: sessionId, 
  };
  const secretKey = process.env.JWT_SECRET || "your_jwt_secret"; // Use your secret key
  const options = { expiresIn: "1d" }; // Token expiration time

  return jwt.sign(payload, secretKey, options);
};

userSchema.methods.generateRefreshToken = function (sessionId : string): string {
  // Generate a refresh token for the user
  const payload = {
    id: this._id,
    email: this.email,
    sessionId: sessionId, 
  };
  const secretKey = process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret"; // Use your refresh secret key
  const options = { expiresIn: "7d" }; // Refresh token expiration time
    return jwt.sign(payload, secretKey, options);
};

export const UserModel = model<IUser>("UserModel", userSchema);