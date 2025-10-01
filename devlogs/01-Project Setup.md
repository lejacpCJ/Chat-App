### Create frontend backend folder

- mkdir frontend backend

### install vite in frontend

- in /frontend

```bash
npm create vite@latest .
```

- select react, javascript, no, yes

### Install backend packages

- in /backend

```bash
npm init -y
```

- install express mongoose dotenv jsonwebtoken bcryptjs cookie-parser cloudinary socket.io

```bash
npm i express mongoose dotenv jsonwebtoken bcryptjs cookie-parser cloudinary socket.io
```

- install devDependencies

```bash
npm i nodemon -D
```

### Create index.js in /src

`index.js`

```js
const express = require("express");

const app = express();

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
```

### Setup dev scripts

- In package.json change Scripts
- Test in npm run dev

`package.json`

```json
 "main": "src/index.js",

  "scripts": {
    "dev": "nodemon src/index.js"
  },
```

### Change type to module

- In package.json change type to module
- In index.js, change express to import syntax

`package.json`

```json
 "type": "module",
```

`index.js`

```js
import express from "express";
```

### Create more folders

```bash
mkdir routes models middleware lib controllers
```

### Add auth

- in index.js

- in routes, create auth.route.js

`auth.route.js`

```js
import express from "express";

const router = express.Router();

export default router;
```

- import auth in index.js

`index.js`

```js
import authRoutes from "../routes/auth.route.js";
```

### Add routers in auth.route.js

`auth.route.js`

```js
router.post("/signup", (req, res) => {
  res.send("signup route");
});

router.post("/login", (req, res) => {
  res.send("login route");
});

router.post("/logout", (req, res) => {
  res.send("logout route");
});
```
