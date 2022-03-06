## Initial Setup
  

### Prerequisites

The setups steps expect following tools installed on the system.

- @nrwl/nestjs 13.8.3

- @nrwl/node: 13.8.4,

- ethers 5.5.4

##### 1. Setup tailwind.config.js and postcss.config.js

In root directory add the following files

1. `tailwind.config.js`
 
```bash
module.exports = {

	content: ["./pages/**/*.{html,js}", "./components/**/*.{html,js}"],

	theme: {

		extend: {},

	},

	plugins: [],

};
```

  
2. `postcss.config.js`

```bash
module.exports = {

	plugins: {

		tailwindcss: {},

		autoprefixer: {},

	},

}
```

##### 2. Start server
```bash

nx serve serverless-api

```
API would be running at `localhost:3000` in `development`

---

### ToDo
 - [ ]  Set up  `/nonce`  endpoint which receives the user's "wallet address" and returns  `byte32 hash`  to be signed by the user with their wallet.
- [ ] Set up  `/signature/{signature}`  endpoint which receives the  `signature`  from the backend (R-on-R API) and  `recovers`  the user's wallet address from the signature, if successful would return  `true`  else  `false`.