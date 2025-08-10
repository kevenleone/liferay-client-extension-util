import express from "express";
import cors from "cors";

import { LiferayOAuth2Client } from "@liferay-client-extension-util/auth";
import { liferayAuthMiddleware } from "@liferay-client-extension-util/express";

const PORT = Bun.env.PORT || 58081;

const app = express();

app.use(liferayAuthMiddleware);

app.use(cors());

app.get("/", (request, response) => {
    response.send({ message: "Hello World" });
});

app.get("/protected", (request, response) => {
    response.send({
        liferayAuthorization: request.liferayAuthorization,
        message: "Accessing a protected route",
    });
});

app.get("/ready", async (request, response) => {
    const fetchResponse = await fetch(`http://localhost:${PORT}/protected`, {
        headers: {
            Authorization: await LiferayOAuth2Client.getAuthorization(
                "liferay-express-sample-oauth-application-headless-server"
            ),
        },
    });

    response.json({
        message: "Ready",
        protectedCallResponse: await fetchResponse.json(),
    });
});

app.listen(PORT, () => {
    console.log(`App running ${PORT}`);
});
