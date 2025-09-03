import 'express';
import { LiferayAuthorization } from '@client-extension-util-liferay/shared';

declare module 'express-serve-static-core' {
    interface Request {
        liferayAuthorization?: LiferayAuthorization;
    }
}
