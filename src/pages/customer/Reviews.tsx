import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { useListMyReviews, getListMyReviewsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function CustomerReviews() {
  const { data: reviews, isLoading } = useListMyReviews({
    query: { queryKey: getListMyReviewsQueryKey() }
  });

  if (isLoading) return <CustomerLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></CustomerLayout>;

  return (
    <CustomerLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">تقييماتي</h1>
        {(!reviews || reviews.length === 0) ? (
          <div className="text-center py-16 text-muted-foreground">
            <Star size={64} className="mx-auto mb-4 opacity-20" />
            <p>لم تقم بأي تقييم بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
              <Card key={r.id}>
                <CardContent className="p-4">
                  <p className="font-medium mb-2">{(r as any).artisan?.user?.name || "الحرفي"}</p>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} size={18} className={n <= r.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"} />
                    ))}
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                  <p className="text-xs text-muted-foreground mt-2">{new Date(r.createdAt).toLocaleDateString("ar-SA")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
