import { model, Schema } from "mongoose";

export type TUserDocument = {
    username: string;
    password: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<TUserDocument>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v: string) {
                return /^[a-zA-Z0-9_]+$/.test(v);
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: function (v: string) {
                return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v: string) {
                return /^[a-zA-Z\s]+$/.test(v);
            }
        }
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: false,
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

userSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const User = model<TUserDocument>('User', userSchema);




