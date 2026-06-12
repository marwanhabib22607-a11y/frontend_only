import { useState, useEffect } from "react";
import { ArtisanLayout } from "@/components/layouts/ArtisanLayout";
import { useGetMyArtisanProfile, useUpdateArtisanProfile, useListSpecialties, getGetMyArtisanProfileQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Star, CheckCircle, Clock, XCircle, Image, Briefcase, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Egyptian cities
const CITIES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية",
  "البحيرة", "الغربية", "المنوفية", "القليوبية", "الإسماعيلية",
  "بورسعيد", "السويس", "الفيوم", "المنيا", "بني سويف",
  "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "مطروح",
];

function verificationBadge(status: string) {
  if (status === "approved") return <Badge className="gap-1 bg-green-100 text-green-800 border-green-300"><CheckCircle size={14} /> موثق</Badge>;
  if (status === "pending") return <Badge variant="secondary" className="gap-1"><Clock size={14} /> قيد المراجعة</Badge>;
  return <Badge variant="destructive" className="gap-1"><XCircle size={14} /> مرفوض</Badge>;
}

export function ArtisanProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetMyArtisanProfile({ query: { queryKey: getGetMyArtisanProfileQueryKey() } });
  const { data: specialties } = useListSpecialties();
  const [form, setForm] = useState({
    bio: "",
    city: "",
    yearsExperience: 0,
    idNumber: "",
    nationalIdImageUrl: "",
    specialtyIds: [] as number[],
  });

  useEffect(() => {
    if (profile) {
      setForm({
        bio: profile.bio || "",
        city: profile.city || "",
        yearsExperience: (profile as any).yearsExperience || 0,
        idNumber: (profile as any).idNumber || "",
        nationalIdImageUrl: profile.nationalIdImageUrl || "",
        specialtyIds: ((profile as any).specialties || []).map((s: any) => s.specialtyId || s.id),
      });
    }
  }, [profile]);

  const { mutate: updateProfile, isPending } = useUpdateArtisanProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMyArtisanProfileQueryKey() });
        toast({ title: "تم الحفظ", description: "تم تحديث ملفك الشخصي بنجاح" });
      },
      onError: (err: any) => toast({ title: "خطأ", description: err?.data?.error || "حدث خطأ", variant: "destructive" }),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ data: form });
  };

  const toggleSpecialty = (id: number) => {
    setForm(f => ({
      ...f,
      specialtyIds: f.specialtyIds.includes(id)
        ? f.specialtyIds.filter(s => s !== id)
        : [...f.specialtyIds, id],
    }));
  };

  if (isLoading) return <ArtisanLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></ArtisanLayout>;

  return (
    <ArtisanLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">الملف الشخصي</h1>
          {profile && verificationBadge((profile as any).verificationStatus || "pending")}
        </div>

        {/* Verification status alert */}
        {profile && (profile as any).verificationStatus === "pending" && (
          <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
            <Info size={18} className="text-orange-500 shrink-0 mt-0.5" />
            <p className="text-sm text-orange-800">
              ملفك قيد المراجعة من فريق FixIt. يمكنك تحديث بياناتك وستظهر للمراجعين.
              أكمل جميع الحقول أدناه لتسريع الموافقة.
            </p>
          </div>
        )}

        {/* Rating */}
        {(profile as any)?.averageRating && (
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
              <div>
                <span className="text-2xl font-bold">{Number((profile as any).averageRating).toFixed(1)}</span>
                <span className="text-muted-foreground mr-2 text-sm">({(profile as any).reviewsCount} تقييم)</span>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Specialties — most important for matching */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                التخصصات *
              </CardTitle>
              <p className="text-xs text-muted-foreground">اختر جميع التخصصات التي تتقنها — ستظهر لك الطلبات المطابقة فقط</p>
            </CardHeader>
            <CardContent>
              {(!specialties || specialties.length === 0) && (
                <p className="text-sm text-muted-foreground">جاري تحميل التخصصات...</p>
              )}
              <div className="grid grid-cols-2 gap-2.5">
                {(specialties || []).map(s => (
                  <label key={s.id} htmlFor={`spec-${s.id}`} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    form.specialtyIds.includes(s.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}>
                    <Checkbox
                      id={`spec-${s.id}`}
                      checked={form.specialtyIds.includes(s.id)}
                      onCheckedChange={() => toggleSpecialty(s.id)}
                    />
                    <span className="text-sm font-medium">{s.name}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Professional summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">النبذة المهنية</CardTitle>
              <p className="text-xs text-muted-foreground">
                اكتب نبذة تعريفية احترافية تشرح خبرتك ومهاراتك وأسباب ثقة العملاء بك.
                هذه النبذة تظهر للعملاء وللمراجعين في الإدارة.
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                id="bio"
                placeholder="مثال: حرفي متخصص في السباكة وأعمال المياه بخبرة 10 سنوات في القاهرة والجيزة. أتعامل مع جميع أنواع التسريبات والصيانة الدورية. أعمل بشكل احترافي وأضمن النتائج. حاصل على تدريب معتمد في..."
                rows={5}
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">{form.bio.length} / 500 حرف</p>
            </CardContent>
          </Card>

          {/* Basic info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">البيانات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المدينة</Label>
                  <select
                    className="w-full border rounded-md p-2 text-sm bg-background"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  >
                    <option value="">اختر المدينة</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">سنوات الخبرة</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min={0}
                    max={50}
                    placeholder="5"
                    value={form.yearsExperience}
                    onChange={e => setForm(f => ({ ...f, yearsExperience: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification documents */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Image size={18} />
                وثائق التحقق
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                هذه المعلومات مطلوبة لمراجعة حسابك والموافقة عليه
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idNumber">رقم البطاقة الوطنية</Label>
                <Input
                  id="idNumber"
                  placeholder="XXXXXXXXXXXXXXXXX"
                  value={form.idNumber}
                  onChange={e => setForm(f => ({ ...f, idNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalIdImageUrl">رابط صورة البطاقة الوطنية</Label>
                <Input
                  id="nationalIdImageUrl"
                  type="url"
                  placeholder="https://..."
                  dir="ltr"
                  value={form.nationalIdImageUrl}
                  onChange={e => setForm(f => ({ ...f, nationalIdImageUrl: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  ارفع صورة البطاقة على أي خدمة (Drive / Dropbox) وألصق الرابط هنا
                </p>
                {form.nationalIdImageUrl && (
                  <a href={form.nationalIdImageUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                    معاينة الصورة ↗
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-11 text-base" disabled={isPending}>
            {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </form>
      </div>
    </ArtisanLayout>
  );
}
