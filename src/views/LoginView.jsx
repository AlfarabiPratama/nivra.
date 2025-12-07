import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { signInWithGoogle, signInAnonymous } from "../services/authService";
import { useToastStore } from "../store/useToastStore";
import { Sprout, User, LogIn } from "lucide-react";

export const LoginView = () => {
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result) {
        addToast("Berhasil masuk dengan Google!", "success");
        // No need to navigate - App.jsx will auto-render main app when authenticated
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      addToast("Gagal masuk dengan Google. Coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = async () => {
    setIsLoading(true);
    try {
      const result = await signInAnonymous();
      if (result) {
        addToast("Masuk sebagai guest", "success");
        // No need to navigate - App.jsx will auto-render main app when authenticated
      }
    } catch (error) {
      console.error("Anonymous sign-in error:", error);
      addToast("Gagal masuk. Coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-color) p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-noise-light"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="p-8 md:p-10">
          {/* Logo & Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-(--accent)/10 rounded-full mb-4">
              <Sprout size={40} className="text-(--accent)" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-(--text-main) mb-2">
              Nivra
            </h1>
            <p className="font-mono text-sm text-(--text-muted)">
              productivity app minimalis
            </p>
          </div>

          {/* Tagline */}
          <div className="mb-8 text-center">
            <p className="font-serif italic text-(--text-muted)">
              "bacalah dengan hatimu."
            </p>
          </div>

          {/* Sign In Options */}
          <div className="space-y-4">
            {/* Google Sign-In (Primary) */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-(--accent) text-white hover:bg-(--accent)/90 transition-all duration-200"
            >
              <LogIn size={18} />
              <span className="font-medium">
                {isLoading ? "Memuat..." : "Masuk dengan Google"}
              </span>
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-(--border-color)"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-(--card-color) text-(--text-muted) font-mono">
                  atau
                </span>
              </div>
            </div>

            {/* Guest Mode */}
            <Button
              variant="ghost"
              onClick={handleGuestMode}
              disabled={isLoading}
              className="w-full"
            >
              <User size={18} />
              <span>Lanjutkan sebagai Guest</span>
            </Button>
          </div>

          {/* Info Note */}
          <div className="mt-8 p-4 bg-(--bg-color) border border-dashed border-(--border-color) rounded">
            <p className="font-mono text-xs text-(--text-muted) text-center">
              <strong className="text-(--text-main)">💡 Rekomendasi:</strong>
              <br />
              Masuk dengan Google untuk sync data di semua device dan mencegah
              kehilangan data.
            </p>
          </div>

          {/* Features Preview */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-(--bg-color)/50 rounded">
              <div className="text-2xl mb-1">🔄</div>
              <p className="font-mono text-xs text-(--text-muted)">
                Real-time Sync
              </p>
            </div>
            <div className="p-3 bg-(--bg-color)/50 rounded">
              <div className="text-2xl mb-1">☁️</div>
              <p className="font-mono text-xs text-(--text-muted)">
                Cloud Backup
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="font-mono text-xs text-(--text-muted)">
            Made with ❤️ and ☕ by Alfarabi Pratama
          </p>
        </div>
      </div>
    </div>
  );
};
