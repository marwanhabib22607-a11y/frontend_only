import { useState } from "react";
import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { useCreateRequest, useListSpecialties } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListRequestsQueryKey, getGetCustomerDashboardQueryKey } from "@workspace/api-client-react";

const CITIES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر",
  "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية",
  "المنيا", "القليوبية", "الوادي الجديد", "السويس", "اسوان",
  "اسيوط", "بني سويف", "بورسعيد", "دمياط", "الشرقية",
  "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا",
  "شمال سيناء", "سوهاج",
];

export function NewRequest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: specialties } = useListSpecialties();
  const [form, setForm] = useState({
    title: "", category: "", description: "", city: "", locationText: "", preferredDate: "", images: [] as string[],
  });

  const { mutate: createRequest, isPending } = useCreateRequest({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListRequestsQueryKey({ mine: true }) });
        queryClient.invalidateQueries({ queryKey: getGetCustomerDashboardQueryKey() });
        toast({ title: "تم إنشاء الطلب", description: "سيتلقى الحرفيون إشعاراً بطلبك" });
        setLocation(`/customer/requests/${data.id}`);
      },
      onError: (err: any) => {
        toast({ title: "خطأ", description: err?.data?.error || "حدث خطأ، يرجى المحاولة مجدداً", variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.description || !form.city || !form.locationText || !form.preferredDate) {
      toast({ title: "تنبيه", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    createRequest({ data: form });
  };

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">طلب خدمة جديد</h1>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الطلب *</Label>
                <Input id="title" placeholder="مثال: إصلاح تسرب مياه في الحمام" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>التصنيف *</Label>
                <Select value={form.category} onValueChange={val => setForm(f => ({ ...f, category: val }))}>
                  <SelectTrigger><SelectValue placeholder="اختر التصنيف" /></SelectTrigger>
                  <SelectContent>
                    {(specialties || []).map(s => (
                      <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">وصف المشكلة *</Label>
                <Textarea id="description" placeholder="اشرح المشكلة بالتفصيل..." rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المدينة *</Label>
                  <Select value={form.city} onValueChange={val => setForm(f => ({ ...f, city: val }))}>
                    <SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">التاريخ المفضل *</Label>
                  <Input id="preferredDate" type="date" value={form.preferredDate} onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationText">الموقع التفصيلي *</Label>
                <Input id="locationText" placeholder="مثال: حي النرجس، شارع الورود، عمارة 5" value={form.locationText} onChange={e => setForm(f => ({ ...f, locationText: e.target.value }))} required />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "جاري الإرسال..." : "إرسال الطلب"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
