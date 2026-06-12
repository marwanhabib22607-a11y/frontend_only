import { useState } from "react";
import { ArtisanLayout } from "@/components/layouts/ArtisanLayout";
import { useListRequests, useSubmitOffer, useGetMyArtisanProfile, getListRequestsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, Tag, Calendar, Loader2, Info, AlertCircle } from "lucide-react";

export function ArtisanBrowseRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: requests, isLoading } = useListRequests({});
  const { data: profile } = useGetMyArtisanProfile();

  const [offerForm, setOfferForm] = useState({ price: "", message: "", arrivalTimeText: "", estimatedDurationText: "" });
  const [selectedReqId, setSelectedReqId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate: createOffer, isPending: submittingOffer } = useSubmitOffer({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRequestsQueryKey({}) });
        setDialogOpen(false);
        setOfferForm({ price: "", message: "", arrivalTimeText: "", estimatedDurationText: "" });
        toast({ title: "تم!", description: "تم إرسال عرضك بنجاح وسيتم مراجعته من العميل" });
      },
      onError: (err: any) => toast({ title: "خطأ", description: err?.data?.error || "حدث خطأ في إرسال العرض", variant: "destructive" }),
    },
  });

  const handleOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqId) return;
    createOffer({
      requestId: selectedReqId,
      data: {
        price: parseFloat(offerForm.price),
        message: offerForm.message,
        arrivalTimeText: offerForm.arrivalTimeText,
        estimatedDurationText: offerForm.estimatedDurationText,
      },
    });
  };

  const availableRequests = requests?.filter(r => r.status === "open" || r.status === "receiving_offers");
  const hasNoSpecialties = profile && (!((profile as any).specialties) || (profile as any).specialties.length === 0);

  return (
    <ArtisanLayout>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">تصفح الطلبات المتاحة</h1>
            <p className="text-muted-foreground text-sm mt-1">الطلبات المعروضة تطابق تخصصاتك المختارة</p>
          </div>
          {availableRequests && availableRequests.length > 0 && (
            <span className="text-sm bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
              {availableRequests.length} طلب
            </span>
          )}
        </div>

        {/* No specialty warning */}
        {hasNoSpecialties && (
          <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
            <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-medium text-orange-900 text-sm">لم تحدد تخصصاتك بعد</p>
              <p className="text-xs text-orange-700 mt-0.5">
                يتم عرض جميع الطلبات حالياً. قم بتحديث ملفك الشخصي باختيار تخصصاتك لرؤية الطلبات المناسبة لك فقط.
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center h-64 gap-2">
            <Loader2 className="animate-spin" /> جاري التحميل...
          </div>
        )}

        {!isLoading && (!availableRequests || availableRequests.length === 0) && (
          <div className="text-center py-16 text-muted-foreground">
            <Info size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">لا توجد طلبات متاحة حالياً</p>
            <p className="text-sm mt-1">
              {hasNoSpecialties
                ? "أضف تخصصاتك في ملفك الشخصي لتظهر الطلبات المناسبة"
                : "تحقق مجدداً لاحقاً أو تأكد من تخصصاتك في الملف الشخصي"
              }
            </p>
          </div>
        )}

        <div className="space-y-3">
          {availableRequests?.map(req => (
            <Card key={req.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{req.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{req.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Tag size={13} />{req.category}</span>
                      <span className="flex items-center gap-1"><MapPin size={13} />{req.city}</span>
                      <span className="flex items-center gap-1"><Calendar size={13} />{req.preferredDate}</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">{req.offersCount} عرض حالياً</Badge>
                    </div>
                  </div>
                  <Dialog open={dialogOpen && selectedReqId === req.id} onOpenChange={open => { setDialogOpen(open); if (open) setSelectedReqId(req.id); }}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setSelectedReqId(req.id)}>قدّم عرضاً</Button>
                    </DialogTrigger>
                    <DialogContent dir="rtl" className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>إرسال عرض سعر</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-muted-foreground">{req.title}</p>
                      <form onSubmit={handleOffer} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">السعر (ج.م) *</Label>
                          <Input id="price" type="number" min="0" step="0.01" placeholder="500" value={offerForm.price} onChange={e => setOfferForm(f => ({ ...f, price: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="arrivalTime">وقت الوصول المتوقع *</Label>
                          <Input id="arrivalTime" placeholder="مثال: خلال ساعتين / غداً صباحاً" value={offerForm.arrivalTimeText} onChange={e => setOfferForm(f => ({ ...f, arrivalTimeText: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">المدة المتوقعة *</Label>
                          <Input id="duration" placeholder="مثال: ساعة إلى ساعتين" value={offerForm.estimatedDurationText} onChange={e => setOfferForm(f => ({ ...f, estimatedDurationText: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">رسالة للعميل</Label>
                          <Textarea id="message" placeholder="أخبر العميل عن خبرتك وكيف ستحل مشكلته..." value={offerForm.message} onChange={e => setOfferForm(f => ({ ...f, message: e.target.value }))} rows={3} />
                        </div>
                        <Button type="submit" className="w-full" disabled={submittingOffer}>
                          {submittingOffer ? "جاري الإرسال..." : "إرسال العرض"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ArtisanLayout>
  );
}
