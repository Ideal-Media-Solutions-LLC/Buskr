import NextCors from 'nextjs-cors';

/* eslint no-await-in-loop: ["off"] */
export default async function middleware(req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
}
