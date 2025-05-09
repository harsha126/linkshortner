import express, { Request } from 'express';
import UserRouter from './routes/UserRoute';
import mongoose, { Types } from 'mongoose';
import LinkRouter from './routes/LinkRoute';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import { getOriginalLink } from './services/LinkService';
const app = express();
app.use(cors());
const port = 3000;
configDotenv()
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

export type AuthUser = {
  userId: Types.ObjectId,
  name: string,
  email: string;
}
export type JWTPayload = {
  id: string,
  name: string
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface LinkGetRequest extends Request {
  generateHash: string
}

mongoose.connect('mongodb://localhost:27017/links', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});



// Middleware to parse JSON bodies
app.use(express.json());
app.use('/user', UserRouter);
app.use('/link', LinkRouter)

app.get('/:generatedHash', async (req: LinkGetRequest, res) => {
  const generatedHash = req.params.generatedHash;
  const result = await getOriginalLink(generatedHash);
  if (result.isError) {
    res.status(500).send(result);
  }
  else {
    res.status(200).send(result);
  }
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});