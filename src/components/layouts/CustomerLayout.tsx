import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ListTodo, PlusCircle, MessageSquare, Star, Bell, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const navItems = [
    { href: "/customer/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/customer/requests/new", label: "طلب جديد", icon: PlusCircle },
    { href: "/customer/requests", label: "طلباتي", icon: ListTodo },
    { href: "/customer/chat", label: "المحادثات", icon: MessageSquare },
    { href: "/customer/reviews", label: "التقييمات", icon: Star },
    { href: "/customer/notifications", label: "الإشعارات", icon: Bell },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-card border-l w-64">
      <div className="p-6 border-b">
        <Link href="/">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">F</span>
            </div>
            <span className="text-xl font-black text-primary">FixIt</span>
          </div>
        </Link>
        <div className="bg-primary/5 rounded-lg px-3 py-2">
          <p className="text-xs text-muted-foreground">مرحباً،</p>
          <p className="font-semibold text-sm truncate">{user?.name}</p>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">عميل</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <span className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
                <item.icon size={18} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
          <LogOut size={18} />
          تسجيل خروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-muted/20" dir="rtl">
      <div className="hidden md:block h-screen sticky top-0 shadow-sm">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden sticky top-0 z-50 w-full border-b bg-background/98 backdrop-blur p-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <span className="text-white font-black text-xs">F</span>
              </div>
              <span className="text-lg font-black text-primary">FixIt</span>
            </div>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
