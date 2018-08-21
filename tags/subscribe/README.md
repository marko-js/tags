<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/subscribe
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

Add and remove event subscriptions within your template.

# Installation

```console
npm install @marko-tags/subscribe
```

# Example

```marko
class {
    onCreate() {
        this.state = {
            listening: false
        }
    }

    toggle() {
        this.state.listening = !this.state.listening;
    }

    handleMove(e) {
      ...
    }
}

<button on-click('toggle')>
  <if(state.listening)>
    <!-- Only logs mouse moves if we are in the listening state -->
    <subscribe to=window on-mousemove('handleMove')/>
    Stop Listening
  </if>
  <else>
    Listen
  </else>
</button>
```

## API

```marko
<subscribe
  to=EventEmitter|EventTarget
  on-*(string, ...args)
  once-*(string, ...args)/>
```
