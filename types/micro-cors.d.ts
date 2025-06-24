declare module 'micro-cors' {
  import { NextApiHandler } from 'next';

  interface Options {
    allowMethods?: string[];
    origin?: string | boolean;
    allowHeaders?: string[];
  }

  type Middleware = (handler: NextApiHandler) => NextApiHandler;

  const microCors: (options?: Options) => Middleware;

  export default microCors;
}
