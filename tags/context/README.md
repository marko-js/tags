<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko-tags/context
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg" alt="API Stability"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko-tags/context">
    <img src="https://img.shields.io/npm/v/@marko-tags/context.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko-tags/context">
    <img src="https://img.shields.io/npm/dm/@marko-tags/context.svg" alt="Downloads"/>
  </a>
</h1>

Share data across arbitrarily nested Marko components.

# Installation

```console
npm install @marko-tags/context
```

# API

### Providing context

**some-component.marko**

```marko
<context x=1>
  <!-- All children can request the context attributes anywhere in the tree -->
  <${input}/>
</context>
```

### Receiving Context (from the above component)

```marko
<context({ x }) from="some-component">
  <!-- Do whatever you need with the context here -->
</context>
```

# Discovery

The `from` attribute here is special and uses the same [discovery method](https://markojs.com/docs/custom-tags/#discovering-tags) as Marko uses when finding tags.

`<context({ ... }) from="router">` is going to _receive_ context from an ancestor component called `router`.

This method avoids namespace collisions without all of the additional boilerplate needed by solutions in other frameworks.

# Example

Lets say we want to have a custom form component with a schema that validates its special form inputs. With forms you likely want to allow developers to insert arbitrary markup and components to fit their design and functionality requirements.

Traditionally the user of the component would have to manually pass this schema information to every single form control, as well as the form component. Alternatively you could use `window`, `global` or `out.global` but none of them solve the task well and open you up to name collisions and hard to reason about code.

With context this can be made both simpler and less brittle. It allows you to build contracts between a receiving component and an ancestor arbitrarily higher in the tree which will provide it with data.

**index.marko**

```marko
static const schema = {
  username(value) {
    if (value.length >= 6) {
      return true;
    }

    return false;
  },
  password(value) {
    return ...;
  }
}

<fancy-form schema=schema>
  <span.field>
    <label>Username</label>
    <fancy-input name="username" />
  </span>
</fancy-form>
```

**fancy-form.marko**

```marko
<form on-submit('emit', 'submit')>
  <context schema=input.schema>
    <!-- Everything rendered within the context will be able to request for the `schema` attribute -->
    <${input}/>
  </context>
</form>
```

**fancy-input.marko**

```marko
class {
  onCreate() {
    this.state = {
      isValid: true
    };
  }
  validate(test, ev) {
    this.state.isValid = test(ev.target.value);
  }
}

<context({ schema }) from="fancy-form">
  <!-- Here we are receiving the schema from the closest ancestor fancy-form -->

  $ const test = schema[input.name];
  <input ...input on-change('validate', test)/>

  <if(!state.isValid)>
    <span class="error">This is invalid!</span>
  </if>
</context>
```

# Receiving from the same component type

Sometimes you want to access data from an ancestor component which is the same type as the current component.
To access the current ancestor of the same type you can use `from="."`. Here is an example basic router implementation that uses this.

**index.marko**

```marko
<router>
  <@route path="/test">
    <nested-router>
  </@route>
  <@route path="/">
    <home-page/>
  </@route>
</router>
```

**nested-router.marko**

```marko
<router>
  <@route path="/a">
    <test-page-a/>
  </@route>

  <@route path="/b">
    <test-page-b/>
  </@route>
</router>
```

**router.marko**

```marko
<context({ remaining = location.href }) from=".">
  <-- Here we have access to an ancestor route context. -->
  $ const match = matchRoute(input.routes);
  <context remaining=match.remaining>
    <!-- Here we are setting the new route context for any children -->
    <${match.route}/>
  </context>
</context>
```
