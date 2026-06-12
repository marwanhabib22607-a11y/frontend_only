import { PublicLayout } from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShieldCheck, Users, Zap, Award, Target, Heart, ArrowLeft } from "lucide-react";

const TEAM = [
  { name: "عبدالله المطيري", role: "المدير التنفيذي", initial: "ع" },
  { name: "سارة الحربي", role: "مدير المنتج", initial: "س" },
  { name: "أحمد الزهراني", role: "المدير التقني", initial: "أ" },
  { name: "نورة العتيبي", role: "مدير العمليات", initial: "ن" },
];

const VALUES = [
  { icon: ShieldCheck, title: "الثقة", desc: "نضمن حرفيين موثوقين ومعتمدين لكل خدمة" },
  { icon: Zap, title: "السرعة", desc: "نربطك بالحرفي المناسب في أقل وقت ممكن" },
  { icon: Award, title: "الجودة", desc: "نضمن جودة العمل أو نُعيد تنفيذه مجاناً" },
  { icon: Heart, title: "العناية", desc: "رضاك هو مقياس نجاحنا الحقيقي" },
];

export function About() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/8 to-background">
        <div className="container text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full">
            <Target size={14} /> قصتنا
          </div>
          <h1 className="text-4xl md:text-5xl font-black">من نحن</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            FixIt منصة موثوقة تربط أصحاب المنازل بالحرفيين المعتمدين، 
            بهدف تسهيل الحصول على خدمات صيانة منزلية عالية الجودة في أي وقت.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">مهمتنا</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                نؤمن بأن كل بيت يستحق صيانة سريعة واحترافية. لذلك أنشأنا FixIt — منصة تجمع بين الحرفيين المهرة 
                وأصحاب المنازل بطريقة شفافة وموثوقة.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                نطمح إلى أن نكون الخيار الأول لكل من يحتاج خدمة منزلية موثوقة، 
              في أي منطقة وأي مدينة حول العالم.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "+5,000", label: "عميل سعيد" },
                  { value: "+1,200", label: "حرفي موثوق" },
                  { value: "2022", label: "سنة التأسيس" },
                  { value: "15+", label: "مدينة حول العالم" },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-primary/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-primary">{value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-white font-black text-3xl">F</span>
              </div>
              <h3 className="text-2xl font-black text-primary">FixIt</h3>
              <p className="text-muted-foreground">"نصلح.. من أول مرة"</p>
              <div className="flex flex-col gap-2 mt-6">
                {["موثوق", "سريع", "محترف"].map(tag => (
                  <span key={tag} className="bg-primary text-white rounded-full px-4 py-1 text-sm font-medium inline-block">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">قيمنا</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">المبادئ التي تقوم عليها FixIt</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-primary" size={26} />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">فريقنا</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">المحترفون خلف FixIt</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {TEAM.map(({ name, role, initial }) => (
              <div key={name} className="text-center space-y-3">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto text-white text-2xl font-black">
                  {initial}
                </div>
                <div>
                  <p className="font-bold">{name}</p>
                  <p className="text-sm text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container text-center text-white space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">هل أنت مستعد؟</h2>
          <p className="text-primary-foreground/80 text-lg">انضم إلى FixIt اليوم وجرّب الفرق</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">ابدأ الآن <ArrowLeft size={16} /></Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10 hover:text-white">تواصل معنا</Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
