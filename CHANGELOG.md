# Changelog

## [3.3.0](https://github.com/markusfalk/cd-config-server/compare/v3.2.0...v3.3.0) (2021-07-31)


### Features

* **github:** improve error messaging ([801a34d](https://github.com/markusfalk/cd-config-server/commit/801a34dcd2bd05cd3dee9eed5af400f2cb51f792))
* upgrade to nestjs 8 ([a717296](https://github.com/markusfalk/cd-config-server/commit/a7172960d1b3cf0557cd74e0a1f459b857b57d71))


### Bug Fixes

* improve error handling ([0364e4f](https://github.com/markusfalk/cd-config-server/commit/0364e4fdf1f6c4a0c835a796382d0e3b52de5271))
* migrate imports ([a0894e1](https://github.com/markusfalk/cd-config-server/commit/a0894e1f14b4f289dfbdaddd673002c0e25ebdde))

## [3.2.0](https://github.com/markusfalk/cd-config-server/compare/v3.1.0...v3.2.0) (2021-05-17)


### Features

* update nest.js ([4ea3a8b](https://github.com/markusfalk/cd-config-server/commit/4ea3a8b3b3f9a2e87abcd49c2999bd5c9323f915))
* **file-system:** improve error handling and logging ([fd07095](https://github.com/markusfalk/cd-config-server/commit/fd07095decf1932068660d1efc101f23016f7205))
* **github:** improve error handling and logging ([4eae0f0](https://github.com/markusfalk/cd-config-server/commit/4eae0f02633b5a23301c0145d64e9424afcdcc83))
* **gitlab:** improve error handling and logging ([1545d84](https://github.com/markusfalk/cd-config-server/commit/1545d84af2815bc4ee93908b3f1c5db29fb0e891))


### Bug Fixes

* **file-system:** use absolute path after refactoring ([00e0881](https://github.com/markusfalk/cd-config-server/commit/00e08810a69e460960fc1f2553acf00285bbe8df))

## [3.1.0](https://github.com/markusfalk/cd-config-server/compare/v3.0.0...v3.1.0) (2021-03-04)


### Features

* add helmet for security ([8dadf7c](https://github.com/markusfalk/cd-config-server/commit/8dadf7c8d0bfe93531eeb35fd870d18d4090a9d0))


### Bug Fixes

* remove unused var ([be69514](https://github.com/markusfalk/cd-config-server/commit/be69514e5eaca1acd432ee2cb39ec3baa5645673))

## [3.0.0](https://github.com/markusfalk/cd-config-server/compare/v2.2.0...v3.0.0) (2021-02-25)


### Features

* enable configs to be read from file system ([5b8a1d5](https://github.com/markusfalk/cd-config-server/commit/5b8a1d57e66e23cf6940a4ddd96404c95441aa3e))

## [2.2.0](https://github.com/markusfalk/cd-config-server/compare/v2.1.0...v2.2.0) (2021-01-30)


### Features

* enable cors with origin config ([c86f026](https://github.com/markusfalk/cd-config-server/commit/c86f0265cd901f4665850fc12192ee5f306a07fa)), closes [#2](https://github.com/markusfalk/cd-config-server/issues/2)

## [2.1.0](https://github.com/markusfalk/cd-config-server/compare/v2.0.0...v2.1.0) (2020-12-28)


### Features

* make gitlab repo url configurable ([9864430](https://github.com/markusfalk/cd-config-server/commit/986443087618f79eab6058412319b9accda01c91))
* rework homepage with link to issues ([fe1643a](https://github.com/markusfalk/cd-config-server/commit/fe1643a5a16a7365905bf4915f7ea89d02b94379))

## 2.0.0 (2020-12-23)

### BREAKING CHANGES

- add gitlab support

### Bug Fixes

- throw error on missing config values ([e5fa8f6](https://github.com/markusfalk/cd-config-server/commit/e5fa8f607df7a7b0a5200757ea1e964a31d2036f))

## 1.0.1 (2020-12-20)

- update documentation

## 1.0.0 (2020-12-19)

- Initial Release

### 0.0.2 (2020-12-10)

### Features

- add basic auth for rate limit ([6c9c38b](https://github.com/markusfalk/cd-config-server/commit/6c9c38b756d45b5e2e00d58e3686a511267533ab))
- add caching ([0e3c557](https://github.com/markusfalk/cd-config-server/commit/0e3c557470c2ee6e175c5ef5f173828d9b70d72f))
- add nest backend and load all tags from github ([27bfb73](https://github.com/markusfalk/cd-config-server/commit/27bfb737421e3b2a6373393b4b37f7c90d4b2005))
- add rate limit ([ec22ce2](https://github.com/markusfalk/cd-config-server/commit/ec22ce2c6aa1cae0950370c23992d7bc9cb8c292))
- connect to github ([905e77f](https://github.com/markusfalk/cd-config-server/commit/905e77f108c69e4cddfcf01971ff3322560422f7))
- dockerize server ([1b5556c](https://github.com/markusfalk/cd-config-server/commit/1b5556c3ed96363bbee14688b4a4ece87e4096ef))

### Bug Fixes

- add typings, remove logs ([39b0798](https://github.com/markusfalk/cd-config-server/commit/39b079877eda4d6d60c4635bb322fdacc6410f9f))
- only return latest config ([3b56b1f](https://github.com/markusfalk/cd-config-server/commit/3b56b1f3aa8e7064e39508183db8a685d95d23f8))
- reimport interfaces ([40ceb44](https://github.com/markusfalk/cd-config-server/commit/40ceb44eb270192f876a6cd4e51589a742a8dc37))
- remove env from build ([c08f76e](https://github.com/markusfalk/cd-config-server/commit/c08f76ea3220200268211ec098cd47183ea59313))
- remove hard coded github values ([9a7b3e3](https://github.com/markusfalk/cd-config-server/commit/9a7b3e3c604d64527e2d4443c0c9853426950eb5))
