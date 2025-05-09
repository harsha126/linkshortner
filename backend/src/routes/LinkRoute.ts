import { Router } from "express";
import { createNewLink, getAllLinksForaUser, getOriginalLink } from "../services/LinkService";
import { AuthRequest, LinkGetRequest } from "../";
import { AuthMiddleware } from "../AuthMiddleware";


const LinkRouter = Router();

LinkRouter.post('/', AuthMiddleware, async (req: AuthRequest, res) => {
    const { link }: { link: string } = req.body;
    const result = await createNewLink(link, req.user.userId);
    res.status(201).send(result);
})

LinkRouter.get('/all', AuthMiddleware, async (req: AuthRequest, res) => {
    const result = await getAllLinksForaUser(req.user.userId);
    res.status(201).send(result);
})

LinkRouter.get('/:generatedHash', async (req: LinkGetRequest, res) => {
    const generatedHash = req.params.generateHash;
    const result = await getOriginalLink(generatedHash);
    if (result.isError) {
        res.status(500).send(result);
    }
    else {
        res.status(200).send(result);
    }
})

export default LinkRouter;