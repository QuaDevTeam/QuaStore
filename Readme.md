# QuaStore

Persistent browser-side state management module.

This package was developed primarily for the needs of QuaEngine, but it also supports the standalone usage.

## Features

- Presistent state management, APIs are inspired by `vuex`.

- Multi-Slot Continuous Storage.

- Provide composition APIs for convenience.

- TypeScript supported.

## Usage

### How to create a store

Step 1: Install this package from `npm`.

```bash
npm i @quajs/store -S
```

Step 2: Create store.

```js
import { QuaStoreManager } from '@quajs/store';

QuaStoreManager.createStore({
  name: 'my-store',
  state: {
    value: 0,
  },
  mutations: {
    setValue(state, payload) {
      state.value = payload;
    },
  },
});
```

Step 3: Use store at anywhere.

```js
import { useStore } from '@quajs/store';
const store = useStore('my-store');

// or

import { QuaStoreManager } from '@quajs/store';
const store = QuaStoreManager.getStore('my-store');
store.commit('setValue', 1);
console.log(store.state.value); // 1
```

Also, you can instantiate a standalone store for more flexible usage.

```js
const store = new QuaStore('store-name', {
  state: {},
  mutations: {},
  getters: {},
});
```

The standalone instance cannot be indexed by `QuaStoreManager`, so the manager methods will not be effected on this instance.

### Persist and restore data

QuaStore is using `dexie` (An IndexedDB wrap) to persist data.

```js
await store.persist(1);
```

Store instance can persist state to a certain slot, like the save in a video game.

Using the `restore` method can restore the persisted state to store.

```js
await store.restore(1);
```

If parameter `slot` is a `number`, it cannot be smaller than 1. If you want to use a customize name, `string` is also acceptable for `slot`.

In general usage, `restore` often be called in initializing process, if you want to use the persisted state in database to overwrite the current ones, a `force` option is required.

```js
await store.restore(1, { force: true });
```

## Compatibility Warning

`QuaStore` used [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to proceed `getters` in store, please be sure that the clients are compatible with `Proxy`.

## License

MIT
