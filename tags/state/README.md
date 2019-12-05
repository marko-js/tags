<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/state
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-red.svg" alt="API Stability"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko-tags/state">
    <img src="https://img.shields.io/npm/v/@marko-tags/state.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko-tags/state">
    <img src="https://img.shields.io/npm/dm/@marko-tags/state.svg" alt="Downloads"/>
  </a>
</h1>

Create and manipulate state directly from your templates

# Installation

```console
npm install @marko-tags/state
```

# Example

```marko
<state|myState = 1|>

<div>
  <div>${myState}</div>
  <button onClick(() => myState++)>Increment</button>
</div>
```

## API

```marko
<state|
  stateAssignment
 |/>
```
