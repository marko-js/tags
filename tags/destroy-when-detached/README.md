<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/destroy-when-detached
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-green.svg" alt="API Stability"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko-tags/destroy-when-detached">
    <img src="https://img.shields.io/npm/v/@marko-tags/destroy-when-detached.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko-tags/destroy-when-detached">
    <img src="https://img.shields.io/npm/dm/@marko-tags/destroy-when-detached.svg" alt="Downloads"/>
  </a>
</h1>

Automatically clean up all Marko components within a container when it is removed and causes the `onDestroy` lifecycle to be called.
This is particularly useful when embedding a Marko application via [micro-frame](https://github.com/marko-js/micro-frame)
to allow cleanup when changing between pages.

# Installation

```console
npm install @marko-tags/destroy-when-detached
```

# Example

```marko
// Place this at the root where you want to track removals.
// If using micro-frame this should be at your embedded applications page template.
<destroy-when-detached>
  All children will go through the "onDestroy" lifecycle if this node is removed from the DOM.
</>
```
