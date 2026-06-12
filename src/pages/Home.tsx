import { PublicLayout } from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Wrench, Droplet, Hammer, ThermometerSnowflake, Paintbrush, Power, Settings,
  ShieldCheck, Clock, Star, Users, CheckCircle, ArrowLeft, Zap, Award, HeartHandshake
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
  { name: "كهرباء", icon: Power, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  { name: "سباكة", icon: Droplet, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { name: "نجارة", icon: Hammer, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  { name: "تكييف", icon: ThermometerSnowflake, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
  { name: "دهانات", icon: Paintbrush, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  { name: "إصلاح أجهزة", icon: Wrench, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { name: "صيانة عامة", icon: Settings, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
];

const STATS = [
  { value: "+5,000", label: "عميل راضٍ" },
  { value: "+1,200", label: "حرفي موثوق" },
  { value: "+18,000", label: "خدمة مكتملة" },
  { value: "4.8★", label: "متوسط التقييم" },
];

const WHY_US = [
  { icon: ShieldCheck, title: "حرفيون موثوقون", desc: "كل حرفي يمر بتحقق هوية وتقييم جودة قبل القبول في المنصة." },
  { icon: Zap, title: "استجابة سريعة", desc: "تلقَّ عروض أسعار خلال دقائق من أمهر الحرفيين القريبين منك." },
  { icon: Award, title: "ضمان الجودة", desc: "إذا لم تكن راضياً عن الخدمة، نضمن لك الحل أو استرداد المبلغ." },
  { icon: HeartHandshake, title: "دعم على مدار الساعة", desc: "فريق الدعم متاح دائماً لمساعدتك وحل أي مشكلة." },
];

const TESTIMONIALS = [
  { name: "أ/ محمد السيد", city: "مدينتي", rating: 5, text: "خدمة ممتازة! وجدت كهربائي محترف خلال ساعة واحدة وحل المشكلة باحتراف." },
  { name: "م/ يوسف عثمان", city: "مدينتي", rating: 5, text: "المنصة سهلة الاستخدام جداً، وأسعار الحرفيين منافسة. أنصح بها بشدة." },
  { name: "د/ أحمد إبراهيم", city: "مدينتي", rating: 5, text: "استخدمت FixIt لإصلاح التكييف وكانت التجربة رائعة من البداية للنهاية." },
];

export function Home() {
  const { user } = useAuth();

  const ctaHref = user
    ? user.role === "customer" ? "/customer/requests/new" : `/${user.role}/dashboard`
    : "/register";

  const artisanHref = user ? `/${user.role}/dashboard` : "/register?role=artisan";

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-background" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full">
              <Zap size={14} />
              منصة موثوقة للخدمات المنزلية
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
              صلّح بيتك مع{" "}
              <span className="text-primary">FixIt</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              منصة موثوقة تجمعك بأفضل الحرفيين والفنيين في منطقتك.
              خدمة سريعة، جودة مضمونة، وأسعار شفافة.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Link href={ctaHref}>
                <Button size="lg" className="text-base px-8 gap-2">
                  اطلب خدمة الآن <ArrowLeft size={16} />
                </Button>
              </Link>
              <Link href={artisanHref}>
                <Button size="lg" variant="outline" className="text-base px-8">
                  انضم كحرفي
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground">
              {["✓ بدون رسوم تسجيل", "✓ عروض مجانية", "✓ حرفيون موثوقون"].map(t => (
                <span key={t} className="font-medium text-foreground/70">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-primary py-10">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-black">{value}</div>
              <div className="text-primary-foreground/70 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">خدماتنا</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">نغطي جميع احتياجاتك المنزلية بحرفيين متخصصين في كل مجال</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={user
                  ? user.role === "customer" ? `/customer/requests/new` : `/artisan/requests`
                  : "/register"}
                className="group block"
              >
                <div className={`bg-card border ${cat.border} rounded-2xl p-5 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer`}>
                  <div className={`w-14 h-14 mx-auto rounded-xl ${cat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <cat.icon className={`w-7 h-7 ${cat.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">كيف تعمل FixIt؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">ثلاث خطوات بسيطة تفصلك عن الحصول على أفضل خدمة</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "١", title: "اطلب الخدمة", desc: "صف المشكلة التي تواجهها، وحدد الوقت والمكان المناسب لك.", icon: Hammer },
              { step: "٢", title: "تلقَّ العروض", desc: "يتواصل معك أفضل الحرفيين بعروض أسعار شفافة وتفصيلية.", icon: Users },
              { step: "٣", title: "اختر ونفّذ", desc: "اختر العرض الأنسب، ابدأ العمل، وقيّم الحرفي بعد الانتهاء.", icon: CheckCircle },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="relative text-center group">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon size={32} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 w-7 h-7 bg-primary text-white rounded-full text-sm font-bold flex items-center justify-center">
                  {step}
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why FixIt ── */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">لماذا FixIt؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">نقدم تجربة متكاملة تجمع بين الجودة والثقة والسرعة</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-primary" size={26} />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">ماذا يقول عملاؤنا؟</h2>
            <p className="text-muted-foreground">آراء حقيقية من عملاء استخدموا FixIt</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map(({ name, city, rating, text }) => (
              <div key={name} className="bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-20 bg-primary">
        <div className="container text-center text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">جاهز للبدء؟</h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            سجل الآن مجاناً وابدأ في الاستفادة من خدمات FixIt
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href={user ? ctaHref : "/register"}>
              <Button size="lg" variant="secondary" className="text-base px-8 gap-2">
                {user ? "انتقل للوحة التحكم" : "ابدأ الآن مجاناً"} <ArrowLeft size={16} />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-base px-8 text-white border-white/50 hover:bg-white/10 hover:text-white">
                تعرف علينا أكثر
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
