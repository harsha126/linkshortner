import { Schema, model, Document } from 'mongoose';

export type TLinkDocument = Document & {
    originalUrl: string;
    generatedHash: string;
    createdAt: Date;
    updatedAt: Date;
    hits: number;
    userId: string | Schema.Types.ObjectId;
    isExpired: boolean;
    expirationDate: Date | null;
};

const linkSchema = new Schema<TLinkDocument>({
    originalUrl: {
        type: String,
        required: true,
    },
    generatedHash: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    hits: {
        type: Number,
        default: 0,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isExpired: {
        type: Boolean,
        default: false,
    },
    expirationDate: {
        type: Date,
        default: null,
    },
});

linkSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});


export const Link = model<TLinkDocument>('Link', linkSchema);