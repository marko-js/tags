<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/let
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-unstable-red.svg" alt="API Stability"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko-tags/let">
    <img src="https://img.shields.io/npm/v/@marko-tags/let.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko-tags/let">
    <img src="https://img.shields.io/npm/dm/@marko-tags/let.svg" alt="Downloads"/>
  </a>
</h1>

Create and manipulate state directly from your templates.

# Installation

```console
npm install @marko-tags/let
```

# Example

```marko
<state/myState = 1 />

<div>
  <div>${myState}</div>
  <button onClick(() => myState++)>Increment</button>
</div>
```

# Real world example

```marko
<state/show = false />

<div>
  <button onClick(() => show = !show)>Toggle</button>
  <div class=['container', {'container--visible': show}]>Content</div>
</div>
```

## API

```marko
<state/name=value />
```
