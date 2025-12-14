// types.d.ts

import type { TokenPayload } from "./middlewares/protectMiddleware";


declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}
