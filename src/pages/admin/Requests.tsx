import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAdminListRequests, getAdminListRequestsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ListTodo } from "lucide-react";

function statusInfo(s: string) {
  const m: Record<string, string> = { open: "مفتوح", receiving_offers: "يستقبل عروض", offer_selected: "تم اختيار عرض", in_progress: "قيد التنفيذ", completed: "مكتمل", cancelled: "ملغي" };
  return m[s] || s;
}

export function AdminRequests() {
  const [search, setSearch] = useState("");
  const { data: requests, isLoading } = useAdminListRequests({
    query: { queryKey: getAdminListRequestsQueryKey() }
  });

  const filtered = requests?.filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
        <Input placeholder="بحث بالعنوان أو التصنيف..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-md" />

        {isLoading && <div className="flex items-center justify-center h-64">جاري التحميل...</div>}

        {!isLoading && (!filtered || filtered.length === 0) && (
          <div className="text-center py-16 text-muted-foreground">
            <ListTodo size={64} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد طلبات</p>
          </div>
        )}

        <div className="space-y-2">
          {filtered?.map(req => (
            <Card key={req.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{req.title}</p>
                    <Badge variant="outline">{statusInfo(req.status)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.customer?.name} · {req.category} · {req.city}</p>
                  <p className="text-sm text-muted-foreground">{new Date(req.createdAt).toLocaleDateString("ar-SA")}</p>
                </div>
                <div className="text-left text-sm text-muted-foreground">
                  <Badge variant="secondary">{req.offersCount} عرض</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
