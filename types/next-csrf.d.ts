import 'next';

declare module 'next' {
  interface NextApiRequest {
    csrfToken?: () => string;
  }
}
