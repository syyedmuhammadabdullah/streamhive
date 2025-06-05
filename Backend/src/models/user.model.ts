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
  userSession: Array<any>; // Adjust type as needed for user sessions
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  is2faEnabled?: boolean;
  totpSecret?: string; // Field for storing TOTP secret if 2FA is enabled
  
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(sessionId: string): string;
  generateRefreshToken(sessionId: string): string;
  generateSessionCleanupToken(sessionId: string): string;
}

const sessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
  },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    os: {
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
    passwordResetToken: {
        type: String,
    },
  passwordResetExpires: {
    type: Date,
  },
  is2faEnabled: {
    type: Boolean,
    default: false, // Default to false, can be set to true when 2FA is enabled
  },
  totpSecret: {
    type: String,
    // This field will store the TOTP secret if 2FA is enabled
  },
  // Add any other fields related to user profile as needed
    userSession: [sessionSchema], // Array of sessions for the user
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
  const secretKey = process.env.JWT_AUTH_SECRET!; // Use your secret key
  const options: jwt.SignOptions = { expiresIn: "1d" }; // Token expiration time

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
  const options: jwt.SignOptions = { expiresIn:"7d" }; // Refresh token expiration time
    return jwt.sign(payload, secretKey, options);
};

userSchema.methods.generateSessionCleanupToken = function (sessionId: string): string {
    // Implement session cleanup logic here
    const payload = {
        id: this._id,
        sessionId: sessionId,
    };
    const secretKey = process.env.JWT_SESSION_CLEANUP_SECRET!; // Use your session cleanup secret key
    // No expiration for session cleanup token
    return jwt.sign(payload, secretKey, );
  };
userSchema.methods.generatePasswordResetToken = function (passwordResetFlow: string): string {
    // Implement session cleanup logic here
    const payload = {
        id: this._id,
        email: this.email,
       action: passwordResetFlow, // Add any additional data needed for password reset
    };
    const secretKey = process.env.Jwt_PASSWORD_RESET_SECRET!; // Use your session cleanup secret key
    // No expiration for session cleanup token
    return jwt.sign(payload, secretKey, );
  };
userSchema.methods.generate2faVerificationToken = function (verificationFLow: string): string {
    // Implement session cleanup logic here
    const payload = {
        id: this._id,
        is2faEnabled: this.is2faEnabled,
        email: this.email,
        action: verificationFLow, // Add any additional data needed for 2FA verification

    };
    const secretKey = process.env.JWT_2FA_SECRET!; // Use your session cleanup secret key
    // No expiration for session cleanup token
    return jwt.sign(payload, secretKey, );
  };

export const UserModel = model<IUser>("UserModel", userSchema);