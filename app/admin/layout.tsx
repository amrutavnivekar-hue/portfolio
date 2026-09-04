import AdminShell from '@/components/admin/AdminShell';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminShell>{children}</AdminShell>
    </ThemeProvider>
  );
}
