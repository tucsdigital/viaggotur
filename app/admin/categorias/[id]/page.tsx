'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { revalidateFrontPaths } from '@/lib/revalidate';
import { db } from '@/lib/firebase';
import { uploadMultipleImages } from '@/lib/utils/upload';
import { deleteBlobByKey, getBlobKeyFromUrl } from '@/lib/utils/blob';
import { Categoria } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/utils/slugify';
import ImageUploader from '@/components/admin/ImageUploader';
import DragDropOrderManager from '@/components/admin/DragDropOrderManager';

const formSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  destacada: z.boolean(),
  activa: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagenTarjetaPreview, setImagenTarjetaPreview] = useState<string[]>([]);
  const [imagenTarjetaOriginal, setImagenTarjetaOriginal] = useState<string>('');
  const [imagenTarjetaKey, setImagenTarjetaKey] = useState<string>('');
  const [originalImagenTarjetaKey, setOriginalImagenTarjetaKey] = useState<string | null>(null);

  const [imagenPortadaDesktopPreview, setImagenPortadaDesktopPreview] = useState<string[]>([]);
  const [imagenPortadaDesktopOriginal, setImagenPortadaDesktopOriginal] = useState<string>('');
  const [imagenPortadaDesktopKey, setImagenPortadaDesktopKey] = useState<string>('');
  const [originalImagenPortadaDesktopKey, setOriginalImagenPortadaDesktopKey] = useState<string | null>(null);

  const [imagenPortadaMobilePreview, setImagenPortadaMobilePreview] = useState<string[]>([]);
  const [imagenPortadaMobileOriginal, setImagenPortadaMobileOriginal] = useState<string>('');
  const [imagenPortadaMobileKey, setImagenPortadaMobileKey] = useState<string>('');
  const [originalImagenPortadaMobileKey, setOriginalImagenPortadaMobileKey] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const destacada = watch('destacada');
  const activa = watch('activa');

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const docRef = doc(db, 'categorias', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Categoria;
          setValue('nombre', data.nombre);
          setValue('descripcion', data.descripcion);
          setValue('destacada', data.destacada);
          setValue('activa', data.activa);

          const tarjetaUrl = data.imagenTarjeta || data.imagen || '';
          const tarjetaKey = data.imagenTarjetaKey ?? data.imagenKey ?? (tarjetaUrl ? getBlobKeyFromUrl(tarjetaUrl) : null);
          setImagenTarjetaOriginal(tarjetaUrl);
          setImagenTarjetaPreview(tarjetaUrl ? [tarjetaUrl] : []);
          setImagenTarjetaKey(tarjetaKey ?? '');
          setOriginalImagenTarjetaKey(tarjetaKey ?? null);

          const portadaDesktopUrl = data.imagenPortadaDesktop || data.imagenPortada || '';
          const portadaDesktopKey =
            data.imagenPortadaDesktopKey ?? data.imagenPortadaKey ?? (portadaDesktopUrl ? getBlobKeyFromUrl(portadaDesktopUrl) : null);
          setImagenPortadaDesktopOriginal(portadaDesktopUrl);
          setImagenPortadaDesktopPreview(portadaDesktopUrl ? [portadaDesktopUrl] : []);
          setImagenPortadaDesktopKey(portadaDesktopKey ?? '');
          setOriginalImagenPortadaDesktopKey(portadaDesktopKey ?? null);

          const portadaMobileUrl = data.imagenPortadaMobile || '';
          const portadaMobileKey =
            data.imagenPortadaMobileKey ?? (portadaMobileUrl ? getBlobKeyFromUrl(portadaMobileUrl) : null);
          setImagenPortadaMobileOriginal(portadaMobileUrl);
          setImagenPortadaMobilePreview(portadaMobileUrl ? [portadaMobileUrl] : []);
          setImagenPortadaMobileKey(portadaMobileKey ?? '');
          setOriginalImagenPortadaMobileKey(portadaMobileKey ?? null);
        } else {
          toast.error('Categoría no encontrada');
          router.push('/admin/categorias');
        }
      } catch (error) {
        console.error('Error fetching categoria:', error);
        toast.error('Error al cargar categoría');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, [id, router, setValue]);

  const onSubmit = async (data: FormData) => {
    if (imagenTarjetaPreview.length === 0) {
      toast.error('Debes agregar una imagen de tarjeta');
      return;
    }

    setSaving(true);
    try {
      let imagenTarjetaUrl = imagenTarjetaOriginal;
      let imagenTarjetaKeyToSave = imagenTarjetaKey;
      const tarjetaCambio = imagenTarjetaPreview[0] !== imagenTarjetaOriginal;

      if (tarjetaCambio) {
        toast.info('Subiendo nueva imagen de tarjeta...', { id: 'upload-card' });
        const files = imagenTarjetaPreview.map((preview, index) =>
          fetch(preview)
            .then((res) => res.blob())
            .then((blob) => new File([blob], `categoria-${Date.now()}-${index}.jpg`, { type: 'image/jpeg' }))
        );
        const resolvedFiles = await Promise.all(files);
        const [uploaded] = await uploadMultipleImages(resolvedFiles);
        imagenTarjetaUrl = uploaded.url;
        imagenTarjetaKeyToSave = uploaded.key;
        const keyToDelete = originalImagenTarjetaKey ?? getBlobKeyFromUrl(imagenTarjetaOriginal);
        if (keyToDelete) {
          await deleteBlobByKey(keyToDelete).catch((error) => {
            console.error('[categorias] error borrando blob:', error);
          });
        }
        toast.success('Imagen de tarjeta actualizada', { id: 'upload-card' });
      }

      let imagenPortadaDesktopUrl = imagenPortadaDesktopOriginal;
      let imagenPortadaDesktopKeyToSave = imagenPortadaDesktopKey;
      const portadaDesktopRemoved = imagenPortadaDesktopPreview.length === 0 && Boolean(imagenPortadaDesktopOriginal);
      const portadaDesktopCambio =
        imagenPortadaDesktopPreview.length > 0 && imagenPortadaDesktopPreview[0] !== imagenPortadaDesktopOriginal;

      if (portadaDesktopRemoved) {
        const keyToDelete = originalImagenPortadaDesktopKey ?? getBlobKeyFromUrl(imagenPortadaDesktopOriginal);
        if (keyToDelete) {
          toast.info('Eliminando portada desktop...', { id: 'delete-cover-desktop' });
          await deleteBlobByKey(keyToDelete).catch((error) => {
            console.error('[categorias] error borrando blob portada desktop:', error);
          });
          toast.dismiss('delete-cover-desktop');
        }
        imagenPortadaDesktopUrl = '';
        imagenPortadaDesktopKeyToSave = '';
      } else if (portadaDesktopCambio) {
        toast.info('Subiendo nueva portada desktop...', { id: 'upload-cover-desktop' });
        const files = imagenPortadaDesktopPreview.map((preview, index) =>
          fetch(preview)
            .then((res) => res.blob())
            .then((blob) => new File([blob], `categoria-portada-desktop-${Date.now()}-${index}.jpg`, { type: 'image/jpeg' }))
        );
        const resolvedFiles = await Promise.all(files);
        const [uploaded] = await uploadMultipleImages(resolvedFiles);
        imagenPortadaDesktopUrl = uploaded.url;
        imagenPortadaDesktopKeyToSave = uploaded.key;
        const keyToDelete = originalImagenPortadaDesktopKey ?? getBlobKeyFromUrl(imagenPortadaDesktopOriginal);
        if (keyToDelete) {
          await deleteBlobByKey(keyToDelete).catch((error) => {
            console.error('[categorias] error borrando blob portada desktop:', error);
          });
        }
        toast.success('Portada desktop actualizada', { id: 'upload-cover-desktop' });
      }

      let imagenPortadaMobileUrl = imagenPortadaMobileOriginal;
      let imagenPortadaMobileKeyToSave = imagenPortadaMobileKey;
      const portadaMobileRemoved = imagenPortadaMobilePreview.length === 0 && Boolean(imagenPortadaMobileOriginal);
      const portadaMobileCambio =
        imagenPortadaMobilePreview.length > 0 && imagenPortadaMobilePreview[0] !== imagenPortadaMobileOriginal;

      if (portadaMobileRemoved) {
        const keyToDelete = originalImagenPortadaMobileKey ?? getBlobKeyFromUrl(imagenPortadaMobileOriginal);
        if (keyToDelete) {
          toast.info('Eliminando portada mobile...', { id: 'delete-cover-mobile' });
          await deleteBlobByKey(keyToDelete).catch((error) => {
            console.error('[categorias] error borrando blob portada mobile:', error);
          });
          toast.dismiss('delete-cover-mobile');
        }
        imagenPortadaMobileUrl = '';
        imagenPortadaMobileKeyToSave = '';
      } else if (portadaMobileCambio) {
        toast.info('Subiendo nueva portada mobile...', { id: 'upload-cover-mobile' });
        const files = imagenPortadaMobilePreview.map((preview, index) =>
          fetch(preview)
            .then((res) => res.blob())
            .then((blob) => new File([blob], `categoria-portada-mobile-${Date.now()}-${index}.jpg`, { type: 'image/jpeg' }))
        );
        const resolvedFiles = await Promise.all(files);
        const [uploaded] = await uploadMultipleImages(resolvedFiles);
        imagenPortadaMobileUrl = uploaded.url;
        imagenPortadaMobileKeyToSave = uploaded.key;
        const keyToDelete = originalImagenPortadaMobileKey ?? getBlobKeyFromUrl(imagenPortadaMobileOriginal);
        if (keyToDelete) {
          await deleteBlobByKey(keyToDelete).catch((error) => {
            console.error('[categorias] error borrando blob portada mobile:', error);
          });
        }
        toast.success('Portada mobile actualizada', { id: 'upload-cover-mobile' });
      }

      const slug = slugify(data.nombre);

      await updateDoc(doc(db, 'categorias', id), {
        nombre: data.nombre,
        slug,
        descripcion: data.descripcion,
        destacada: data.destacada,
        activa: data.activa,
        imagenTarjeta: imagenTarjetaUrl,
        imagenTarjetaKey: imagenTarjetaKeyToSave || undefined,
        imagenPortadaDesktop: imagenPortadaDesktopUrl || undefined,
        imagenPortadaDesktopKey: imagenPortadaDesktopKeyToSave || undefined,
        imagenPortadaMobile: imagenPortadaMobileUrl || undefined,
        imagenPortadaMobileKey: imagenPortadaMobileKeyToSave || undefined,
        imagenPortada: imagenPortadaDesktopUrl || imagenPortadaMobileUrl || undefined,
        imagenPortadaKey: imagenPortadaDesktopKeyToSave || imagenPortadaMobileKeyToSave || undefined,
        imagen: imagenTarjetaUrl,
        imagenKey: imagenTarjetaKeyToSave || undefined,
      });
      await revalidateFrontPaths(['/paquetes', `/categoria/${slug}`]);

      toast.success('Categoría actualizada correctamente');
      router.push('/admin/categorias');
    } catch (error) {
      console.error('Error updating categoria:', error);
      toast.error('Error al actualizar categoría');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-gray-900" />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/categorias">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Editar Categoría</h1>
              <p className="text-gray-600 mt-1">Modifica la información de la categoría</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Información de la Categoría</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    {...register('nombre')}
                    placeholder="Ej: Europa"
                    className="mt-1.5"
                  />
                  {errors.nombre && (
                    <p className="text-base text-red-500 mt-1">{errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción *</Label>
                  <Textarea
                    id="descripcion"
                    {...register('descripcion')}
                    placeholder="Describe esta categoría..."
                    rows={4}
                    className="mt-1.5"
                  />
                  {errors.descripcion && (
                    <p className="text-base text-red-500 mt-1">{errors.descripcion.message}</p>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Gestión de Orden Visual */}
            <DragDropOrderManager
              collectionName="categorias"
              currentId={id}
            />

            {/* Imagen de Portada */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Imagen de Tarjeta</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  images={imagenTarjetaPreview}
                  onImagesChange={setImagenTarjetaPreview}
                  maxImages={1}
                  label="Imagen de tarjeta *"
                  description="Se usa en la grilla de destinos/categorías. Tamaño ideal: 1200x900px (4:3)."
                />
                {imagenTarjetaPreview.length === 0 && (
                  <p className="text-sm text-amber-600 mt-3 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    La imagen de tarjeta es obligatoria
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Portada Desktop */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Portada Desktop</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  images={imagenPortadaDesktopPreview}
                  onImagesChange={setImagenPortadaDesktopPreview}
                  maxImages={1}
                  label="Imagen de portada desktop (opcional)"
                  description="Se usa como imagen grande en escritorio. Medida sugerida: 1920x1080."
                />
              </CardContent>
            </Card>

            {/* Portada Mobile */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Portada Mobile</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  images={imagenPortadaMobilePreview}
                  onImagesChange={setImagenPortadaMobilePreview}
                  maxImages={1}
                  label="Imagen de portada mobile (opcional)"
                  description="Se usa como imagen grande en celular. Medida sugerida: 1080x1350 o similar vertical."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Configuración y Visibilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="destacada" className="text-lg font-medium cursor-pointer">Categoría destacada</Label>
                    <p className="text-sm text-gray-500 pr-4">
                      Aparecerá en la sección destacados de la homepage
                    </p>
                  </div>
                  <Switch
                    id="destacada"
                    checked={destacada}
                    onCheckedChange={(checked) => setValue('destacada', checked)}
                    className="mt-0.5"
                  />
                </div>

                <div className="flex items-start justify-between py-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="activa" className="text-lg font-medium cursor-pointer">Categoría activa</Label>
                    <p className="text-sm text-gray-500 pr-4">
                      Visible para los usuarios en el sitio web
                    </p>
                  </div>
                  <Switch
                    id="activa"
                    checked={activa}
                    onCheckedChange={(checked) => setValue('activa', checked)}
                    className="mt-0.5"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" asChild size="lg">
                <Link href="/admin/categorias">Cancelar</Link>
              </Button>
              <Button
                type="submit"
                size="lg"
                className="bg-black hover:bg-gray-800 text-white min-w-[180px]"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
