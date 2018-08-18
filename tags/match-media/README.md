<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/match-media
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg" alt="API Stability"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko-tags/match-media">
    <img src="https://img.shields.io/npm/v/@marko-tags/match-media.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko-tags/match-media">
    <img src="https://img.shields.io/npm/dm/@marko-tags/match-media.svg" alt="Downloads"/>
  </a>
</h1>

Media queries directly in your Marko templates.

# Installation

```console
npm install @marko-tags/match-media
```

# Example

```marko
<match-media({ mobile, tablet, desktop })
  mobile="(max-width: 767px)"
  tablet="(min-width: 768px) and (max-width: 1024px)"
  desktop="(min-width: 1025px)"
>

  <if(mobile)>
    <!-- Mobile version -->
  <else-if(tablet)>
    <!-- Tablet version -->
  </else-if>
  <else-if(desktop)>
    <!-- Desktop version -->
  </else-if>
  <else>
    <!-- Handle server side render (no media queries match) -->
  </else>

</match-media>
```

### Full media query support

```marko
<match-media({ portrait, landscape })
  portrait="(orientation: portrait)"
  landscape="(orientation: landscape)"
>

  <!-- Render based on portrait or landscape -->

</match-media>
```
