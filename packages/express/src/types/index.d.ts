import "express";
import { LiferayAuthorization } from "@liferay-client-extension-util/shared";

declare module "express-serve-static-core" {
    interface Request {
        liferayAuthorization?: LiferayAuthorization;
    }
}
