import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setLocation("/");
  };

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/#services", label: "خدماتنا" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans" dir="rtl">
      {/* Top bar */}
      <div className="hidden md:block bg-primary/5 border-b text-sm py-2">
        <div className="container flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><Phone size={13} /> +20 11 02637733</span>
            <span className="flex items-center gap-1"><Mail size={13} /> hello@fixit.sa</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-primary transition-colors"><Facebook size={14} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Twitter size={14} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Instagram size={14} /></a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/95 shadow-sm">
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span className="text-2xl font-black text-primary tracking-tight">FixIt</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <span className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href) ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link href={`/${user.role}/dashboard`}>
                  <Button variant="ghost" size="sm">لوحة التحكم</Button>
                </Link>
                <Button size="sm" variant="outline" onClick={handleLogout}>تسجيل خروج</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">تسجيل الدخول</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">حساب جديد</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-background/98 px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                <span className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="border-t pt-3 mt-3 space-y-2">
              {user ? (
                <>
                  <Link href={`/${user.role}/dashboard`} onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">لوحة التحكم</Button>
                  </Link>
                  <Button className="w-full" variant="ghost" onClick={handleLogout}>تسجيل خروج</Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">حساب جديد</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-900 text-slate-300">
        <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">F</span>
              </div>
              <span className="text-2xl font-black text-white">FixIt</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              منصة موثوقة تجمعك بأفضل الحرفيين والفنيين في منطقتك. خدمة سريعة، جودة عالية، وأسعار منافسة.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Facebook size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Instagram size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              {[{ href: "/", label: "الرئيسية" }, { href: "/about", label: "من نحن" }, { href: "/contact", label: "تواصل معنا" }].map(l => (
                <li key={l.href}><Link href={l.href} className="text-slate-400 hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">الخدمات</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {["كهرباء", "سباكة", "نجارة", "تكييف", "دهانات", "إصلاح أجهزة"].map(s => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Phone size={14} /> +20 11 02637733</li>
              <li className="flex items-center gap-2"><Mail size={14} /> hello@fixit.sa</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> متاح في منطقتك</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800">
          <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} FixIt. جميع الحقوق محفوظة.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300 transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-slate-300 transition-colors">شروط الاستخدام</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
