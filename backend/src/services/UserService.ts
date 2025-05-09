import { UserDetailsDTO, UserResponseDTO } from "../dtos/User";
import { User } from "../models/User";
import { signAccessToken } from "../utils";

export type ServiceResponse<T> = {
    isError: boolean,
    response: T | null,
    errors: string[]
}

export const registerNewUser = async (newUser: Partial<UserDetailsDTO>): Promise<ServiceResponse<{ token: string }>> => {
    const existingUser = await User.findOne({ username: newUser.username })
    if (existingUser) {
        return {
            isError: true,
            response: { token: null },
            errors: [`User with username ${newUser.username} already exist`]
        }
    }
    const createdUser = await createNewUser(newUser);

    if (createdUser.isError) {
        return {
            isError: true,
            response: { token: null },
            errors: createdUser.errors
        }
    }
    else {
        const token = signAccessToken({ id: createdUser.response.id, email: createdUser.response.email })
        return {
            isError: false,
            response: { token },
            errors: []
        }
    }
}

export const createNewUser = async (newUser: Partial<UserDetailsDTO>): Promise<ServiceResponse<UserResponseDTO>> => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.username) {
        return {
            isError: true,
            response: null,
            errors: ['Please input valid details']
        }
    }
    let returnVal: ServiceResponse<UserResponseDTO> = {
        isError: true,
        response: null,
        errors: ["something went wrofffffffffffng"]
    }
    newUser.role = 'user';
    console.log('newUser', newUser);
    returnVal = await User.create(newUser)
        .then((createdUser) => {
            const userResponse: UserResponseDTO = {
                id: createdUser._id.toString(),
                name: createdUser.name,
                email: createdUser.email,
                username: createdUser.username,
                role: createdUser.role
            };
            return {
                isError: false,
                response: userResponse,
                errors: []
            };
        })
        .catch((error) => {
            console.error(error)
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
            if (error.name === 'MongoServerError' && error.code === 11000) {
                const duplicateField = Object.keys(error.keyPattern)[0];
                return {
                    isError: true,
                    response: null,
                    errors: [`${duplicateField} already exists`]
                };
            }
            return {
                isError: true,
                response: null,
                errors: ["something went wrong"]
            }
        });
    return returnVal;
}

export const loginUser = async (username: string, password: string): Promise<ServiceResponse<{ token: string | null }>> => {
    let token: string | null = null;
    if (!username || !password) {
        return {
            isError: true,
            response: { token },
            errors: ['no user found']
        }
    }
    const user = await User.findOne({ username })
    if (!user || password != user.password) {
        return {
            isError: true,
            response: { token },
            errors: ['Password dont match']
        }
    }

    token = signAccessToken({ id: user._id.toString(), email: user.email });
    return { isError: false, response: { token }, errors: [] };
}

