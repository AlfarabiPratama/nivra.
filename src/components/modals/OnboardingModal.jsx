import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppStore } from '../../store/useAppStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Sprout } from 'lucide-react';

export const OnboardingModal = ({ onComplete }) => {
  const { setUserName, user } = useAppStore();
  const [name, setName] = useState(user.name || '');
  const [step, setStep] = useState(1);

  const handleComplete = () => {
    if (name.trim()) {
      setUserName(name.trim());
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-(bg-color)/95 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="max-w-xl w-full page-enter">
        <Card>
          <div className="space-y-6 p-6">
            {/* Logo */}
            <div className="text-center">
              <img 
                src={useThemeStore.getState().isDarkMode ? '/dark mode nivra.png' : '/nivra light mode .png'} 
                alt="Nivra Logo" 
                className="w-40 h-auto mx-auto mb-4 opacity-90 transition-opacity duration-300"
              />
              <p className="font-mono text-xs text-(text-muted) uppercase tracking-widest">
                digital sanctuary
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-(border-color)" />

            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-serif italic text-(text-main)">
                    selamat datang.
                  </h2>
                  <p className="font-mono text-sm text-(text-muted)">
                    nivra adalah ruang digital untuk produktivitas yang tenang.<br />
                    tidak ada hustle, tidak ada rush.<br />
                    hanya kamu dan pertumbuhanmu.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4">
                  <div className="text-center space-y-2">
                    <div className="text-3xl">📚</div>
                    <p className="font-mono text-xs text-(text-muted)">
                      track bacaanmu
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl">✍️</div>
                    <p className="font-mono text-xs text-(text-muted)">
                      refleksi harian
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl">🌱</div>
                    <p className="font-mono text-xs text-(text-muted)">
                      tumbuh perlahan
                    </p>
                  </div>
                </div>

                <Button 
                  variant="accent"
                  onClick={() => setStep(2)}
                  className="w-full"
                >
                  mulai perjalanan
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-serif italic text-(text-main)">
                    siapa namamu?
                  </h2>
                  <p className="font-mono text-xs text-(text-muted)">
                    atau panggilan yang kamu suka
                  </p>
                </div>

                <div className="flex justify-center">
                  <Input
                    placeholder="nama atau panggilan..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && name.trim()) {
                        setStep(3);
                      }
                    }}
                    variant="box"
                    className="text-center text-lg max-w-xs"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 justify-center max-w-xs mx-auto">
                  <Button 
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    kembali
                  </Button>
                  <Button 
                    variant="accent"
                    onClick={() => setStep(3)}
                    disabled={!name.trim()}
                    className="flex-1"
                  >
                    lanjut
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">🌱</div>
                  <h2 className="text-2xl font-serif italic text-(text-main)">
                    hai, {name}.
                  </h2>
                  <p className="font-mono text-sm text-(text-muted)">
                    tamanmu dimulai sebagai benih.<br />
                    dengan setiap task selesai, buku dibaca, dan jurnal ditulis,<br />
                    tamanmu akan tumbuh.
                  </p>
                  
                  <div className="border-t border-dashed border-(border-color) pt-4 mt-4">
                    <p className="font-serif italic text-base text-(text-main)">
                      "satu langkah pada satu waktu."
                    </p>
                  </div>
                </div>

                <Button 
                  variant="accent"
                  onClick={handleComplete}
                  className="w-full"
                >
                  masuk ke nivra
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
