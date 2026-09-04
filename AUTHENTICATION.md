# AUTHENTICATION.md — EduQuest Authentication & Security Architecture

EduQuest uses **Supabase Auth** as the sole identity provider. The system strictly isolates passwords, utilizes cryptographic tokens, and never stores credentials in client-accessible code.

---

## 1. Authentication Flows

### 1.1 Email & Password Registration
* **Route:** `/auth/register`
* **Method:** `supabase.auth.signUp({ email, password, options: { data: { username } } })`
* **Process:**
  1. Child or parent enters username, email, and password.
  2. On submission, Supabase creates the `auth.users` record.
  3. A PostgreSQL trigger automatically creates the initial player profile in `public.profiles` with `level: 1`, `coins: 100`, `lives: 3`, `streak: 1`.
  4. If email confirmation is enabled on Supabase, the user is redirected to `/auth/verify-email`. Otherwise, the session is created and the player is routed directly to `/world`.

### 1.2 Email & Password Login
* **Route:** `/auth/login`
* **Method:** `supabase.auth.signInWithPassword({ email, password })`
* **Process:**
  1. Player inputs email and password.
  2. Supabase verifies credentials and returns a signed JWT access token and refresh token.
  3. `AuthContext` updates its `user` and `session` state.
  4. Player is smoothly redirected to `/world`.

### 1.3 Google OAuth Login
* **Trigger:** "Masuk dengan Google" button on `/auth/login` and `/auth/register`.
* **Method:**
  ```javascript
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  ```
* **Callback Route:** `/auth/callback`
  The callback page parses the hash or code fragments, establishes the Supabase session, syncs the user profile, and navigates to `/world`.

### 1.4 Password Recovery (Forgot & Reset)
* **Forgot Password Route:** `/auth/forgot-password`
  - Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/reset-password` })`
  - Shows friendly confirmation: *"Tautan pemulihan telah dikirim ke email orang tuamu!"*
* **Reset Password Route:** `/auth/reset-password`
  - Calls `supabase.auth.updateUser({ password: newPassword })`
  - On success, displays confirmation and routes to `/auth/login`.

### 1.5 Session Persistence & Logout
* **Session Storage:** Tokens are securely stored in browser `localStorage` by Supabase Client.
* **Auto-refresh:** Expired JWT access tokens are transparently refreshed using the refresh token.
* **Logout:**
  - Route/Action: `supabase.auth.signOut()`
  - Resets `AuthContext` and `GameContext`.
  - Redirects to public landing `/`.

---

## 2. Protected Routes Architecture

Protected routes are enforced via the `<ProtectedRoute>` wrapper:

```jsx
// src/components/auth/ProtectedRoute.jsx
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <GameLoadingScreen message="Menyiapkan petualangan..." />;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
```

### Protected Routes List
* `/world` and `/world/*`
* `/quest/*`
* `/discovery/*`
* `/game/*`
* `/rewards`
* `/daily-quests`
* `/collection`
* `/pets`
* `/achievements`
* `/character`
* `/profile`
* `/settings`

---

## 3. Child-Friendly Error Handling

Technical errors (e.g. `Invalid login credentials`, `PGRST116`) must **never** be exposed in the UI.

| Supabase Error Code | Child-Friendly UI Message (Bahasa Indonesia) |
|---|---|
| `invalid_credentials` | *"Email atau password belum sesuai. Coba periksa lagi ya!"* |
| `user_already_exists` | *"Email ini sudah terdaftar. Silakan masuk menggunakan akunmu!"* |
| `weak_password` | *"Password harus minimal 6 karakter agar akun petualangmu aman!"* |
| `network_error` | *"Sepertinya koneksi internet sedang istirahat. Periksa kembali ya!"* |
| Default / Unknown | *"Oops! Ada sedikit kendala. Yuk coba sekali lagi!"* |
