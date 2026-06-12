import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAdminListPlans, useAdminCreatePlan, getAdminListPlansQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";

export function AdminPlans() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: plans, isLoading } = useAdminListPlans({ query: { queryKey: getAdminListPlansQueryKey() } });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", description: "", features: "" });

  const { mutate: createPlan, isPending } = useAdminCreatePlan({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListPlansQueryKey() });
        setDialogOpen(false);
        setForm({ name: "", price: "", description: "", features: "" });
        toast({ title: "تم!", description: "تم إنشاء الباقة بنجاح" });
      },
      onError: (err: any) => toast({ title: "خطأ", description: err?.data?.error || "حدث خطأ", variant: "destructive" }),
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArr = form.features ? form.features.split("\n").filter(Boolean) : [];
    createPlan({
      data: {
        name: form.name,
        price: parseFloat(form.price),
        description: form.description || undefined,
        features: featuresArr.length > 0 ? featuresArr : undefined,
        isActive: true,
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة الباقات</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus size={16} /> باقة جديدة</Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>إنشاء باقة جديدة</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>اسم الباقة *</Label>
                  <Input placeholder="باقة الأساسية" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>السعر (ج.م/شهر) *</Label>
                  <Input type="number" min="0" placeholder="99" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>وصف الباقة</Label>
                  <Textarea placeholder="مثالية للحرفيين المبتدئين..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>المميزات (سطر لكل ميزة)</Label>
                  <Textarea placeholder="إمكانية إرسال عروض غير محدودة&#10;ظهور متميز في نتائج البحث" value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "جاري الإنشاء..." : "إنشاء الباقة"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && <div className="flex items-center justify-center h-64">جاري التحميل...</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(plans || []).map(plan => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  <Badge variant={plan.isActive ? "default" : "secondary"}>{plan.isActive ? "نشط" : "موقوف"}</Badge>
                </CardTitle>
                <p className="text-2xl font-bold text-primary">{plan.price} ج.م<span className="text-sm font-normal text-muted-foreground">/شهر</span></p>
              </CardHeader>
              <CardContent>
                {plan.description && <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>}
                {plan.features && plan.features.length > 0 && (
                  <ul className="text-sm space-y-1">
                    {plan.features.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
