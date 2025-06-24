// pages/api/graphql.ts
import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { NextApiRequest, NextApiResponse } from 'next';

const cors = Cors({
  origin: '*',
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
});

// Apollo Server instansi
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// Next.js config: Nonaktifkan body parser agar bisa diproses oleh Apollo
export const config = {
  api: {
    bodyParser: false,
  },
};

// Mulai server & tangani request
const startServer = apolloServer.start();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await startServer;
  return apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
};

export default cors(handler);
