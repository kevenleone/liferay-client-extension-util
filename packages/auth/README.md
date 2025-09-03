# @client-extension-util-liferay/auth

A utility package for handling OAuth2 authentication with Liferay DXP and Client Extension.

## Features

- OAuth2 client implementation for Liferay DXP
- Token management with automatic expiration handling
- Client ID and secret management

## Installation

```bash
bun add @client-extension-util-liferay/auth
# or
npm install @client-extension-util-liferay/auth
# or
yarn add @client-extension-util-liferay/auth
```

## Usage

```typescript
import LiferayOAuth2Client from '@client-extension-util-liferay/auth';

// Get authorization token for a specific application
const token = await LiferayOAuth2Client.getAuthorization('externalReferenceCode');

// Use the token for authenticated API calls
fetch('/some-liferay-api/endpoint', {
  headers: {
    Authorization: token
  }
});
```

## Environment Variables

This package requires the following environment variables to be set:

- `liferay.oauth.application.external.reference.codes`: Comma-separated list of external reference codes for OAuth applications
- `com.liferay.lxc.dxp.domains`: DXP domain for API calls
- `com.liferay.lxc.dxp.server.protocol`: Protocol for DXP server (http/https)
