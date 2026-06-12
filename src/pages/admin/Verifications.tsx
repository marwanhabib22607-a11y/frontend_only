import { AdminLayout } from "@/components/layouts/AdminLayout";
import {
  useAdminListArtisans, useAdminVerifyArtisan,
  getAdminListArtisansQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  UserCheck, CheckCircle, XCircle, MapPin, Briefcase,
  FileText, ExternalLink, Star, Calendar
} from "lucide-react";

export function AdminVerifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: allArtisans, isLoading } = useAdminListArtisans({
    query: { queryKey: getAdminListArtisansQueryKey() }
  });
  const artisans = allArtisans?.filter(a => a.verificationStatus === "pending");

  const { mutate: verifyArtisan, isPending } = useAdminVerifyArtisan({
    mutation: {
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({ queryKey: getAdminListArtisansQueryKey() });
        const action = vars.data.status === "approved" ? "قبول" : "رفض";
        toast({ title: `تم ${action} الحرفي بنجاح`, description: "تم تحديث حالة التحقق" });
      },
      onError: (err: any) => toast({ title: "خطأ", description: err?.data?.error || "حدث خطأ", variant: "destructive" }),
    },
  });

  if (isLoading) return <AdminLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <UserCheck size={24} />
          <h1 className="text-2xl font-bold">طلبات التحقق</h1>
          {(artisans?.length ?? 0) > 0 && (
            <Badge className="bg-orange-500 text-white">{artisans!.length} معلق</Badge>
          )}
        </div>

        {(!artisans || artisans.length === 0) ? (
          <div className="text-center py-16 text-muted-foreground">
            <UserCheck size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">لا توجد طلبات تحقق معلقة</p>
            <p className="text-sm mt-1">جميع الطلبات تمت معالجتها</p>
          </div>
        ) : (
          <div className="space-y-4">
            {artisans.map(artisan => (
              <Card key={artisan.id} className="border-l-4 border-l-orange-400">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-4">
                      {/* Header: name + email */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold">{artisan.user?.name}</h3>
                          <Badge variant="outline" className="text-xs">حرفي</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{artisan.user?.email}</p>
                        {artisan.createdAt && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar size={11} />
                            انضم: {new Date(artisan.createdAt).toLocaleDateString("ar-EG")}
                          </p>
                        )}
                      </div>

                      {/* Location + experience */}
                      <div className="flex flex-wrap gap-3 text-sm">
                        {artisan.city && (
                          <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                            <MapPin size={13} className="text-muted-foreground" />
                            {artisan.city}
                          </span>
                        )}
                        {(artisan as any).yearsExperience > 0 && (
                          <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                            <Star size={13} className="text-muted-foreground" />
                            {(artisan as any).yearsExperience} سنوات خبرة
                          </span>
                        )}
                        {(artisan as any).idNumber && (
                          <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full text-xs">
                            <FileText size={13} className="text-muted-foreground" />
                            هوية: {(artisan as any).idNumber}
                          </span>
                        )}
                      </div>

                      {/* Specialties */}
                      {artisan.specialties && artisan.specialties.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                            <Briefcase size={12} /> التخصصات
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {artisan.specialties.map((s: any) => (
                              <Badge key={s.id} variant="secondary" className="text-xs">
                                {s.specialty?.name || s.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bio / professional summary */}
                      {artisan.bio && (
                        <div className="bg-muted/50 rounded-xl p-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">النبذة المهنية</p>
                          <p className="text-sm leading-relaxed">{artisan.bio}</p>
                        </div>
                      )}
                      {!artisan.bio && (
                        <p className="text-xs text-muted-foreground italic">لم يكتب نبذة تعريفية</p>
                      )}

                      {/* National ID image */}
                      {artisan.nationalIdImageUrl && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                            <FileText size={12} /> صورة البطاقة الوطنية
                          </p>
                          <a
                            href={artisan.nationalIdImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline bg-primary/5 border border-primary/20 rounded-lg px-3 py-2"
                          >
                            <ExternalLink size={12} />
                            فتح صورة البطاقة
                          </a>
                        </div>
                      )}
                      {!artisan.nationalIdImageUrl && (
                        <p className="text-xs text-orange-600">⚠ لم يرفع صورة البطاقة الوطنية</p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="gap-2 bg-green-600 hover:bg-green-700 min-w-20"
                        disabled={isPending}
                        onClick={() => verifyArtisan({ artisanId: artisan.id, data: { status: "approved" } })}
                      >
                        <CheckCircle size={15} /> قبول
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-2"
                        disabled={isPending}
                        onClick={() => verifyArtisan({ artisanId: artisan.id, data: { status: "rejected" } })}
                      >
                        <XCircle size={15} /> رفض
                      </Button>
                    </div>
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
