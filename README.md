<h1 align="center">Tags</h1>
<p align="center">
  <!-- Structure -->
  <a href="https://github.com/lerna/lerna">
    <img src="https://img.shields.io/badge/monorepo-lerna-531099.svg" alt="Lerna"/>
  </a>
  <!-- Format -->
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Styled with prettier"/>
  </a>
  <!-- License -->
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/marko-js/tags.svg" alt="MIT"/>
  </a>
  <!-- CI -->
  <a href="https://travis-ci.com/marko-js/tags">
    <img src="https://travis-ci.com/marko-js/tags.svg?branch=master" alt="Build status"/>
  </a>
  <!-- Coverage -->
  <a href="https://codecov.io/gh/marko-js/tags">
    <img src="https://codecov.io/gh/marko-js/tags/branch/master/graph/badge.svg" />
  </a>
</p>

## Packages

- [context](https://github.com/marko-js/tags/blob/master/tags/context) -
  share data through arbitrarily deep Marko components.
- [match-media](https://github.com/marko-js/tags/blob/master/tags/match-media) -
  media queries directly in your Marko templates.
- [portal](https://github.com/marko-js/tags/blob/master/tags/portal) -
  render content somewhere else in the DOM.
- [subscribe](https://github.com/marko-js/tags/blob/master/tags/subscribe) -
  declarative event subscriptions component.
- [state](https://github.com/marko-js/tags/blob/master/tags/state) -
  stateful manipulations directly from your template
- [effect](https://github.com/marko-js/tags/blob/master/tags/effect) -
  lifecycle events in your template

## Contributing

This repo provides a consistent build, test, & development environment around components that aren't quite _core_ but we also think improve the ecosystem.

### [npm](https://twitter.com/chriscoyier/status/896051713378992130) scripts

- `test` Run the tests for all packages
- `test:report` Runs the test command and shows test coverage
- `publish` Begins publishing any changed packages
- `format` Formats the files in the repo _(runs on precommit)_

## Code of Conduct

This project adheres to the [eBay Code of Conduct](./.github/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
