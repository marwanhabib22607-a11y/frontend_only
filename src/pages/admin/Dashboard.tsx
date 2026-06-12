import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, ListTodo, DollarSign, TrendingUp, Clock, UserCheck } from "lucide-react";

export function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64 text-muted-foreground">جاري التحميل...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">لوحة تحكم الإدارة</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            { label: "المستخدمين", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", href: "/admin/users" },
            { label: "الحرفيين", value: stats?.totalArtisans || 0, icon: Briefcase, color: "text-purple-500", href: "/admin/artisans" },
            { label: "العملاء", value: stats?.totalCustomers || 0, icon: Users, color: "text-green-500", href: "/admin/users" },
            { label: "الطلبات", value: stats?.totalRequests || 0, icon: ListTodo, color: "text-orange-500", href: "/admin/requests" },
            { label: "الطلبات المفتوحة", value: stats?.openRequests || 0, icon: Clock, color: "text-yellow-500", href: "/admin/requests" },
            { label: "الطلبات المكتملة", value: stats?.completedRequests || 0, icon: TrendingUp, color: "text-emerald-500", href: "/admin/requests" },
            { label: "إجمالي العروض", value: stats?.totalOffers || 0, icon: DollarSign, color: "text-indigo-500", href: "/admin/offers" },
            { label: "الاشتراكات النشطة", value: stats?.activeSubscriptions || 0, icon: DollarSign, color: "text-teal-500", href: "/admin/subscriptions" },
          ].map(({ label, value, icon: Icon, color, href }) => (
            <Link href={href} key={label}>
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="p-4 flex flex-col gap-2">
                  <Icon className={`${color}`} size={24} />
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {(stats?.pendingVerifications || 0) > 0 && (
          <Card className="border-orange-300 bg-orange-50/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="text-orange-600" size={24} />
                <div>
                  <p className="font-semibold">{stats?.pendingVerifications} طلب تحقق بانتظار المراجعة</p>
                  <p className="text-sm text-muted-foreground">راجع طلبات الحرفيين الجدد</p>
                </div>
              </div>
              <Link href="/admin/verifications">
                <Button variant="outline">راجع الطلبات</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/verifications">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4">
                <p className="font-semibold mb-1">طلبات التحقق</p>
                <p className="text-3xl font-bold text-orange-500">{stats?.pendingVerifications || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">بانتظار المراجعة</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/plans">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4">
                <p className="font-semibold mb-1">إدارة الباقات</p>
                <p className="text-sm text-muted-foreground mt-1">إنشاء وتعديل باقات الاشتراك</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/subscriptions">
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4">
                <p className="font-semibold mb-1">الاشتراكات</p>
                <p className="text-3xl font-bold text-teal-500">{stats?.activeSubscriptions || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">اشتراك نشط</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
