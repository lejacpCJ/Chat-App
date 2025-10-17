# 前端設置 / Frontend Setup

- [中文版](#zh)
- [English](#en)

---

<a name="zh"></a>

# 中文版 - 前端設置

## 目標

- 完成前端設置與頁面建立，並與後端連結

## 步驟

### 1. 安裝 tailwind CSS

- 進到 frontend 資料夾
- 安裝以下 packages

```
npm i react-router-dom react-hot-toast
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

- 在 `tailwind.config.js` ，加入 content

```js
// ... existing code
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // ... existing code
};
```

- 在 `src/index.css` 加入 tailwind

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- 刪除 `App.css`

- 建立 `App.jsx`

```js
const App = () => {
  return <div>Hello world</div>;
};

export default App;
```

### 2. 安裝 daisyUI (使用 4.12.24)

- 安裝 daisyUI

```
npm i -D daisyui@4.12.24
```

- 在 `tailwind.config.js` 中 import daisyUI

```js
import daisyui from "daisyui";
// ... existing code
export default {
  // ... existing code
  plugins: [daisyui],
};
```

### 3. import react-router-dom

- 在 `main.jsx` import react-router-dom

```js
// ... existing code

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

- 刪除 `src/assets`
- 建立 `src/pages` 與 `src/components`
- 在 `src/component`，建立 `Navbar.jsx`

```js
const Navbar = () => {
  return <div>Navbar</div>;
};

export default Navbar;
```

- 在 `App.jsx` 建立 Navbar 與 Route

```js
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Navbar />
      <Rtoues>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/settings" element={<SettingPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
      </Rtoues>
    </div>
  );
};

export default App;
```

### 4. 建立各頁面與前後端連結

- 頁面建立

```
cd frontend/src/pages
touch Homepage.jsx SignUpPage.jsx LoginPage.jsx SettingPage.jsx ProfilePage.jsx
```

- 在 `App.jsx` import 這些頁面

```js
// ... existing code

import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";

// ... existing code
```

- 安裝 axios, zustand

```
npm i axios zustand
```

- 建立 `/src/lib` , `axios.js`

```js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});
```

- 建立 `src/store`, `useAuthStore.js`

```js
import { create } from "zustand";
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  usUpdatingProfile: false,
  isCheckingAuth: true,
}));
```

- 在 `App.jsx` 使用 `useAuthStore`

```js
// ... existing code

import { useAuthStore } from "./store/useAuthStore";
const App = () => {
  const { authUser } = useAuthStore();

  // ... existing code
};
// ... existing code
```

- 在 `userAuthStore.js` 執行 `checkAuth`

```js
// ... existing code
import { axiosInstance } from "../lib/axios.js";
export const useAuthStore = create((set) => ({
  // ... existing code

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
```

- 在 `App.jsx` 使用 `useEffect`

```js
// ... existing code

import { useEffect } from "react";
const App = () => {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ... existing code
};

export default App;
```

- 為了連結前端與後端，回到 `/backend` 安裝 `cors`

```
npm i cors
```

- 在 `/backend/src` 的 `index.js` 使用 `cors`

```js
// ... existing code

import cors from "cors";

// ... existing code

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ... existing code
```

- 在 `/frontend` 安裝 `lucide-react`

```
npm i lucide-react
```

- 在 `App.jsx` 使用 `Loader`

```js
// ... existing code
import { Loader } from "lucide-react";
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (true)
    return (
      <div className="flex item-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  // ... existing code
};

export default App;
```

- 在 `App.jsx`，依據使用者登入情況，將使用者導轉至相對應頁面

```js
// ... existing code
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        ></Route>
        <Route path="/settings" element={<SettingPage />}></Route>
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
```

---

<br />
<br />
<br />

<a name="en"></a>

# English Version - Frontend Setup

## Goal

- Complete frontend setup and page creation, and connect with the backend

## Steps

### 1. Install tailwind CSS

- Go to the frontend folder
- Install the following packages

```
npm i react-router-dom react-hot-toast
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

- In `tailwind.config.js`, add content

```js
// ... existing code
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // ... existing code
};
```

- In `src/index.css`, add tailwind

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Delete `App.css`

- Create `App.jsx`

```js
const App = () => {
  return <div>Hello world</div>;
};

export default App;
```

### 2. Install daisyUI (use version 4.12.24)

- Install daisyUI

```
npm i -D daisyui@4.12.24
```

- In `tailwind.config.js`, import daisyUI

```js
import daisyui from "daisyui";
// ... existing code
export default {
  // ... existing code
  plugins: [daisyui],
};
```

### 3. Import react-router-dom

- In `main.jsx`, import react-router-dom

```js
// ... existing code

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

- Delete `src/assets`
- Create `src/pages` and `src/components`
- In `src/component`, create `Navbar.jsx`

```js
const Navbar = () => {
  return <div>Navbar</div>;
};

export default Navbar;
```

- In `App.jsx`, create Navbar and Route

```js
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Navbar />
      <Rtoues>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/settings" element={<SettingPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
      </Rtoues>
    </div>
  );
};

export default App;
```

### 4. Create each page and connect frontend and backend

- Create pages

```
cd frontend/src/pages
touch Homepage.jsx SignUpPage.jsx LoginPage.jsx SettingPage.jsx ProfilePage.jsx
```

- In `App.jsx`, import these pages

```js
// ... existing code

import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";

// ... existing code
```

- Install axios, zustand

```
npm i axios zustand
```

- Create `/src/lib`, `axios.js`

```js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});
```

- Create `src/store`, `useAuthStore.js`

```js
import { create } from "zustand";
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  usUpdatingProfile: false,
  isCheckingAuth: true,
}));
```

- In `App.jsx`, use `useAuthStore`

```js
// ... existing code

import { useAuthStore } from "./store/useAuthStore";
const App = () => {
  const { authUser } = useAuthStore();

  // ... existing code
};
// ... existing code
```

- In `userAuthStore.js`, implement `checkAuth`

```js
// ... existing code
import { axiosInstance } from "../lib/axios.js";
export const useAuthStore = create((set) => ({
  // ... existing code

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
```

- In `App.jsx`, use `useEffect`

```js
// ... existing code

import { useEffect } from "react";
const App = () => {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ... existing code
};

export default App;
```

- To connect frontend and backend, go back to `/backend` and install `cors`

```
npm i cors
```

- In `/backend/src`'s `index.js`, use `cors`

```js
// ... existing code

import cors from "cors";

// ... existing code

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ... existing code
```

- In `/frontend`, install `lucide-react`

```
npm i lucide-react
```

- In `App.jsx`, use `Loader`

```js
// ... existing code
import { Loader } from "lucide-react";
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (true)
    return (
      <div className="flex item-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  // ... existing code
};

export default App;
```

- In `App.jsx`, redirect users to the appropriate page based on login status

```js
// ... existing code
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        ></Route>
        <Route path="/settings" element={<SettingPage />}></Route>
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
```
