import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAdminListArtisans, getAdminListArtisansQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Briefcase, Star } from "lucide-react";

function verificationBadge(status: string) {
  if (status === "approved") return <Badge className="bg-green-100 text-green-800">موثق</Badge>;
  if (status === "pending") return <Badge variant="secondary">قيد المراجعة</Badge>;
  return <Badge variant="destructive">مرفوض</Badge>;
}

export function AdminArtisans() {
  const [search, setSearch] = useState("");
  const { data: artisans, isLoading } = useAdminListArtisans({
    query: { queryKey: getAdminListArtisansQueryKey() }
  });

  const filtered = artisans?.filter(a =>
    !search || a.user?.name?.toLowerCase().includes(search.toLowerCase()) || a.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">إدارة الحرفيين</h1>
        <Input placeholder="بحث بالاسم أو البريد..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-md" />

        {isLoading && <div className="flex items-center justify-center h-64">جاري التحميل...</div>}

        {!isLoading && (!filtered || filtered.length === 0) && (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase size={64} className="mx-auto mb-4 opacity-20" />
            <p>لا يوجد حرفيون</p>
          </div>
        )}

        <div className="space-y-2">
          {filtered?.map(artisan => (
            <Card key={artisan.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{artisan.user?.name}</p>
                    {verificationBadge(artisan.verificationStatus || "pending")}
                  </div>
                  <p className="text-sm text-muted-foreground">{artisan.user?.email}</p>
                  <p className="text-sm text-muted-foreground">{artisan.city} · {artisan.yearsExperience} سنوات خبرة</p>
                  {artisan.specialties && artisan.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {artisan.specialties.map((s: any) => (
                        <Badge key={s.id} variant="outline" className="text-xs">{s.specialty?.name || s.name}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  {artisan.averageRating && (
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{artisan.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{artisan.reviewsCount} تقييم</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
