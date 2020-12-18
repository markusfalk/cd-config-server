# Continuous Delivery Configuration Server for Github

![Publish](https://github.com/markusfalk/cd-config-server/workflows/Release/badge.svg)

This server provides a REST API to be used for Continuous Delivery Environments in which apps get configured at runtime. The configuration file reside in a different github repository.

## Usage

* Provide .env file
* start image

```env
GITHUBUSERNAME=XXX
HTTPPORT=3000
USERAGENT=XXX
GITHUBPASSWORD=***
```

## How it works

### Matching Entry

Param appversion is matched against this configured range in the config file.

```json
{
  "compatibleWithAppVersion": "2.0.0",
}
```

### Github Repository

Repository name: <:appid>-config

* https://github.com/markusfalk/cd-config-server-test-config

## Changelog

* https://github.com/markusfalk/cd-config-server/blob/main/CHANGELOG.md
