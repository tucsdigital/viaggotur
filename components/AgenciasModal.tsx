'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Eye, EyeOff, ExternalLink, Loader2, LogOut, Shield } from 'lucide-react';
import { getAuthInstance, db } from '@/lib/firebase';
import { configureAuthPersistence } from '@/lib/auth/authConfig';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getBrandLogoSrc, isRemoteUrl, renderTemplate, siteConfig } from '@/lib/siteConfig';

const inputClass =
  'h-11 rounded-xl border border-gray-200/80 bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] focus-visible:border-primary/40 focus-visible:ring-primary/20';

function safeDriveUrl(value: unknown): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return null;
    const host = u.hostname.toLowerCase();
    if (host !== 'drive.google.com' && host !== 'docs.google.com') return null;
    return u.toString();
  } catch {
    return null;
  }
}

async function loadDriveUrl(): Promise<string | null> {
  const snap = await getDoc(doc(db, 'settings', 'agencias'));
  if (!snap.exists()) return null;
  return safeDriveUrl(snap.data()?.driveUrl);
}

type AgenciasModalContextValue = { openAgencias: () => void };

const AgenciasModalContext = createContext<AgenciasModalContextValue>({ openAgencias: () => {} });

export function useAgenciasModal() {
  return useContext(AgenciasModalContext);
}

export function AgenciasModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openAgencias = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ openAgencias }), [openAgencias]);

  return (
    <AgenciasModalContext.Provider value={value}>
      {children}
      <AgenciasModal open={open} onOpenChange={setOpen} />
    </AgenciasModalContext.Provider>
  );
}

function AgenciasModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [driveUrl, setDriveUrl] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);

  const logoSrc = getBrandLogoSrc();
  const logoAlt = useMemo(
    () => renderTemplate(siteConfig.branding.logo.altTextTemplate || '{{siteName}} Logo'),
    []
  );

  useEffect(() => {
    if (!open) return;
    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [open]);

  useEffect(() => {
    if (!open || !user) return;
    let active = true;
    setUrlLoading(true);
    loadDriveUrl()
      .then((url) => {
        if (active) setDriveUrl(url);
      })
      .catch(() => {
        if (active) toast.error('No pudimos cargar la información');
      })
      .finally(() => {
        if (active) setUrlLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const auth = getAuthInstance();
      await configureAuthPersistence(auth, rememberMe);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword('');
    } catch (error) {
      let description = 'Verificá tus credenciales';
      if (error && typeof error === 'object' && 'code' in error) {
        const code = String((error as any).code || '');
        if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
          description = 'Email o contraseña incorrectos';
        } else if (code === 'auth/too-many-requests') {
          description = 'Demasiados intentos. Probá más tarde';
        } else if (code === 'auth/user-disabled') {
          description = 'Cuenta deshabilitada';
        } else if (code === 'auth/network-request-failed') {
          description = 'Error de conexión. Verificá tu internet';
        }
      }
      toast.error('No pudimos iniciar sesión', { description });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuthInstance());
      setDriveUrl(null);
    } catch {
      toast.error('No pudimos cerrar sesión');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-black/40 backdrop-blur-md"
        className="w-[calc(100%-2rem)] max-w-md max-h-[90dvh] overflow-y-auto gap-0 rounded-3xl border border-secondary/30 bg-white p-0 shadow-[0_20px_50px_rgb(0,0,0,0.18)] sm:max-w-md"
      >
        <div className="px-5 py-5 sm:px-8 sm:py-6 border-b border-gray-100 pr-12 sm:pr-14">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.24em] text-gray-500 font-bold">Agencias</div>
                <DialogTitle className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {user ? 'Bienvenido' : 'Ingresar'}
                </DialogTitle>
              </div>
            </div>
            <div className="h-8 sm:h-10 flex items-center shrink-0">
              {isRemoteUrl(logoSrc) ? (
                <img src={logoSrc} alt={logoAlt} className="h-full w-auto max-w-[96px] object-contain" />
              ) : (
                <Image src={logoSrc} alt={logoAlt} width={176} height={72} className="h-full w-auto max-w-[96px] object-contain" />
              )}
            </div>
          </div>
          <DialogDescription className="sr-only">Acceso para agencias</DialogDescription>
        </div>

        <div className="p-5 sm:p-8">
          {!authReady ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : user ? (
            <div className="space-y-4">
              {urlLoading ? (
                <Button disabled className="w-full h-11 rounded-2xl">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando…
                </Button>
              ) : driveUrl ? (
                <Button asChild className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl shadow-sm">
                  <a href={driveUrl} target="_blank" rel="noreferrer">
                    Ver información
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <>
                  <Button disabled className="w-full h-11 rounded-2xl">
                    Ver información
                  </Button>
                  <p className="text-center text-xs text-gray-500">No disponible por el momento.</p>
                </>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="mx-auto flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="agencias-email">Email</Label>
                <Input
                  id="agencias-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agencias-password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="agencias-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className={`${inputClass} pr-11`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(Boolean(v))} />
                Recordarme
              </label>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ingresando…
                  </>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
