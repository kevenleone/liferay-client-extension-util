import express from "express";
import cors from "cors";

import LiferayOAuth2Client from "@liferay-client-extension-util/auth";
import { liferayAuthMiddleware } from "../src/middlewares/liferayAuthMiddleware";

const PORT = Bun.env.PORT || 58081;

const app = express();

app.use(liferayAuthMiddleware);

app.use(cors());

app.get("/", (request, response) => {
    response.send("Hey...");
});

app.get("/ready", async (request, response) => {
    const data = await LiferayOAuth2Client.getAuthorization(
        "liferay-marketplace-etc-spring-boot-oauth-application-headless-server"
    );

    response.send({ data, message: "Ok" });
});

app.listen(PORT, () => {
    console.log(`App running ${PORT}`);
});
