import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Wrench, CheckCircle } from "lucide-react";

const CUSTOMER_PERKS = ["اطلب خدمة في دقائق", "تلقَّ عروض أسعار شفافة", "حرفيون موثوقون ومُقيَّمون", "دعم على مدار الساعة"];
const ARTISAN_PERKS = ["تصفح الطلبات في منطقتك", "قدّم عروضك مباشرة", "اشترك بباقات مرنة", "ازدد تقييماتك وسمعتك"];

export function Register() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const defaultRole = params.get("role") === "artisan" ? "artisan" : "customer";

  const { login } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: defaultRole, city: "" });

  const { mutate: registerUser, isPending } = useRegister({
    mutation: {
      onSuccess: (data) => {
        login(data.token);
        toast({ title: "مرحباً بك في FixIt!", description: "تم إنشاء حسابك بنجاح" });
        setLocation(`/${data.user.role}/dashboard`);
      },
      onError: (err: any) => {
        toast({ title: "خطأ في التسجيل", description: err?.data?.error || "حدث خطأ، يرجى المحاولة مجدداً", variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser({ data: form });
  };

  const perks = form.role === "artisan" ? ARTISAN_PERKS : CUSTOMER_PERKS;

  return (
    <div className="min-h-screen flex bg-background" dir="rtl">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center space-y-6">
          <Link href="/">
            <div className="flex items-center gap-3 justify-center mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">F</span>
              </div>
              <span className="text-4xl font-black">FixIt</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold">
            {form.role === "artisan" ? "انضم كحرفي محترف" : "احصل على خدمة موثوقة"}
          </h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            {form.role === "artisan"
              ? "وسّع قاعدة عملائك وابنِ سمعتك المهنية مع FixIt"
              : "تواصل مع أفضل الحرفيين في منطقتك بسرعة وسهولة"
            }
          </p>
          <div className="space-y-3 text-right mt-8">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-2 text-primary-foreground/90">
                <CheckCircle size={16} className="shrink-0 text-green-300" />
                <span className="text-sm">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Link href="/">
              <div className="inline-flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">F</span>
                </div>
                <span className="text-2xl font-black text-primary">FixIt</span>
              </div>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
            <p className="text-muted-foreground mt-1 text-sm">انضم إلى آلاف المستخدمين على FixIt</p>
          </div>

          {/* Role selector */}
          <div className="space-y-2">
            <Label>نوع الحساب</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "customer", label: "عميل", sub: "أريد خدمة", icon: User },
                { value: "artisan", label: "حرفي", sub: "أقدم خدمة", icon: Wrench },
              ].map(({ value, label, sub, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, role: value }))}
                  className={`p-4 border-2 rounded-xl text-right transition-all ${
                    form.role === value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <Icon size={20} className={form.role === value ? "text-primary mb-1" : "text-muted-foreground mb-1"} />
                  <div className="font-semibold text-sm">{label}</div>
                  <div className="text-xs text-muted-foreground">{sub}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input id="name" placeholder="محمد أحمد" className="h-11" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input id="email" type="email" dir="ltr" placeholder="name@example.com" className="h-11" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الجوال</Label>
                <Input id="phone" dir="ltr" placeholder="05XXXXXXXX" className="h-11" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Input id="city" placeholder="مدينتك" className="h-11" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور *</Label>
              <Input id="password" type="password" dir="ltr" placeholder="••••••••" className="h-11" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
              <p className="text-xs text-muted-foreground">6 أحرف على الأقل</p>
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={isPending}>
              {isPending ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">تسجيل الدخول</Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            بإنشائك حساباً، أنت توافق على{" "}
            <a href="#" className="underline hover:text-foreground">شروط الاستخدام</a>
            {" "}و{" "}
            <a href="#" className="underline hover:text-foreground">سياسة الخصوصية</a>
          </p>
        </div>
      </div>
    </div>
  );
}
