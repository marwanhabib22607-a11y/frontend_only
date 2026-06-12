import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAdminListSubscriptions, getAdminListSubscriptionsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

export function AdminSubscriptions() {
  const { data: subscriptions, isLoading } = useAdminListSubscriptions({
    query: { queryKey: getAdminListSubscriptionsQueryKey() }
  });

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">إدارة الاشتراكات</h1>

        {(!subscriptions || subscriptions.length === 0) ? (
          <div className="text-center py-16 text-muted-foreground">
            <CreditCard size={64} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد اشتراكات</p>
          </div>
        ) : (
          <div className="space-y-2">
            {subscriptions.map(sub => (
              <Card key={sub.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{sub.artisan?.user?.name || "حرفي"}</p>
                    <p className="text-sm text-muted-foreground">{sub.artisan?.user?.email}</p>
                    <p className="text-sm text-muted-foreground">الباقة: {sub.plan?.name}</p>
                  </div>
                  <div className="text-left">
                    <Badge variant={sub.status === "active" ? "default" : sub.status === "expired" ? "secondary" : "destructive"}>
                      {sub.status === "active" ? "نشط" : sub.status === "expired" ? "منتهي" : "ملغي"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      حتى: {new Date(sub.endDate).toLocaleDateString("ar-SA")}
                    </p>
                    <p className="text-xs text-muted-foreground">{sub.plan?.price} ج.م</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
