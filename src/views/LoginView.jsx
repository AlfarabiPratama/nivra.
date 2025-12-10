import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
} from "../services/authService";
import { useToastStore } from "../store/useToastStore";
import { useThemeStore } from "../store/useThemeStore";
import { Sprout, LogIn, Mail } from "lucide-react";

export const LoginView = () => {
  const { addToast } = useToastStore();
  const { isDarkMode } = useThemeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("signin"); // 'signin' or 'signup'
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result) {
        addToast("berhasil masuk dengan google", "success");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      // Show the custom friendly error message or default
      const message = error.message || "gagal masuk. coba lagi.";
      addToast(message, "error");

      // If popup blocked, show email form as alternative
      if (error.code === "auth/popup-blocked") {
        setShowEmailForm(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("isi email dan password", "error");
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (mode === "signup") {
        result = await signUpWithEmail(email, password);
        addToast("akun berhasil dibuat! 🎉", "success");
      } else {
        result = await signInWithEmail(email, password);
        addToast("berhasil masuk", "success");
      }
    } catch (error) {
      console.error("Email auth error:", error);
      const message =
        error.code === "auth/email-already-in-use"
          ? "email sudah digunakan"
          : error.code === "auth/weak-password"
          ? "password terlalu lemah (min 6 karakter)"
          : error.code === "auth/user-not-found"
          ? "user tidak ditemukan"
          : error.code === "auth/wrong-password"
          ? "password salah"
          : "gagal. coba lagi.";
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      addToast("masukkan email terlebih dahulu", "error");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      addToast("email reset password terkirim", "success");
      setShowForgotPassword(false);
    } catch (error) {
      console.error("Reset password error:", error);
      addToast("gagal mengirim email reset", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-color) p-4 md:p-6">
      {/* Noise Overlay */}
      <div className={isDarkMode ? "bg-noise-dark" : "bg-noise-light"}></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-8 md:p-12" variant="solid">
            {/* Logo & Branding */}
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-(--accent)/5 border-2 border-dashed border-(--accent)/30 mb-6">
                <Sprout
                  size={40}
                  className="text-(--accent)"
                  strokeWidth={1.5}
                />
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-(--text-main) mb-3 tracking-tight">
                nivra.
              </h1>
              <p className="font-mono text-xs md:text-sm text-(--text-muted) lowercase tracking-wider border-l-2 border-(--accent) pl-4 inline-block">
                ruang digital tenang
              </p>
            </div>

            {/* Tagline */}
            <div className="mb-10 text-center border-t border-b border-dashed border-(--border-color) py-6">
              <p className="font-serif italic text-sm md:text-base text-(--text-muted) leading-relaxed">
                "perlahan tapi pasti,
                <br />
                <span className="text-(--text-main)">
                  bacalah dengan hatimu."
                </span>
              </p>
            </div>

            {/* Email/Password Form Toggle */}
            {showEmailForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-8"
              >
                {/* Tab Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setMode("signin")}
                    className={`flex-1 font-mono text-xs uppercase py-2 border-b-2 transition-all duration-500 ${
                      mode === "signin"
                        ? "border-(--accent) text-(--accent)"
                        : "border-dashed border-(--border-color) text-(--text-muted)"
                    }`}
                  >
                    masuk
                  </button>
                  <button
                    onClick={() => setMode("signup")}
                    className={`flex-1 font-mono text-xs uppercase py-2 border-b-2 transition-all duration-500 ${
                      mode === "signup"
                        ? "border-(--accent) text-(--accent)"
                        : "border-dashed border-(--border-color) text-(--text-muted)"
                    }`}
                  >
                    daftar
                  </button>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailAuth} className="space-y-6">
                  <div>
                    <label className="font-mono text-xs text-(--text-muted) uppercase block mb-2">
                      email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      variant="underline"
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-(--text-muted) uppercase block mb-2">
                      password
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      variant="underline"
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(!showForgotPassword)}
                      className="font-mono text-xs text-(--text-muted) hover:text-(--accent) border-b border-dashed border-transparent hover:border-(--accent) transition-all duration-500"
                    >
                      lupa password?
                    </button>
                  )}

                  {showForgotPassword && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-(--bg-color)/30 border border-dashed border-(--border-color)"
                    >
                      <p className="font-mono text-xs text-(--text-muted) mb-3">
                        masukkan email di atas, lalu klik tombol ini:
                      </p>
                      <Button
                        variant="ghost"
                        onClick={handleForgotPassword}
                        disabled={isLoading}
                        className="w-full"
                        noBrackets
                      >
                        kirim email reset
                      </Button>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    variant="accent"
                    disabled={isLoading}
                    loading={isLoading}
                    className="w-full"
                  >
                    <Mail size={18} />
                    <span>{mode === "signin" ? "masuk" : "daftar"}</span>
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowEmailForm(false)}
                    className="font-mono text-xs text-(--text-muted) border-b border-dashed border-(--text-muted) hover:text-(--accent) hover:border-(--accent) transition-all duration-500"
                  >
                    gunakan metode lain
                  </button>
                </div>
              </motion.div>
            )}

            {/* Social Sign In Options */}
            {!showEmailForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-5"
              >
                <Button
                  variant="accent"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  loading={isLoading}
                  className="w-full"
                >
                  <LogIn size={18} />
                  <span>masuk dengan google</span>
                </Button>

                <Button
                  variant="primary"
                  onClick={() => setShowEmailForm(true)}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Mail size={18} />
                  <span>masuk dengan email</span>
                </Button>
              </motion.div>
            )}

            {/* Info Note */}
            <div className="mt-10 p-5 bg-(--bg-color)/30 border-2 border-dashed border-(--border-color)">
              <p className="font-mono text-xs text-(--text-muted) leading-relaxed">
                <span className="text-(--accent) font-semibold">
                  → rekomendasi:
                </span>
                <br />
                <span className="text-[11px]">
                  masuk dengan google atau email untuk sync data di semua
                  device.
                </span>
              </p>
            </div>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="font-mono text-xs text-(--text-muted) lowercase">
              made with ❤️ by alfarabi pratama
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
