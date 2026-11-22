'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { ExternalLink, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase';

function validateDriveUrl(value: string): string | null {
  try {
    const u = new URL(value.trim());
    const host = u.hostname.toLowerCase();
    if (u.protocol !== 'https:') return null;
    if (host !== 'drive.google.com' && host !== 'docs.google.com') return null;
    return u.toString();
  } catch {
    return null;
  }
}

export default function AdminAgenciasPage() {
  const [driveUrl, setDriveUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'agencias'))
      .then((snap) => setDriveUrl(String(snap.data()?.driveUrl ?? '')))
      .catch(() => toast.error('No pudimos cargar la configuración'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = driveUrl.trim();
    const valid = trimmed ? validateDriveUrl(trimmed) : '';
    if (valid === null) {
      toast.error('Ingresá un link válido de Google Drive (https://drive.google.com/...)');
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'agencias'), { driveUrl: valid });
      setDriveUrl(valid);
      toast.success('Link guardado');
    } catch {
      toast.error('No pudimos guardar el link');
    } finally {
      setSaving(false);
    }
  };

  const testable = validateDriveUrl(driveUrl);

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agencias</h1>
            <p className="text-sm text-gray-600">
              Link de Drive que ven las agencias al hacer clic en &quot;Ver información&quot; en /agencias.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Link de Drive</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="driveUrl">URL</Label>
                    <Input
                      id="driveUrl"
                      type="url"
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                    />
                    <p className="text-xs text-gray-500">
                      El archivo o carpeta debe estar compartido como &quot;Cualquier persona con el enlace&quot;.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Guardar
                    </Button>
                    {testable && (
                      <Button asChild type="button" variant="outline">
                        <a href={testable} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Probar link
                        </a>
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
