import { ArtisanLayout } from "@/components/layouts/ArtisanLayout";
import { useGetArtisanDashboardStats, useListMyJobs, getListMyJobsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Briefcase, Star, Clock, Search, AlertTriangle, TrendingUp, FileText, DollarSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Job = {
  id: number;
  title: string;
  category?: string;
  city?: string;
  status: string;
  acceptedOffer?: { price?: number } | null;
};

const JOB_STATUS_LABELS: Record<string, string> = {
  offer_selected: "تم الاختيار",
  in_progress:    "قيد التنفيذ",
  completed:      "مكتمل",
};

export function ArtisanDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetArtisanDashboardStats();
  const { data: jobs, isLoading: jobsLoading } = useListMyJobs({
    query: { queryKey: getListMyJobsQueryKey() }
  });

  const isLoading = statsLoading || jobsLoading;

  if (isLoading) {
    return (
      <ArtisanLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">جاري التحميل...</div>
      </ArtisanLayout>
    );
  }

  const typedJobs = (jobs ?? []) as unknown as Job[];
  const activeJobs = typedJobs.filter(j => j.status === "offer_selected" || j.status === "in_progress");
  const isApproved = (user as any)?.artisanProfile?.verificationStatus === "approved";

  return (
    <ArtisanLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground text-sm mt-1">مرحباً، {user?.name}</p>
          </div>
          {isApproved && (
            <Link href="/artisan/requests">
              <Button className="gap-2"><Search size={16} /> تصفح الطلبات</Button>
            </Link>
          )}
        </div>

        {/* Pending verification warning */}
        {!isApproved && (
          <Card className="border-orange-300 bg-orange-50">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="text-orange-500 mt-0.5 shrink-0" size={20} />
              <div>
                <p className="font-medium text-orange-900">حسابك تحت المراجعة</p>
                <p className="text-sm text-orange-700 mt-1">
                  يتم مراجعة طلب التحقق من هويتك من قبل فريق FixIt. ستتمكن من الوصول الكامل بعد الموافقة.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats grid — uses correct field names from API */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "إجمالي المهام",
              value: stats?.acceptedJobs ?? 0,
              icon: Briefcase,
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              label: "مهام مكتملة",
              value: stats?.completedJobs ?? 0,
              icon: Clock,
              color: "text-green-500",
              bg: "bg-green-50",
            },
            {
              label: "عدد التقييمات",
              value: stats?.reviewsCount ?? 0,
              icon: Star,
              color: "text-yellow-500",
              bg: "bg-yellow-50",
            },
            {
              label: "متوسط التقييم",
              value: stats?.averageRating ? Number(stats.averageRating).toFixed(1) : "—",
              icon: TrendingUp,
              color: "text-purple-500",
              bg: "bg-purple-50",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={color} size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">{value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary stats row */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="text-primary" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.totalOffers ?? 0}</div>
                <div className="text-xs text-muted-foreground mt-1">إجمالي العروض المقدمة</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <DollarSign className="text-amber-600" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.pendingOffers ?? 0}</div>
                <div className="text-xs text-muted-foreground mt-1">عروض معلقة</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active jobs — fetched from /jobs/my with full details */}
        {activeJobs.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">المهام النشطة</CardTitle>
                <Link href="/artisan/jobs">
                  <span className="text-xs text-primary hover:underline">عرض الكل</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeJobs.slice(0, 4).map(job => (
                <Link href="/artisan/jobs" key={job.id}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted border cursor-pointer transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{job.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {job.city && <p className="text-xs text-muted-foreground">{job.city}</p>}
                        {job.category && <p className="text-xs text-muted-foreground">· {job.category}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {job.acceptedOffer?.price && (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          {job.acceptedOffer.price} ج.م
                        </span>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {JOB_STATUS_LABELS[job.status] ?? job.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </ArtisanLayout>
  );
}
