# 實作訊息功能 / Message Feature Implementation

- [中文版](#zh)
- [English](#en)

---

<a name="zh"></a>

# 中文版 - 實作訊息功能

## 目標

實作使用者對使用者訊息傳遞功能所需的訊息 model、API 端點與 controller 邏輯。

## 步驟

### 1. 建立訊息 model（`/backend/src/models/message.model.js`）

```js
# Mongoose model for chat messages
import mongoose from "mongoose";
// Define message schema
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create Message model
const Message = mongoose.model("Message", messageSchema);

export default Message;
```

### 2. 在 `index.js` 註冊訊息 route

```js
# Register message route in Express
import messageRoutes from "./routes/message.route.js";
// Register message API route
app.use("/api/message", messageRoutes);
```

### 3. 建立訊息 route（`/backend/src/routes/message.route.js`）並新增側邊欄 endpoint

```js
# Create message route and add sidebar endpoint
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/message.controller.js";

const router = express.Router();

// Get all users except the logged-in user (sidebar)
router.get("/users", protectRoute, getUsersForSidebar);

export default router;
```

### 4. 建立訊息 controller（`/backend/src/controllers/message.controller.js`）

```js
import User from "../models/user.model.js";

// Controller to get all users except the currently logged-in user (for sidebar display)
export const getUsersForSidebar = async (req, res) => {
  try {
    // Get the ID of the logged-in user
    const loggedInUserId = req.user._id;
    // Find all users except the logged-in user, exclude password field
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    // Respond with filtered users
    res.status(200).json(filteredUsers);
  } catch (error) {
    // Handle server error
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

### 5. 在 `message.route.js` 新增取得訊息紀錄 endpoint

```js
import { getMessages } from "../controllers/message.controller.js";

// Get message history between logged-in user and another user
router.get("/:id", protectRoute, getMessages);
```

### 6. 在 `message.controller.js` 實作 `getMessages` 函式

```js
import Message from "../models/message.model.js";

// Controller to get all messages exchanged between the logged-in user and another user
export const getMessages = async (req, res) => {
  try {
    // Get the ID of the user to chat with from route params
    const { id: userToChatId } = req.params;
    // Get the ID of the logged-in user
    const myId = req.user._id;

    // Find all messages where either user is the sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    // Respond with messages
    res.status(200).json(messages);
  } catch (error) {
    // Handle server error
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

### 7. 在 `message.route.js` 新增發送訊息 endpoint

```js
import { sendMessage } from "../controllers/message.controller.js";

// Send a new message to another user
router.post("/send/:id", protectRoute, sendMessage);
```

### 8. 在 `message.controller.js` 實作 `sendMessage` 函式

```js
export const sendMessage = async (req, res) => {
  try {
    // Get message text and image from request body
    const { text, image } = req.body;
    // Get receiver ID from request body and sender ID from authenticated user
    const { id: receiverId } = req.body;
    const senderId = req.user._id;

    let imageUrl;
    // If image is provided, upload to Cloudinary
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Create new message document
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Save message to database
    await newMessage.save();

    // Respond with created message
    res.status(201).json(newMessage);
  } catch (error) {
    // Handle server error
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

---

<br />
<br />
<br />

<a name="en"></a>

# English Version – Message Feature Implementation

## Goal

This section describes the implementation of the message model, API endpoints, and controller logic required to enable user-to-user messaging functionality in the backend service.

## Steps

### 1. Create the message model (`/backend/src/models/message.model.js`)

```js
import mongoose from "mongoose";
// Define message schema
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create Message model
const Message = mongoose.model("Message", messageSchema);

export default Message;
```

### 2. Register the message route in `index.js`

```js
import messageRoutes from "./routes/message.route.js";
// Register message API route
app.use("/api/message", messageRoutes);
```

### 3. Create the message route (`/backend/src/routes/message.route.js`) and add the sidebar endpoint

```js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/message.controller.js";

const router = express.Router();

// Get all users except the logged-in user (sidebar)
router.get("/users", protectRoute, getUsersForSidebar);

export default router;
```

### 4. Create the message controller (`/backend/src/controllers/message.controller.js`)

```js
import User from "../models/user.model.js";

// Controller to get all users except the currently logged-in user (for sidebar display)
export const getUsersForSidebar = async (req, res) => {
  try {
    // Get the ID of the logged-in user
    const loggedInUserId = req.user._id;
    // Find all users except the logged-in user, exclude password field
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    // Respond with filtered users
    res.status(200).json(filteredUsers);
  } catch (error) {
    // Handle server error
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

### 5. Add endpoint to retrieve message history in `message.route.js`

```js
import { getMessages } from "../controllers/message.controller.js";

// Get message history between logged-in user and another user
router.get("/:id", protectRoute, getMessages);
```

### 6. Implement the `getMessages` function in `message.controller.js`

```js
import Message from "../models/message.model.js";

// Controller to get all messages exchanged between the logged-in user and another user
export const getMessages = async (req, res) => {
  try {
    // Get the ID of the user to chat with from route params
    const { id: userToChatId } = req.params;
    // Get the ID of the logged-in user
    const myId = req.user._id;

    // Find all messages where either user is the sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    // Respond with messages
    res.status(200).json(messages);
  } catch (error) {
    // Handle server error
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

### 7. Add send message endpoint in `message.route.js`

```js
import { sendMessage } from "../controllers/message.controller.js";

// Send a new message to another user
router.post("/send/:id", protectRoute, sendMessage);
```

### 8. Implement the `sendMessage` function in `message.controller.js`

```js
export const sendMessage = async (req, res) => {
  try {
    // Get message text and image from request body
    const { text, image } = req.body;
    // Get receiver ID from request body and sender ID from authenticated user
    const { id: receiverId } = req.body;
    const senderId = req.user._id;

    let imageUrl;
    // If image is provided, upload to Cloudinary
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Create new message document
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Save message to database
    await newMessage.save();

    // Respond with created message
    res.status(201).json(newMessage);
  } catch (error) {
    // Handle server error
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
```
