import type { LiferayAuthorization } from "@client-extension-util-liferay/shared";

declare module "fastify" {
    interface FastifyRequest {
        liferayAuthorization?: LiferayAuthorization;
    }
}
