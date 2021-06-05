<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/effect
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-unstable-red.svg" alt="API Stability"/>
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
npm install @marko-tags/effect
```

# Information

The effect tag is used to execute code when there is a change in the component. This is based on the component dependencies, such as input or state. The optional return of the effect tag is a function that is executed as cleanup. This is executed each time before the new effect is run.

The mount tag is executed only when the component is mounted in the DOM. This tag does not execute multiple times, but only once when the component is inserted. The return of the mount tag is an optional function which also executes when the tag is removed from the DOM.

# Example

```marko
<mount(() => {
  if (!component.map) {
    component.map = new google.maps.Map(component.getEl('map'));
  }
  return () => {
    component.map = null;
  }
})/>

<div key="map"></div>
```

```marko
<effect(() => {
  if (!input.value) {
    component.hasError = true;
  }
  return () => {
    component.hasError = false;
  }
})/>

<div class=[component.hasError && 'has-error']>
   <inpput value=input.value />
</div>
```

## API

```marko
<effect
  argument ():cleanup
  />
```
