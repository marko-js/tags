<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/state
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-green.svg" alt="API Stability"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko-tags/subscribe">
    <img src="https://img.shields.io/npm/v/@marko-tags/subscribe.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko-tags/subscribe">
    <img src="https://img.shields.io/npm/dm/@marko-tags/subscribe.svg" alt="Downloads"/>
  </a>
</h1>

Use state in a component without `class`

# Installation

```console
npm install @marko-tags/state
```

# Example

```marko
<state|count = 0, setCount|>
  The count is ${count}
  <button on-click(setCount, count + 1)>
    Increment
  </button>
</state>
```

## API

```marko
<state|currentValue, setValue|/>
```
