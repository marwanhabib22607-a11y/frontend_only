import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8" dir="rtl">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-4xl font-black text-primary">F</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-primary">404</h1>
          <h2 className="text-2xl font-bold text-foreground">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground leading-relaxed">
            عذراً، لا يمكن العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="gap-2">
            <HomeIcon size={18} />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
}
