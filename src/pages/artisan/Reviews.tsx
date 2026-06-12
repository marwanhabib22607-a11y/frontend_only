import { ArtisanLayout } from "@/components/layouts/ArtisanLayout";
import { useListMyReviews, getListMyReviewsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function ArtisanReviews() {
  const { data: reviews, isLoading } = useListMyReviews({
    query: { queryKey: getListMyReviewsQueryKey() }
  });

  if (isLoading) return <ArtisanLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></ArtisanLayout>;

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <ArtisanLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">التقييمات</h1>
          {avgRating && (
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
              <span className="text-2xl font-bold">{avgRating}</span>
              <span className="text-muted-foreground">({reviews?.length} تقييم)</span>
            </div>
          )}
        </div>
        {(!reviews || reviews.length === 0) ? (
          <div className="text-center py-16 text-muted-foreground">
            <Star size={64} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد تقييمات بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
              <Card key={r.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{(r as any).customer?.name || "عميل"}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} size={16} className={n <= r.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                  <p className="text-xs text-muted-foreground mt-2">{new Date(r.createdAt).toLocaleDateString("ar-SA")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ArtisanLayout>
  );
}
