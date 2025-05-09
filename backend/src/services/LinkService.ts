import mongoose, { Types } from "mongoose";
import { Link, TLinkDocument } from "../models/Link";
import { genRandString } from "../utils";
import { ServiceResponse } from "./UserService";

export type LinkDTO = {
    originalUrl: string;
    generatedHash: string;
    createdAt: Date;
    hits: number;
    userId: string | Types.ObjectId;
    isExpired: boolean;
    expirationDate: Date | null;
}

export const createNewLink = async (link: string, userId: Types.ObjectId): Promise<ServiceResponse<LinkDTO>> => {
    const newLink: LinkDTO = {
        originalUrl: link,
        generatedHash: genRandString(10),
        hits: 0,
        userId,
        isExpired: false,
        expirationDate: null,
        createdAt: new Date()
    };
    return await Link.create(newLink).then((createdLink) => {
        return {
            isError: false,
            response: {
                originalUrl: createdLink.originalUrl,
                generatedHash: createdLink.generatedHash,
                hits: createdLink.hits,
                isExpired: createdLink.isExpired,
                expirationDate: createdLink.expirationDate,
                createdAt: createdLink.createdAt
            },
            errors: []
        } as ServiceResponse<LinkDTO>
    }).catch((error) => {
        if (error.name === "ValidationError") {
            const errors: string[] = [];

            Object.keys(error.errors).forEach((key, ind) => {
                errors[ind] = error.errors[key].message;
            });
            return {
                isError: true,
                response: null,
                errors
            };
        }
        return {
            isError: true,
            response: null,
            errors: ['Something went wrong']
        }
    })
}

export const getAllLinksForaUser = async (userId: Types.ObjectId): Promise<ServiceResponse<{ links: TLinkDocument[] }>> => {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId.toString())) {
        return {
            isError: true,
            response: null,
            errors: ['Invalid user ID format']
        };
    }
    const allLinks = await Link.find({ userId: userId }).lean();
    return {
        isError: false,
        response: { links: allLinks },
        errors: []
    }
}

export const getOriginalLink = async (generatedHash: string): Promise<ServiceResponse<{ OriginalUrl: string }>> => {
    console.log(generatedHash);
    if (!generatedHash) {
        return {
            isError: true,
            response: null,
            errors: ['we dont have the URL']
        }
    }
    return Link.findOne({ generatedHash: generatedHash }).then(async (link) => {
        await Link.updateOne({ generatedHash }, { hits: link.hits + 1 });
        return {
            isError: false,
            response: { OriginalUrl: link.originalUrl },
            errors: []
        }
    }).catch(error => {
        console.log(error);
        return {
            isError: true,
            response: { OriginalUrl: null },
            errors: []
        }
    })
}