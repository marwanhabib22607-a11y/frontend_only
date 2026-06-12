import { ArtisanLayout } from "@/components/layouts/ArtisanLayout";
import { useListMyJobs, useUpdateJobStatus, getListMyJobsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase, MapPin, Tag, Clock, DollarSign, Calendar,
  CheckCircle, PlayCircle, AlertCircle
} from "lucide-react";

type Job = {
  id: number;
  title: string;
  category?: string;
  city?: string;
  locationText?: string;
  description?: string;
  status: string;
  preferredDate?: string;
  createdAt: string;
  customer?: { name?: string } | null;
  acceptedOffer?: {
    price?: number;
    arrivalTime?: string;
    duration?: string;
    message?: string;
  } | null;
};

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  offer_selected: { label: "تم الاختيار", color: "bg-blue-100 text-blue-800 border-blue-200", icon: AlertCircle },
  in_progress:    { label: "قيد التنفيذ",  color: "bg-amber-100 text-amber-800 border-amber-200", icon: PlayCircle },
  completed:      { label: "مكتمل",         color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
};

function StatusBadge({ status }: { status: string }) {
  const info = STATUS_MAP[status] ?? { label: status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: AlertCircle };
  const Icon = info.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${info.color}`}>
      <Icon size={12} /> {info.label}
    </span>
  );
}

export function ArtisanJobs() {
  const { data: jobs, isLoading } = useListMyJobs({
    query: { queryKey: getListMyJobsQueryKey() }
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate: updateStatus, isPending } = useUpdateJobStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMyJobsQueryKey() });
        toast({ title: "تم تحديث حالة المهمة" });
      },
      onError: (err: any) => toast({ title: "خطأ", description: err?.data?.error, variant: "destructive" }),
    },
  });

  if (isLoading) {
    return (
      <ArtisanLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">جاري التحميل...</div>
      </ArtisanLayout>
    );
  }

  const typedJobs = (jobs ?? []) as unknown as Job[];

  return (
    <ArtisanLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Briefcase size={24} className="text-amber-600" />
          <h1 className="text-2xl font-bold">مهامي</h1>
          {typedJobs.length > 0 && (
            <span className="text-sm bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
              {typedJobs.length} مهمة
            </span>
          )}
        </div>

        {typedJobs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Briefcase size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-1">لا توجد مهام بعد</p>
            <p className="text-sm">ابدأ بتصفح الطلبات وإرسال عروضك</p>
          </div>
        ) : (
          <div className="space-y-4">
            {typedJobs.map(job => {
              const offer = job.acceptedOffer;
              const canMarkInProgress = job.status === "offer_selected";
              const canMarkCompleted  = job.status === "in_progress";

              return (
                <Card key={job.id} className="border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-snug">{job.title}</CardTitle>
                        {job.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{job.description}</p>
                        )}
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Request details grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {job.category && (
                        <div className="flex items-center gap-2 text-sm">
                          <Tag size={14} className="text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">نوع الخدمة</p>
                            <p className="font-medium">{job.category}</p>
                          </div>
                        </div>
                      )}
                      {job.city && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">المدينة</p>
                            <p className="font-medium">{job.city}</p>
                          </div>
                        </div>
                      )}
                      {job.preferredDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">الموعد المفضل</p>
                            <p className="font-medium">{new Date(job.preferredDate).toLocaleDateString("ar-EG")}</p>
                          </div>
                        </div>
                      )}
                      {job.locationText && (
                        <div className="flex items-center gap-2 text-sm col-span-2 md:col-span-1">
                          <MapPin size={14} className="text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">العنوان</p>
                            <p className="font-medium">{job.locationText}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Accepted offer details */}
                    {offer && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-xs font-semibold text-amber-700 mb-3 uppercase tracking-wide">تفاصيل العرض المقبول</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {offer.price !== undefined && offer.price !== null && (
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign size={14} className="text-amber-600 shrink-0" />
                              <div>
                                <p className="text-xs text-amber-700">السعر</p>
                                <p className="font-bold text-amber-900">{offer.price} ج.م</p>
                              </div>
                            </div>
                          )}
                          {offer.arrivalTime && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock size={14} className="text-amber-600 shrink-0" />
                              <div>
                                <p className="text-xs text-amber-700">وقت الوصول</p>
                                <p className="font-medium text-amber-900">{offer.arrivalTime}</p>
                              </div>
                            </div>
                          )}
                          {offer.duration && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock size={14} className="text-amber-600 shrink-0" />
                              <div>
                                <p className="text-xs text-amber-700">المدة المتوقعة</p>
                                <p className="font-medium text-amber-900">{offer.duration}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {offer.message && (
                          <div className="mt-3 pt-3 border-t border-amber-200">
                            <p className="text-xs text-amber-700 mb-1">رسالة العرض</p>
                            <p className="text-sm text-amber-900">{offer.message}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Customer info + action buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-muted-foreground">
                        {job.customer?.name && (
                          <span>العميل: <span className="font-medium text-foreground">{job.customer.name}</span></span>
                        )}
                        {" · "}
                        <span>{new Date(job.createdAt).toLocaleDateString("ar-EG")}</span>
                      </div>

                      <div className="flex gap-2">
                        {canMarkInProgress && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 border-amber-400 text-amber-700 hover:bg-amber-50"
                            disabled={isPending}
                            onClick={() => updateStatus({ requestId: job.id, data: { status: "in_progress" } })}
                          >
                            <PlayCircle size={14} /> بدء التنفيذ
                          </Button>
                        )}
                        {canMarkCompleted && (
                          <Button
                            size="sm"
                            className="gap-1 bg-green-600 hover:bg-green-700"
                            disabled={isPending}
                            onClick={() => updateStatus({ requestId: job.id, data: { status: "completed" } })}
                          >
                            <CheckCircle size={14} /> إنهاء المهمة
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ArtisanLayout>
  );
}
