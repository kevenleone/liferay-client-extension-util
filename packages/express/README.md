# @client-extension-util-liferay/express

Express middleware for Liferay Client Extension authentication and integration.

## Features

- Express middleware for Liferay OAuth2 authentication
- JWT token verification using Liferay's JWKS endpoint
- Support for excluding specific routes from authentication

## Installation

```bash
bun add @client-extension-util-liferay/express
# or
npm install @client-extension-util-liferay/express
# or
yarn add @client-extension-util-liferay/express
```

## Usage

```typescript
import express from 'express';
import { liferayAuthMiddleware } from '@client-extension-util-liferay/express';

const app = express();

// Apply the Liferay authentication middleware
app.use(liferayAuthMiddleware);

// Define your routes
app.get('/api/protected', (req, res) => {
  // Access the Liferay authorization data
  const auth = req.liferayAuthorization;
  
  res.json({ message: `Hello, ${auth.username}!` });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Environment Variables

This package requires the following environment variables to be set:

- `liferay.oauth.application.external.reference.codes`: Comma-separated list of external reference codes for OAuth applications
- `liferay.oauth.urls.excludes`: Comma-separated list of URLs to exclude from authentication
- `com.liferay.lxc.dxp.domains`: DXP domain for API calls
- `com.liferay.lxc.dxp.server.protocol`: Protocol for DXP server (http/https)
