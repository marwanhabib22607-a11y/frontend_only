import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { useGetCustomerDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";

function statusLabel(status: string) {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    open: { label: "مفتوح", variant: "default" },
    receiving_offers: { label: "يستقبل عروض", variant: "secondary" },
    offer_selected: { label: "تم اختيار عرض", variant: "outline" },
    in_progress: { label: "قيد التنفيذ", variant: "secondary" },
    completed: { label: "مكتمل", variant: "default" },
    cancelled: { label: "ملغي", variant: "destructive" },
  };
  return map[status] || { label: status, variant: "outline" };
}

export function CustomerDashboard() {
  const { data: stats, isLoading } = useGetCustomerDashboard();

  if (isLoading) return <CustomerLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></CustomerLayout>;

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <Link href="/customer/requests/new">
            <Button className="gap-2"><Plus size={16} /> طلب جديد</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "إجمالي الطلبات", value: stats?.totalRequests || 0, icon: FileText, color: "text-blue-500" },
            { label: "طلبات مفتوحة", value: stats?.openRequests || 0, icon: AlertCircle, color: "text-orange-500" },
            { label: "قيد التنفيذ", value: stats?.inProgressRequests || 0, icon: Clock, color: "text-yellow-500" },
            { label: "مكتملة", value: stats?.completedRequests || 0, icon: CheckCircle, color: "text-green-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`${color} shrink-0`} size={28} />
                <div>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>آخر الطلبات</CardTitle>
            <Link href="/customer/requests">
              <Button variant="ghost" size="sm">عرض الكل</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {(!stats?.recentRequests || stats.recentRequests.length === 0) ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText size={48} className="mx-auto mb-3 opacity-30" />
                <p>لا توجد طلبات بعد</p>
                <Link href="/customer/requests/new">
                  <Button className="mt-3" variant="outline">أنشئ طلبك الأول</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentRequests.map((req) => {
                  const { label, variant } = statusLabel(req.status);
                  return (
                    <Link href={`/customer/requests/${req.id}`} key={req.id}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border cursor-pointer">
                        <div>
                          <p className="font-medium">{req.title}</p>
                          <p className="text-sm text-muted-foreground">{req.category} · {req.city}</p>
                        </div>
                        <div className="text-left space-y-1">
                          <Badge variant={variant}>{label}</Badge>
                          <p className="text-xs text-muted-foreground text-left">{req.offersCount} عرض</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
