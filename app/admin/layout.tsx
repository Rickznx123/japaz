import { AdminShell } from '@/components/AdminShell'
import { getPublicSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings()
  return <AdminShell logoUrl={settings.branding.adminLogoUrl || settings.branding.logoDarkUrl || settings.branding.logoUrl}>{children}</AdminShell>
}
