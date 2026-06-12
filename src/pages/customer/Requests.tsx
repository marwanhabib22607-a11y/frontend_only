import { useState } from "react";
import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { useListRequests } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Plus, FileText, ChevronLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function statusInfo(status: string) {
  const map: Record<string, string> = {
    open: "مفتوح", receiving_offers: "يستقبل عروض", offer_selected: "تم اختيار عرض",
    in_progress: "قيد التنفيذ", completed: "مكتمل", cancelled: "ملغي",
  };
  return map[status] || status;
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed") return "default";
  if (status === "cancelled") return "destructive";
  if (status === "in_progress") return "secondary";
  return "outline";
}

export function CustomerRequests() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: requests, isLoading } = useListRequests({ mine: true });

  const filtered = requests?.filter(r => statusFilter === "all" || r.status === statusFilter);

  return (
    <CustomerLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">طلباتي</h1>
          <Link href="/customer/requests/new">
            <Button className="gap-2"><Plus size={16} /> طلب جديد</Button>
          </Link>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="open">مفتوح</SelectItem>
            <SelectItem value="receiving_offers">يستقبل عروض</SelectItem>
            <SelectItem value="offer_selected">تم اختيار عرض</SelectItem>
            <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>

        {isLoading && <div className="flex items-center justify-center h-64">جاري التحميل...</div>}

        {!isLoading && (!filtered || filtered.length === 0) && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">لا توجد طلبات</p>
            <Link href="/customer/requests/new">
              <Button className="mt-4" variant="outline">أنشئ طلبك الأول</Button>
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {filtered?.map(req => (
            <Link href={`/customer/requests/${req.id}`} key={req.id}>
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{req.title}</h3>
                      <Badge variant={statusVariant(req.status)}>{statusInfo(req.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{req.category} · {req.city}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {req.offersCount} عرض · {new Date(req.createdAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                  <ChevronLeft size={20} className="text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
