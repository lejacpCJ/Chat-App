# 實作註冊後端功能 / Sign Up Backend

- [中文版](#zh)
- [English](#en)

---

<a name="zh"></a>

# 中文版 - 實作註冊後端功能

## 目標

為 Chat-App 實作後端 signup 功能，遵循 authentication、validation 及 error handling 的最佳實踐。

---

## 步驟

### 1. 啟用 JSON Request Parsing

在 `index.js`，於所有 routes 前加入以下 middleware，讓 Express 應用程式能解析傳入的 JSON payload：

```js
# Enable JSON request parsing middleware in Express
app.use(express.json());
```

---

### 2. 實作 JWT Token 工具函式

建立 `backend/src/lib/utils.js`，新增一個 utility function 用於產生 JWT token 並將其設為 HTTP-only cookie：

```js
# Utility function to generate JWT and set as HTTP-only cookie
import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms form
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
```

# Environment variable for JWT secret

---

### 3. 設定環境變數

在 `.env` 檔案中，設定下列環境變數以支援 authentication 與環境組態：

```
JWT_SECRET=<your-secret-key>
NODE_ENV=development
```

---

### 4. 實作 Signup Controller

於 `auth.controller.js` 實作 signup 邏輯，包含輸入驗證、密碼 hashing、錯誤處理：

```js
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    // Check for existing user
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists." });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
```

---

<br />
<br />
<br />

<a name="en"></a>

# English Version - Sign Up Backend

## Goal

Implement a secure and robust backend signup functionality for the Chat-App, following best practices for authentication, validation, and error handling.

## Steps

### 1. Enable JSON Request Parsing

In `index.js`, ensure the Express application can parse incoming JSON payloads by adding the following middleware before your routes:

```js
app.use(express.json());
```

### 2. Implement JWT Token Utility

Create `backend/src/lib/utils.js` with a utility function to generate JWT tokens and set them as HTTP-only cookies:

```js
import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Mitigates XSS attacks
    sameSite: "strict", // Mitigates CSRF attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
```

### 3. Configure Environment Variables

In your `.env` file, define the following environment variables to support authentication and environment configuration:

```
JWT_SECRET=<your-secret-key>
NODE_ENV=development
```

### 4. Implement the Signup Controller

In `auth.controller.js`, implement the signup logic with input validation, password hashing, and error handling:

```js
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    // Check for existing user
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists." });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
```
