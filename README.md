<img src="https://raw.githubusercontent.com/markusfalk/cd-config-server/main/src/assets/img/cd-config-server-logo.svg?token=AAKKHMDUWRBBM3YPS5BDWMK744S2A" alt="" width="200" height="200" style="display: block; margin: 50px auto;"/>

# Continuous Delivery Configuration Server

<img src="https://raw.githubusercontent.com/markusfalk/cd-config-server/main/src/assets/img/cd-config-server-flow.svg?token=AAKKHMCE3F5XGN6QGWJCSVK75TS52" alt="" style="display: block; margin: 50px auto;"/>

This server provides a configuration API to be used within Continuous Delivery environments.

## Concept

The idea behind this software is to provide a global service for your apps to receive configuration values from. Configuration is stored in a git repository that is seperated from the repositories in which your apps reside. This makes it possible for apps and configurations to have independent lifecyles and both be treated like code.

This service allows for apps to be build once and then put through your continuous delivery pipeline without the need to rebuild them. They all load their configuration at runtime by telling the service what they need.

## How it works

### Application Configuration

A continuous delivery pipeline usually has mutlipe environments in which the app is tested or reviewed.
The configuration repository contains one file per stage/environment of your pipeline.

These configuration files (\*.json) contain all the values your app needs.
If a pipeline has the four stages: development (local), test, staging, production, then you would create the following four files:

```
development.json
test.json
staging.json
production.json
```

It currently supports Github and Gitlab as a source of your configuration files.

### Independent Lifecyles and Deployments

To make applications and configurations truly independent we need to somehow tell the service which configuration release is compatible with what version of our applications.

For that reason each configuration file contains this one additional and obligatory entry:

```json
{
  "compatibleWithAppVersion": "^2.0.0"
}
```

Here you can define a semantic version range that tells the configuration server if this tag/release of your configuration is comapitble with the application version that is requesting configuration.

### Naming Convention

#### Configuration Repository Name

The application id will be used to find the configuration repository by appending `-config`.

| application id | configuration repositoy | url of your repository                          |
| -------------- | ----------------------- | ----------------------------------------------- |
| YourApp        | YourApp-config          | https://github.com/yournamespace/yourapp-config |
| Another        | Another-config          | https://gitlab.com/yournamespace/another-config |

Examples

- https://github.com/markusfalk/cd-config-server-test-config
- https://gitlab.com/markus_falk/my-app-config

#### Matching Configuration Key

To match application version and configuration you must provide the `compatibleWithAppVersion` key in all of your configuration files.

```json
{
  "compatibleWithAppVersion": "^1.0.0"
}
```

### Demo Configuration Repository

- https://github.com/markusfalk/cd-config-server-test-config

## Setup

### Prerequisits

- Configuration files need (currently) to be hosted on GitHub
- This server is provided as a docker image
- Your applications need be versioned using semantic versioning

### Options

The server is provided as a docker image and can be started with the following options:

#### Common

| name           | default | description                                                                   |
| -------------- | ------- | ----------------------------------------------------------------------------- |
| CACHE_TTL      | 300     | This service uses an in memory cache and this is how long it lives in seconds |
| GIT_SOURCE\*   |         | 'gitlab' \| 'github'                                                          |
| HTTPPORT       | 3000    | What port would you like docker to expose this service to                     |
| RATE_LIMIT_MAX | 5000    | How many requests do you allow to this service per RATE_LIMIT_MS              |
| RATE_LIMIT_MS  | 360000  | Rate limit time range in milliseconds                                         |

#### When using Github

| name             | default | description             |
| ---------------- | ------- | ----------------------- |
| GITHUBPASSWORD\* |         | used for authentication |
| GITHUBUSERNAME\* |         | used for authentication |
| USERAGENT\*      |         | used for authentication |

#### When using Gitlab

| name             | default | description               |
| ---------------- | ------- | ------------------------- |
| GITLABUSERNAME\* |         | used to find your project |

## Changelog

- https://github.com/markusfalk/cd-config-server/blob/main/CHANGELOG.md
