# QuaStore

Persistent browser-side state management module.

This package was developed primarily for the needs of QuaEngine, but it also supports the standalone usage.

## Features

- Presistent state management, APIs are inspired by `vuex`.

- Multi-Slot Continuous Storage.

- Provide composition APIs for convenience.

## Usage

Step 1: Install this package from `npm`.

```bash
npm i @quajs/store -S
```

Step 2: Create store.

```js
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
const store = QuaManager.getStore('my-store');
store.commit('setValue', 1);
console.log(store.state.value); // 1
```

If you don't want to use the manager, you can instantiate a standalone store.

```js
const store = new QuaStore({
  state: {},
  mutations: {},
});
```

## License

MIT
