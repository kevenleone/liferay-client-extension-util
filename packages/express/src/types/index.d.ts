import "express";

declare module "express-serve-static-core" {
    interface Request {
        liferayAuthorization?: LiferayAuthorization;
    }
}
