import { useState } from "react";
import { PublicLayout } from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const CONTACT_INFO = [
  { icon: Phone, label: "الهاتف", value: "+20 11 02637733", hint: "من الأحد إلى الخميس" },
  { icon: Mail, label: "البريد الإلكتروني", value: "hello@fixit.sa", hint: "نرد خلال 24 ساعة" },
  { icon: MapPin, label: "العنوان", value: "متاح في منطقتك", hint: "خدمات في أي مكان" },
  { icon: Clock, label: "ساعات العمل", value: "٨ صباحاً - ١٠ مساءً", hint: "طوال أيام الأسبوع" },
];

export function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "تم إرسال رسالتك!", description: "سنرد عليك في أقرب وقت ممكن" });
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/8 to-background">
        <div className="container text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black">تواصل معنا</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            هل لديك سؤال أو اقتراح أو مشكلة؟ فريق FixIt دائماً هنا لمساعدتك.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-3">معلومات التواصل</h2>
                <p className="text-muted-foreground leading-relaxed">
                  يسعدنا التواصل معك. اختر الطريقة المناسبة لك أو أرسل لنا رسالة مباشرة.
                </p>
              </div>
              <div className="space-y-4">
                {CONTACT_INFO.map(({ icon: Icon, label, value, hint }) => (
                  <div key={label} className="flex items-start gap-4 p-4 bg-card border rounded-xl hover:shadow-sm transition-shadow">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="text-primary" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-semibold">{value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-2">هل أنت حرفي؟</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  إذا كنت حرفياً وتريد الانضمام إلى FixIt وتوسيع نطاق عملك، تواصل معنا مباشرة.
                </p>
                <a href="mailto:artisans@fixit.sa" className="text-primary font-medium hover:underline text-sm">
                  artisans@fixit.sa
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">أرسل رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم *</Label>
                    <Input
                      id="name"
                      placeholder="اسمك الكامل"
                      className="h-11"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      dir="ltr"
                      placeholder="name@example.com"
                      className="h-11"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">الموضوع *</Label>
                  <Input
                    id="subject"
                    placeholder="موضوع رسالتك"
                    className="h-11"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة *</Label>
                  <Textarea
                    id="message"
                    placeholder="اكتب رسالتك هنا..."
                    className="min-h-[140px] resize-none"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-11 gap-2" disabled={loading}>
                  <Send size={16} />
                  {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">الأسئلة الشائعة</h2>
            <p className="text-muted-foreground">إجابات على أكثر الأسئلة شيوعاً</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "كيف أطلب خدمة؟", a: "سجّل حساباً كعميل، ثم اضغط على 'طلب جديد' واملأ تفاصيل المشكلة والموقع والوقت المناسب." },
              { q: "كيف ينضم الحرفي؟", a: "سجّل حساباً كحرفي، أكمل ملفك الشخصي وانتظر موافقة الفريق (خلال 24 ساعة)، ثم ابدأ تلقي الطلبات." },
              { q: "هل الخدمة مضمونة؟", a: "نعم، جميع الحرفيين في المنصة موثوقون ومُقيَّمون. في حال وجود مشكلة، يعيد الحرفي العمل أو نُعيد إليك مبلغك." },
              { q: "ما تكلفة الاستخدام؟", a: "التسجيل للعملاء مجاني تماماً. الحرفيون يشتركون بباقات شهرية أو سنوية مرنة للوصول إلى الطلبات." },
            ].map(({ q, a }) => (
              <div key={q} className="bg-card border rounded-xl p-5">
                <h3 className="font-bold mb-2">{q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
