<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/switch
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-green.svg" alt="API Stability"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko-tags/switch">
    <img src="https://img.shields.io/npm/v/@marko-tags/switch.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko-tags/switch">
    <img src="https://img.shields.io/npm/dm/@marko-tags/switch.svg" alt="Downloads"/>
  </a>
</h1>

Use <switch> expression instead of long cascade <if-else> within your template.

# Installation

```console
npm install @marko-tags/switch
```

# Example

```marko
<switch by=input.entity>
  <@case is="Andromeda">
    <span>Galaxy</span>
  </@case>

  <@case is=['Earth', 'Mars']>
    <span>Planet</span>
  </@case>

  <@default>
    <span>Star: ${input.entity}</span>
  </@default>
</switch>
```
