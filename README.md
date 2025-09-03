# Liferay Client Extension Utilities

A collection of utility packages for developing Liferay Client Extensions.

## Overview

This monorepo contains a set of packages designed to simplify the development of Liferay Client Extensions. These utilities provide authentication, environment configuration, and framework integrations for Express and Fastify.

## Packages

### [@client-extension-util-liferay/auth](./packages/auth/README.md)

A utility package for handling OAuth2 authentication with Liferay DXP.

- OAuth2 client implementation for Liferay DXP
- Token management with automatic expiration handling
- Client ID and secret management

### [@client-extension-util-liferay/express](./packages/express/README.md)

Express middleware for Liferay Client Extension authentication and integration.

- Express middleware for Liferay OAuth2 authentication
- JWT token verification using Liferay's JWKS endpoint
- Support for excluding specific routes from authentication

### [@client-extension-util-liferay/fastify](./packages/fastify/README.md)

Fastify plugin for Liferay Client Extension authentication and integration.

- Fastify plugin for Liferay OAuth2 authentication
- JWT token verification using Liferay's JWKS endpoint
- Support for excluding specific routes from authentication
- Request decoration with Liferay authorization data

## Installation

You can install individual packages as needed for your project:

```bash
# Install the auth package directly 
bun add @client-extension-util-liferay/auth

# Install the Express integration
bun add @client-extension-util-liferay/express

# Install the Fastify integration
bun add @client-extension-util-liferay/fastify
```

## Development

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js

### Setup

```bash
# Clone the repository
git clone https://github.com/kevenleone/liferay-client-extension-util.git
cd liferay-client-extension-util

# Install dependencies
bun install

# Build all packages
bun run build
```

### Release

```bash
# Create a new release
bun run release
```

## Author

- Keven Leone (keven.santos.sz@gmail.com)