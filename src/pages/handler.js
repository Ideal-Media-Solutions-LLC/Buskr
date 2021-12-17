import compression from 'compression';
import cors from 'cors';

export class HttpException extends Error {
  constructor(status, message, payload) {
    super(message);
    this.status = status;
    this.message = message;
    if (payload) {
      this.payload = payload;
    }
  }
}

const getParam = function param({ query }, key, orElse, cb) {
  const param = query[key];
  if (param !== undefined) {
    return cb(param);
  }
  if (orElse !== undefined) {
    return orElse;
  }
  throw new HttpException(400, `missing ${key}`);
};

const dateParam = function dateParam(key, orElse) {
  return getParam(this, key, orElse, param => {
    const numeric = Date.parse(param);
    if (Number.isNaN(numeric)) {
      throw new HttpException(400, `${key} must be a date`, numeric);
    }
    return new Date(numeric);
  });
};

const numParam = function numParam(key, orElse) {
  return getParam(this, key, orElse, param => {
    const numeric = Number(param);
    if (Number.isNaN(numeric)) {
      throw new HttpException(400, `${key} must be a number`, numeric);
    }
    return numeric;
  });
};

const intParam = function intParam(key, orElse) {
  return getParam(this, key, orElse, param => {
    const numeric = Number(param);
    if (!Number.isInteger(numeric)) {
      throw new HttpException(400, `${key} must be an integer`, numeric);
    }
    return numeric;
  });
};

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
const runMiddleware = (req, res, fn) => new Promise((resolve, reject) => {
  fn(req, res, res => res instanceof Error ? reject(res) : resolve(res))
});

const compressionWare = compression();
const corsWare = cors();

/* eslint no-await-in-loop: ["off"] */
const middleware = async function middleware(req, res) {
  await runMiddleware(req, res, corsWare);
  await runMiddleware(req, res, compressionWare);
  req.dateParam = dateParam;
  req.intParam = intParam;
  req.numParam = numParam;
};

export default function handler(routes) {
  return async function handle(req, res) {
    await middleware(req, res);
    const route = routes[req.method];
    if (route === undefined) {
      res.status(404).send();
    } else {
      try {
        await route(req, res);
      } catch (error) {
        const { message, status } = error;
        if (status === undefined) {
          console.error(error);
          throw error;
        }
        res.status(status).send(message);
      }
    }
  };
}
