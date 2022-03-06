## Initial Setup
  

### Prerequisites

The setups steps expect following tools installed on the system.

- next 12.1.0

- react: 17.0.2,

- react-dom: 17.0.2,

- typescript: ~4.5.2

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

nx serve mint-check

```
API would be running at `localhost:4200/api/` in `development`