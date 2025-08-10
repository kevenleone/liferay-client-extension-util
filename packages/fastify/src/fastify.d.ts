import type { LiferayAuthorization } from "@liferay-client-extension-util/shared";

declare module "fastify" {
    interface FastifyRequest {
        liferayAuthorization?: LiferayAuthorization;
    }
}
