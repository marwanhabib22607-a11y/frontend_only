import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const { login: authLogin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useLogin();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginForm) => {
    login.mutate({ data }, {
      onSuccess: (res) => {
        authLogin(res.token);
        toast({ title: "أهلاً بعودتك!", description: "تم تسجيل الدخول بنجاح" });
        if (res.user.role === "admin") setLocation("/admin/dashboard");
        else if (res.user.role === "artisan") setLocation("/artisan/dashboard");
        else setLocation("/customer/dashboard");
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "فشل تسجيل الدخول",
          description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-background" dir="rtl">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center space-y-6">
          <Link href="/">
            <div className="flex items-center gap-3 justify-center mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">F</span>
              </div>
              <span className="text-4xl font-black text-white">FixIt</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold">مرحباً بعودتك!</h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            سجل دخولك للوصول إلى لوحة التحكم وإدارة خدماتك
          </p>
          <div className="space-y-3 text-right mt-8">
            {[
              "عملاء: اطلب خدمة وتابع طلباتك",
              "حرفيون: تصفح الطلبات وقدّم عروضك",
              "إدارة موثوقة وآمنة",
            ].map(t => (
              <div key={t} className="flex items-center gap-2 text-primary-foreground/90">
                <ShieldCheck size={16} className="shrink-0" />
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
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

          <div className="text-center lg:text-right">
            <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
            <p className="text-muted-foreground mt-1">أدخل بيانات حسابك للمتابعة</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                placeholder="name@example.com"
                className="h-11"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <a href="#" className="text-xs text-primary hover:underline">نسيت كلمة المرور؟</a>
              </div>
              <Input
                id="password"
                type="password"
                dir="ltr"
                placeholder="••••••••"
                className="h-11"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={login.isPending}>
              {login.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs text-muted-foreground bg-background px-2">أو</div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">إنشاء حساب جديد</Link>
          </p>

          {/* Demo hint */}
          <div className="bg-muted/60 rounded-xl p-4 text-xs text-muted-foreground space-y-1 border">
            <p className="font-semibold text-foreground mb-2">حسابات تجريبية:</p>
            <p><span className="font-medium">عميل:</span> customer@fixit.sa / password</p>
            <p><span className="font-medium">حرفي:</span> artisan@fixit.sa / password</p>
            <p><span className="font-medium">مدير:</span> admin@fixit.sa / password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
