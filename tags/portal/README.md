<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/portal
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-green.svg" alt="API Stability"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko-tags/portal">
    <img src="https://img.shields.io/npm/v/@marko-tags/portal.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko-tags/portal">
    <img src="https://img.shields.io/npm/dm/@marko-tags/portal.svg" alt="Downloads"/>
  </a>
</h1>

A Portal Component for Marko.js

Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

A typical use case for portals is when a parent component has an `overflow: hidden` or `z-index` style, but you need the child to visually “break out” of its container. For example, dialogs and tooltips.

# Installation

```console
npm install @marko-tags/portal
```

# Example

By default, the portal renders into `document.body`:

```marko
<portal>
   ...content here...
</portal>
```

You can set a custom target container using a DOM id:

```marko
<portal target="some-id">
   ...content here...
</portal>
```

Or by passing a DOM Node:

```marko
<portal target=someNode>
   ...content here...
</portal>
```
