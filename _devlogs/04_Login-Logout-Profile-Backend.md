# 實作登入﹑登出﹑更新大頭貼 / Implement Login, Logout, Update Profile

- [中文版](#zh)
- [English](#en)

---

<a name="zh"></a>

# 中文版 - 實作登入﹑登出﹑更新大頭貼

---

## 目標

為後端服務提供安全的使用者認證端點，包括登入、登出、大頭貼更新，以及認證檢查。

## 步驟

### 1. 實作登入功能（`auth.controller.js`）

```js
# Login controller function
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
```

### 2. 實作登出功能（`auth.controller.js`）

```js
# Logout controller function
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
```

### 3. 新增大頭貼修改端點（第 1 部分）

- 在 `auth.route.js`：

  ```js
  router.put("/update-profile", protectRoute, updateProfile);
  ```

- 在 `index.js`：

  ```js
  import cookieParser from "cookie-parser";
  app.use(cookieParser());
  ```

- 在 `backend/src/middleware` 新增 `auth.middleware.js`：

  ```js
  import jwt from "jsonwebtoken";
  import User from "../models/user.model.js";

  export const protectRoute = async (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized - No Token Provided" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid Token" });
      }
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("protectRoute middleware error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  ```

- 在 `auth.route.js`：

  ```js
  import { protectRoute } from "../middleware/auth.middleware.js";
  import { updateProfile } from "../controllers/auth.controller.js";
  ```

### 4. 新增大頭貼修改端點（第 2 部分）

1. 註冊 [Cloudinary](https://cloudinary.com/) 帳號以啟用圖片上傳功能。
2. 在 Cloudinary 控制台複製 Cloud Name，並加入 `.env` 檔案：

   ```env
   CLOUDINARY_CLOUD_NAME=<cloud name>
   ```

3. 在 Cloudinary 設定中產生新的 API key 與 secret，並加入 `.env` 檔案：

   ```env
   CLOUDINARY_API_KEY=<api key>
   CLOUDINARY_API_SECRET=<api secret>
   ```

4. 在 `/backend/src/lib` 建立 `cloudinary.js`：

   ```js
   import { v2 as cloudinary } from "cloudinary";
   import { config } from "dotenv";

   config();

   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   });

   export default cloudinary;
   ```

5. 在 `auth.controller.js` 實作大頭貼更新邏輯：

   ```js
   import cloudinary from "../lib/cloudinary.js";

   export const updateProfile = async (req, res) => {
     try {
       const { profilePic } = req.body;
       const userId = req.user._id;
       if (!profilePic) {
         return res
           .status(400)
           .json({ message: "Profile picture is required" });
       }
       const uploadResponse = await cloudinary.uploader.upload(profilePic);
       const updatedUser = await User.findByIdAndUpdate(
         userId,
         { profilePic: uploadResponse.secure_url },
         { new: true }
       );
       res.status(200).json(updatedUser);
     } catch (error) {
       console.error("Update profile error:", error.message);
       res.status(500).json({ message: "Internal Server Error" });
     }
   };
   ```

### 5. 新增認證檢查端點

- 在 `auth.route.js`：

  ```js
  router.get("/check", protectRoute, checkAuth);
  ```

- 在 `auth.controller.js`：

  ```js
  export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.error("checkAuth error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  ```

---

<br />
<br />
<br />

<a name="en"></a>

# English Version – Implementing Login, Logout, Update Profile

## Goal

Provide secure user authentication endpoints, including login, logout, profile picture update, and authentication check for the backend service.

## Steps

### 1. Implement the Login Function (`auth.controller.js`)

```js
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
```

### 2. Implement the Logout Function (`auth.controller.js`)

```js
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
```

### 3. Add Profile Picture Update Endpoint (Part 1)

- In `auth.route.js`:

  ```js
  router.put("/update-profile", protectRoute, updateProfile);
  ```

- In `index.js`:

  ```js
  import cookieParser from "cookie-parser";
  app.use(cookieParser());
  ```

- In `backend/src/middleware`, add `auth.middleware.js`:

  ```js
  import jwt from "jsonwebtoken";
  import User from "../models/user.model.js";

  export const protectRoute = async (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized - No Token Provided" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid Token" });
      }
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("protectRoute middleware error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  ```

- In `auth.route.js`:

  ```js
  import { protectRoute } from "../middleware/auth.middleware.js";
  import { updateProfile } from "../controllers/auth.controller.js";
  ```

### 4. Add Profile Picture Update Endpoint (Part 2)

1. Register for a [Cloudinary](https://cloudinary.com/) account to enable image uploads.
2. In the Cloudinary dashboard, copy your Cloud Name and add it to your `.env` file:

   ```env
   CLOUDINARY_CLOUD_NAME=<cloud name>
   ```

3. In Cloudinary settings, generate a new API key and secret. Add these to your `.env` file:

   ```env
   CLOUDINARY_API_KEY=<api key>
   CLOUDINARY_API_SECRET=<api secret>
   ```

4. Create `cloudinary.js` in `/backend/src/lib`:

   ```js
   import { v2 as cloudinary } from "cloudinary";
   import { config } from "dotenv";

   config();

   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   });

   export default cloudinary;
   ```

5. In `auth.controller.js`, implement the profile update logic:

   ```js
   import cloudinary from "../lib/cloudinary.js";

   export const updateProfile = async (req, res) => {
     try {
       const { profilePic } = req.body;
       const userId = req.user._id;
       if (!profilePic) {
         return res
           .status(400)
           .json({ message: "Profile picture is required" });
       }
       const uploadResponse = await cloudinary.uploader.upload(profilePic);
       const updatedUser = await User.findByIdAndUpdate(
         userId,
         { profilePic: uploadResponse.secure_url },
         { new: true }
       );
       res.status(200).json(updatedUser);
     } catch (error) {
       console.error("Update profile error:", error.message);
       res.status(500).json({ message: "Internal Server Error" });
     }
   };
   ```

### 5. Add Authentication Check Endpoint

- In `auth.route.js`:

  ```js
  router.get("/check", protectRoute, checkAuth);
  ```

- In `auth.controller.js`:

  ```js
  export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.error("checkAuth error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  ```
