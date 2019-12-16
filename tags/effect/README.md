<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/effect
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-green.svg" alt="API Stability"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko-tags/effect">
    <img src="https://img.shields.io/npm/v/@marko-tags/effect.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko-tags/effect">
    <img src="https://img.shields.io/npm/dm/@marko-tags/effect.svg" alt="Downloads"/>
  </a>
</h1>

Add and remove event subscriptions within your template.

# Installation

```console
npm install @marko-tagseffect/
```

# Example

```marko
<effect(() => {
  if (!state.map) {
    state.map = new google.maps.Map(component.getEl('map'));
  }
  return () => {
    state.map = null;
  }
})/>

<div key="map"></div>
```

## API

```marko
<effect
  argument ():cleanup
  />
```
