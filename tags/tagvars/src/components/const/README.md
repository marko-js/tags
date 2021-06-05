<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/const
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-unstable-red.svg" alt="API Stability"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko-tags/const">
    <img src="https://img.shields.io/npm/v/@marko-tags/const.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko-tags/const">
    <img src="https://img.shields.io/npm/dm/@marko-tags/const.svg" alt="Downloads"/>
  </a>
</h1>

Create constant values and expressions directly from your templates.

# Installation

```console
npm install @marko-tags/const
```

# Example

```marko
<const/fullName=`${input.firstName} ${input.lastName}` />
<div>
  Hi ${fullName}!!!
</div>
```

## API

```marko
<const/name=value />
```
