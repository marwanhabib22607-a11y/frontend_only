import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAdminListOffers, getAdminListOffersQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function offerStatus(s: string) {
  const m: Record<string, string> = { pending: "معلق", accepted: "مقبول", rejected: "مرفوض" };
  return m[s] || s;
}

export function AdminOffers() {
  const [search, setSearch] = useState("");
  const { data: offers, isLoading } = useAdminListOffers({ query: { queryKey: getAdminListOffersQueryKey() } });

  const filtered = offers?.filter(o =>
    !search || o.artisan?.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">إدارة العروض</h1>
        <Input placeholder="بحث باسم الحرفي..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-md" />

        {(!filtered || filtered.length === 0) ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText size={64} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد عروض</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(offer => (
              <Card key={offer.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{offer.request?.title}</p>
                    <p className="text-sm text-muted-foreground">الحرفي: {offer.artisan?.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {offer.arrivalTimeText} · {offer.estimatedDurationText}
                    </p>
                    {offer.message && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{offer.message}</p>}
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-primary mb-1">{offer.price} ج.م</p>
                    <Badge variant={offer.status === "accepted" ? "default" : offer.status === "rejected" ? "destructive" : "outline"}>
                      {offerStatus(offer.status)}
                    </Badge>
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
