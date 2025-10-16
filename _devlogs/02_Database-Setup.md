# 資料庫設置 / Database Setup

- [中文版](#zh)
- [English](#en)

---

<a name="zh"></a>

# 中文版 - 資料庫設定

## 目標

提供一份為 Chat-App 專案設定 MongoDB 資料庫的逐步指南。內容涵蓋佈建 MongoDB Atlas Cluster、設定環境變數、在後端整合資料庫連線，以及定義使用者模型。

---

## 步驟

### 1. 佈建 MongoDB Atlas Cluster

1. 前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 並建立新專案。
2. 部署 free cluster（選擇合適的雲端供應商與區域）。
3. 建立 database user，並保存使用者名稱與密碼。
4. 在「Network Access」中加入你的 IP 位址，或 allow access from anywhere （僅限開發環境）。
5. 在「Clusters」中，點選「Connect」>「Connect your application」，並複製提供的 URI。
6. 將 URI 修改為在 `?` 查詢字串之前加入你的資料庫名稱（例如 `chat_db`）。

範例：

```
# Example MongoDB connection URI
mongodb+srv://<username>:<password>@<cluster-url>/chat_db?retryWrites=true&w=majority
```

---

### 2. 設定環境變數

1. 在 `/backend` 目錄中建立 `.env` 檔案。
2. 新增以下變數：

```env
# Environment variables for MongoDB and server port
 MONGODB_URI=<your-mongodb-uri>
 PORT=5001
```

---

### 3. 在應用程式中 import 環境變數

在 `/backend/src/index.js` 檔案最上方 import 環境變數：

```js
# Import and configure environment variables in backend/src/index.js
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
```

---

### 4. 實作資料庫連線邏輯

建立 `/backend/src/lib/db.js`，內容如下：

```js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};
```

在 `/backend/src/index.js` import 並呼叫 `connectDB`：

```js
import { connectDB } from "./lib/db.js";
connectDB();
```

---

### 5. 定義使用者模型

建立 `/backend/src/models/user.model.js`：

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
```

---

<br />
<br />
<br />

<a name="en"></a>

# English Version - Database Setup

## Goal

A step-by-step guide for setting up a MongoDB database for the Chat-App project. Covering provisioning a MongoDB Atlas cluster, configuring environment variables, integrating database connectivity in the backend, and defining the user model.

---

## Steps

### 1. Provision a MongoDB Atlas Cluster

1. Navigate to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a new project.
2. Deploy a free cluster (select the appropriate cloud provider and region).
3. Create a database user and securely store the username and password.
4. In the "Network Access" section, add your IP address or allow access from anywhere (for development only).
5. In the "Clusters" view, click "Connect" > "Connect your application" and copy the provided connection string (URI).
6. Modify the URI to include your database name (e.g., `chat_db`) before the `?` query string.

Example:

```
mongodb+srv://<username>:<password>@<cluster-url>/chat_db?retryWrites=true&w=majority
```

---

### 2. Configure Environment Variables

1. In the `/backend` directory, create a `.env` file.
2. Add the following variables:
   ```env
   MONGODB_URI=<your-mongodb-uri>
   PORT=5001
   ```

---

### 3. Integrate Environment Variables in Application

In `/backend/src/index.js`, load environment variables at the top of the file:

```js
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
```

---

### 4. Implement Database Connection Logic

Create `/backend/src/lib/db.js` with the following content:

```js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};
```

Import and invoke `connectDB` in `/backend/src/index.js`:

```js
import { connectDB } from "./lib/db.js";

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
```

---

### 5. Define the User Model

Create `/backend/src/models/user.model.js`:

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
```

---
