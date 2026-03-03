import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine redirect path and optional album/state payload reliably.
  const resolveRedirect = () => {
    const rawFrom = location.state?.from;
    let path = "/";
    if (rawFrom) {
      if (typeof rawFrom === "string") {
        path = rawFrom;
      } else {
        // extract pathname/string, then append any search/query component
        if (rawFrom.pathname) path = rawFrom.pathname;
        else if (rawFrom.to) path = rawFrom.to;
        // add search if provided
        if (rawFrom.search) path += rawFrom.search;
      }
    }

    const albumPayload = rawFrom?.album ?? rawFrom?.state?.album ?? location.state?.album ?? null;
    return { path, albumPayload };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(email, password);
    const { path, albumPayload } = resolveRedirect();
    if (result.success) {
      setMessage(null);
      if (albumPayload) {
        navigate(path, { replace: true, state: albumPayload });
      } else {
        navigate(path, { replace: true });
      }
    } else {
      setMessage(result.message || "Login failed");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const result = register(email, password);
    const { path, albumPayload } = resolveRedirect();
    if (result.success) {
      setMessage("Account created, you are now logged in");
      if (albumPayload) {
        navigate(path, { replace: true, state: albumPayload });
      } else {
        navigate(path, { replace: true });
      }
    } else {
      setMessage(result.message || "Signup failed");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-primary/10 px-6 md:px-20 py-4 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-background-dark">
            <span className="material-symbols-outlined font-bold">music_note</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">MelodyStream</h2>
        </div>

        <div className="ml-auto">
          <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-semibold">Home</Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative">
        {/* Background blur circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-[480px] z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black tracking-tight mb-3">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400">Join millions of music lovers and start your journey.</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-primary/10 rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden p-6 space-y-6">
            {message && <div className="text-sm text-red-600 dark:text-red-400 mb-2">{message}</div>}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-4 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Keep me logged in</span>
            </div>

            {/* Login and Signup buttons side-by-side */}
            <div className="flex gap-4">
              <button type="button" onClick={handleSignup} className="flex-1 py-4 rounded-xl bg-primary text-background-dark font-black text-base shadow-lg hover:-translate-y-0.5 transition-all">sign up</button>
              <button type="submit" className="flex-1 py-4 rounded-xl bg-primary text-background-dark font-black text-base shadow-lg hover:-translate-y-0.5 transition-all">Log In</button>
            </div>

          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-8 border-t border-slate-200 dark:border-primary/10 text-center">
        <p className="text-xs text-slate-500">© 2024 MelodyStream. Designed for music lovers worldwide.</p>
      </footer>

    </div>
  );
}