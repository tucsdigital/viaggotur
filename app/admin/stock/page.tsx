import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import StockDashboard from '@/components/admin/StockDashboard';
import { getExperiencias } from '@/lib/experiencias';

export default async function StockPage() {
  const experiencias = await getExperiencias({ visibleOnly: false });
  return (
    <ProtectedRoute>
      <AdminLayout>
        <StockDashboard experiencias={experiencias} />
      </AdminLayout>
    </ProtectedRoute>
  );
}
