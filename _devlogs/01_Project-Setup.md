# 專案初始設置 / Project Setup

- [中文版](#zh)
- [English](#en)

---

<a name="zh"></a>

# 中文版 - 專案初始設置

## 目標

建立聊天應用程式的專案基礎，包括前後端分離、基本工具安裝，以及初步的 auth routers/controllers。

---

## 步驟說明

### 1. 建立前端與後端目錄

```bash
# Create frontend and backend folders
mkdir frontend backend # 建立前端與後端目錄
```

---

### 2. 使用 Vite 初始化前端

進入 `frontend` 目錄，並用 Vite 建立 React 專案：

```bash
# Initialize frontend with Vite and React
cd frontend # 進入前端目錄
npm create vite@latest . # 用 Vite 建立 React 專案
```

- 選項：React、JavaScript、No（是否開啟實驗功能）、Yes（執行 npm 安裝與啟動）

---

### 3. 初始化後端並安裝 dependencies

切換到 `backend` 目錄，初始化 Node.js 專案：

```bash
# Initialize backend Node.js project
cd ../backend # 切換到後端目錄
npm init -y # 初始化 Node.js 專案
```

安裝主要後端 dependencies：

```bash
# Install main backend dependencies
npm i express mongoose dotenv jsonwebtoken bcryptjs cookie-parser cloudinary socket.io # 安裝主要後端套件
```

安裝開發 dependencies（nodemon）：

```bash
# Install development dependencies (nodemon)
npm i nodemon -D # 安裝 nodemon 作為開發依賴
```

---

### 4. 建立後端 entry point

新增 `src` 資料夾與 `index.js` 檔案：

```bash
mkdir src # 建立 src 資料夾
touch src/index.js # 建立 index.js 作為 entry point
```

實作基本 Express 伺服器：

```js
// src/index.js
import express from "express";

const app = express(); // 建立 Express 應用程式

app.listen(5001, () => {
  // 啟動伺服器並監聽 5001 port
  console.log("Server is running on port 5001");
});
```

---

### 5. 設定 package.json

設定 entry point 與 script：

```json
// package.json
"main": "src/index.js", // 設定 entry point
"scripts": {
  "dev": "nodemon src/index.js" // 開發時啟動 nodemon
},
"type": "module", // 使用 ES module 語法
```

---

### 6. 建立專案結構

建立標準後端目錄：

```bash
mkdir routes models middleware lib controllers # 建立標準後端目錄
```

---

### 7. 建立 auth route

新增 auth route 檔案：

```js
// routes/auth.route.js
import express from "express";
const router = express.Router(); // 建立路由物件

// 註冊 signup 路由
router.post("/signup", (req, res) => {
  res.send("signup route");
});

// 註冊 login 路由
router.post("/login", (req, res) => {
  res.send("login route");
});

// 註冊 logout 路由
router.post("/logout", (req, res) => {
  res.send("logout route");
});

export default router; // 匯出路由
```

在 index 中 import 並使用 auth route：

```js
// src/index.js
import authRoutes from "../routes/auth.route.js";
// 掛載 auth 路由到 /api/auth
app.use("/api/auth", authRoutes);
```

### 8. 實作 auth controller

建立 auth controller 函式：

```js
// controllers/auth.controller.js
// 註冊 signup controller
export const signup = (req, res) => {
  res.send("signup route");
};

// 註冊 login controller
export const login = (req, res) => {
  res.send("login route");
};

// 註冊 logout controller
export const logout = (req, res) => {
  res.send("logout route");
};
```

在 auth route 中 import controller 並使用：

```js
// routes/auth.route.js
import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// 使用 controller 處理 signup/login/logout 路由
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
```

---

## 總結

此架構建立了一個可擴展、易於維護的聊天應用程式基礎，方便後續功能開發。

---

<br />
<br />
<br />

<a name="en"></a>

# English Version - Project Setup

## Goal

Establish the project foundation for a chat application, including frontend and backend separation, essential tooling, and initial authentication route/controller scaffolding.

---

## Steps

### 1. Create Frontend and Backend Directories

```bash
mkdir frontend backend
```

---

### 2. Initialize Frontend with Vite

Navigate to the `frontend` directory and initialize a React project using Vite:

```bash
cd frontend
npm create vite@latest .
```

- Select: React, JavaScript, No (for experiment function), Yes (for npm install and run)

---

### 3. Initialize Backend and Install Dependencies

Navigate to the `backend` directory and initialize a Node.js project:

```bash
cd ../backend
npm init -y
```

Install essential backend dependencies:

```bash
npm i express mongoose dotenv jsonwebtoken bcryptjs cookie-parser cloudinary socket.io
```

Install development dependencies:

```bash
npm i nodemon -D
```

---

### 4. Create Backend Entry Point

Create a `src` directory and an `index.js` file:

```bash
mkdir src
touch src/index.js
```

Implement a basic Express server:

```js
// src/index.js
import express from "express";

const app = express();

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
```

---

### 5. Configure package.json

Set the entry point and scripts in `package.json`:

```json
// package.json
"main": "src/index.js",
"scripts": {
  "dev": "nodemon src/index.js"
},
"type": "module",
```

---

### 6. Create Project Structure

Establish standard backend folders:

```bash
mkdir routes models middleware lib controllers
```

---

### 7. Scaffold Authentication Routes

Create an authentication route file:

```js
// routes/auth.route.js
import express from "express";
const router = express.Router();

router.post("/signup", (req, res) => {
  res.send("signup route");
});

router.post("/login", (req, res) => {
  res.send("login route");
});

router.post("/logout", (req, res) => {
  res.send("logout route");
});

export default router;
```

Import and use the authentication routes in your entry point:

```js
// src/index.js
import authRoutes from "../routes/auth.route.js";
app.use("/api/auth", authRoutes);
```

---

### 8. Implement Authentication Controllers

Create controller functions for authentication:

```js
// controllers/auth.controller.js
export const signup = (req, res) => {
  res.send("signup route");
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
```

Update the authentication route to use controllers:

```js
// routes/auth.route.js
import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
```

---

## Summary

This setup establishes a scalable and maintainable foundation for further development.
