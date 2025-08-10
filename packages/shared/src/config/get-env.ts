import { object, pipe, safeParse, string, transform } from 'valibot';

const schema = object({
    'com.liferay.lxc.dxp.domains': string(),
    'com.liferay.lxc.dxp.mainDomain': string(),
    'com.liferay.lxc.dxp.server.protocol': string(),
    'liferay.oauth.application.external.reference.codes': pipe(
        string(),
        transform((input) => input.split(',')),
    ),
    'liferay.oauth.urls.excludes': string(),
});

let env = process.env;

if (typeof Bun !== 'undefined') {
    env = Bun.env;
}

const parsed = safeParse(schema, env);

export const parsedEnv = parsed.success ? parsed.output : undefined;

export { env };
