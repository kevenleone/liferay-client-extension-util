# @client-extension-util-liferay/fastify

Fastify plugin for Liferay Client Extension authentication and integration.

## Features

- Fastify plugin for Liferay OAuth2 authentication
- JWT token verification using Liferay's JWKS endpoint
- Support for excluding specific routes from authentication
- Request decoration with Liferay authorization data

## Installation

```bash
bun add @client-extension-util-liferay/fastify
# or
npm install @client-extension-util-liferay/fastify
# or
yarn add @client-extension-util-liferay/fastify
```

## Usage

```typescript
import Fastify from 'fastify';
import liferayAuthPlugin from '@client-extension-util-liferay/fastify';

const fastify = Fastify();

// Register the Liferay authentication plugin
await fastify.register(liferayAuthPlugin);

// Define your routes
fastify.get('/api/protected', async (request, reply) => {
  // Access the Liferay authorization data
  const auth = request.liferayAuthorization;
  
  return { message: `Hello, ${auth.username}!` };
});

await fastify.listen({ port: 3000 });
console.log('Server running on port 3000');
```

## Environment Variables

This package requires the following environment variables to be set:

- `liferay.oauth.application.external.reference.codes`: Comma-separated list of external reference codes for OAuth applications
- `liferay.oauth.urls.excludes`: Comma-separated list of URLs to exclude from authentication
- `com.liferay.lxc.dxp.domains`: DXP domain for API calls
- `com.liferay.lxc.dxp.server.protocol`: Protocol for DXP server (http/https)
