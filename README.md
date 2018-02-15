# Project Microservice Ui
[![Build Status](https://travis-ci.org/ketan-gote/projectmsui.svg?branch=master)](https://travis-ci.org/ketan-gote/projectmsui)
[![codecov](https://codecov.io/gh/ketan-gote/projectmsui/branch/master/graph/badge.svg)](https://codecov.io/gh/ketan-gote/projectmsui)
[![npm version](https://badge.fury.io/js/projectmsui.svg)](http://badge.fury.io/js/projectmsui)
[![devDependency Status](https://david-dm.org/ketan-gote/projectmsui/dev-status.svg)](https://david-dm.org/ketan-gote/projectmsui?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/ketan-gote/projectmsui.svg)](https://github.com/ketan-gote/projectmsui/issues)
[![GitHub stars](https://img.shields.io/github/stars/ketan-gote/projectmsui.svg)](https://github.com/ketan-gote/projectmsui/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ketan-gote/projectmsui/master/LICENSE)

## Demo
https://ketan-gote.github.io/projectmsui/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#license)

## About

Handles all Project Microservice UI

## Installation

Install through npm:
```
npm install --save projectmsui
```

Then include in your apps module:

```typescript
import { NgModule } from '@angular/core';
import { ProjectMsUIModule } from 'projectmsui';

@NgModule({
  imports: [
    ProjectMsUIModule.forRoot()
  ]
})
export class MyModule {}
```

Finally use in one of your apps components:
```typescript
import { Component } from '@angular/core';

@Component({
  template: '<hello-world></hello-world>'
})
export class MyComponent {}
```

You may also find it useful to view the [demo source](https://github.com/ketan-gote/projectmsui/blob/master/demo/demo.component.ts).

## Documentation
All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://ketan-gote.github.io/projectmsui/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release
* Bump the version in package.json (once the module hits 1.0 this will become automatic)
```bash
npm run release
```

## License

MIT
