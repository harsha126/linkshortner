import { Request, Response, Router } from "express";
import { UserDetailsDTO } from "../dtos/User";
import { loginUser, registerNewUser, ServiceResponse } from "../services/UserService";

const UserRouter = Router();

export interface WithRequest<T> extends Request {
    data: T
}
export interface WithResponse<T> extends Response {
    response: T
}

UserRouter.post<object, ServiceResponse<{ token: string }>, Partial<UserDetailsDTO>>('/signup', async (req, res) => {
    const { name, email, username, password }: Partial<UserDetailsDTO> = req.body;
    const result = await registerNewUser({ name, email, username, password });
    if (result.isError) {
        res.status(400).json(result);
    }
    else {
        res.status(201).json(result);
    }
});

UserRouter.post<object, ServiceResponse<{ token: string }>, Partial<UserDetailsDTO>>('/login', async (req, res) => {
    const { username, password }: Partial<UserDetailsDTO> = req.body;
    const result = await loginUser(username, password);
    if (result.isError) {
        res.status(401).json(result);
    }
    else {
        res.status(200).json(result);
    }
});

UserRouter.get('/', (req, res) => {
    res.status(200).send('helloworld');
})
export default UserRouter;