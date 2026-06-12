import { useState } from "react";
import { ArtisanLayout } from "@/components/layouts/ArtisanLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Tag, MapPin, ArrowLeftRight, CheckCircle, User, ChevronDown, ChevronUp, DollarSign } from "lucide-react";

const OFFER_STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: "معلق", color: "bg-yellow-100 text-yellow-800" },
  accepted:  { label: "مقبول", color: "bg-green-100 text-green-800" },
  rejected:  { label: "مرفوض", color: "bg-red-100 text-red-800" },
  withdrawn: { label: "مسحوب", color: "bg-gray-100 text-gray-700" },
};

async function apiCall(method: string, path: string, body?: object) {
  const token = localStorage.getItem("fix-it-token");
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "حدث خطأ");
  return data;
}

function OfferNegotiationPanel({ offer, onUpdated }: { offer: any; onUpdated: () => void }) {
  const { toast } = useToast();
  const [counterPrice, setCounterPrice] = useState("");
  const [counterMessage, setCounterMessage] = useState("");

  const { data: rounds = [], refetch } = useQuery({
    queryKey: ["negotiations", offer.id],
    queryFn: () => apiCall("GET", `/offers/${offer.id}/negotiations`),
    enabled: offer.status === "pending",
  });

  const { mutate: submitCounter, isPending: submitting } = useMutation({
    mutationFn: (data: { proposedPrice: number; message: string }) =>
      apiCall("POST", `/offers/${offer.id}/counter`, data),
    onSuccess: () => {
      refetch();
      setCounterPrice("");
      setCounterMessage("");
      toast({ title: "تم إرسال عرضك المضاد" });
    },
    onError: (e: any) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  const { mutate: acceptCurrent, isPending: accepting } = useMutation({
    mutationFn: () => apiCall("POST", `/offers/${offer.id}/accept-current`, {}),
    onSuccess: () => {
      toast({ title: "تم القبول!", description: "تم قبول السعر المتفق عليه" });
      onUpdated();
    },
    onError: (e: any) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  const lastSender = rounds.length > 0 ? rounds[rounds.length - 1].senderRole : "artisan";
  const latestPrice = rounds.length > 0 ? rounds[rounds.length - 1].proposedPrice : offer.price;
  const artisanCanRespond = offer.status === "pending" && rounds.length > 0 && lastSender === "customer";

  return (
    <div className="space-y-3">
      {/* Negotiation history */}
      {rounds.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">سجل التفاوض</p>
          {rounds.map((r: any) => (
            <div key={r.id} className={`flex gap-2 ${r.senderRole === "artisan" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs rounded-xl px-3 py-2 text-sm ${
                r.senderRole === "artisan"
                  ? "bg-amber-600 text-white"
                  : "bg-muted text-foreground"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <User size={12} />
                  <span className="text-xs opacity-80">{r.senderRole === "artisan" ? "أنت" : "العميل"}</span>
                  <span className="font-bold">{r.proposedPrice} ج.م</span>
                </div>
                {r.message && <p className="text-xs opacity-90">{r.message}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {rounds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm text-center">
          <span className="text-blue-700">السعر الحالي: </span>
          <span className="font-bold text-blue-900">{latestPrice} ج.م</span>
          {lastSender === "customer" && <span className="text-blue-600 text-xs mr-2">(بانتظار ردك)</span>}
        </div>
      )}

      {/* Artisan response */}
      {artisanCanRespond && (
        <div className="space-y-2 bg-amber-50 rounded-xl p-3 border border-amber-200">
          <p className="text-xs font-semibold text-amber-800">العميل اقترح سعراً جديداً — يمكنك الرد</p>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="سعرك المضاد (ج.م)"
              value={counterPrice}
              onChange={e => setCounterPrice(e.target.value)}
              className="flex-1"
              min="0"
            />
          </div>
          <Textarea
            placeholder="رسالة اختيارية..."
            value={counterMessage}
            onChange={e => setCounterMessage(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 flex-1"
              disabled={!counterPrice || submitting}
              onClick={() => submitCounter({ proposedPrice: parseFloat(counterPrice), message: counterMessage })}
            >
              <ArrowLeftRight size={14} /> إرسال عرض مضاد
            </Button>
            <Button
              size="sm"
              className="gap-1 flex-1 bg-green-600 hover:bg-green-700"
              disabled={accepting}
              onClick={() => acceptCurrent()}
            >
              <CheckCircle size={14} /> قبول ({latestPrice} ج.م)
            </Button>
          </div>
        </div>
      )}

      {/* No rounds yet — waiting for customer */}
      {rounds.length === 0 && offer.status === "pending" && (
        <p className="text-xs text-muted-foreground text-center py-2">في انتظار رد العميل على عرضك الأولي ({offer.price} ج.م)</p>
      )}
    </div>
  );
}

export function ArtisanMyOffers() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: offers = [], isLoading, refetch } = useQuery({
    queryKey: ["my-offers"],
    queryFn: () => apiCall("GET", "/offers/my"),
  });

  if (isLoading) {
    return (
      <ArtisanLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">جاري التحميل...</div>
      </ArtisanLayout>
    );
  }

  const sortedOffers = [...offers].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <ArtisanLayout>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <FileText size={24} className="text-amber-600" />
          <h1 className="text-2xl font-bold">عروضي</h1>
          {sortedOffers.length > 0 && (
            <span className="text-sm bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
              {sortedOffers.length} عرض
            </span>
          )}
        </div>

        {sortedOffers.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-1">لا توجد عروض بعد</p>
            <p className="text-sm">ابدأ بتصفح الطلبات وإرسال عروضك</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedOffers.map((offer: any) => {
              const statusInfo = OFFER_STATUS[offer.status] ?? { label: offer.status, color: "bg-gray-100 text-gray-700" };
              const isExpanded = expandedId === offer.id;
              const isPending = offer.status === "pending";

              return (
                <Card key={offer.id} className={`transition-shadow hover:shadow-md ${
                  offer.status === "accepted" ? "border-green-400" :
                  offer.status === "rejected" || offer.status === "withdrawn" ? "opacity-70" : ""
                }`}>
                  <CardContent className="p-4">
                    {/* Request title + status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{offer.request?.title || "طلب"}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                          {offer.request?.category && (
                            <span className="flex items-center gap-1"><Tag size={11} />{offer.request.category}</span>
                          )}
                          {offer.request?.city && (
                            <span className="flex items-center gap-1"><MapPin size={11} />{offer.request.city}</span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Offer price */}
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                        <DollarSign size={14} className="text-amber-600" />
                        <span className="font-bold text-amber-900">{offer.price} ج.م</span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(offer.createdAt).toLocaleDateString("ar-EG")}
                      </div>
                    </div>

                    {/* Expand/collapse negotiation */}
                    {isPending && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-xs w-full border border-dashed"
                        onClick={() => setExpandedId(isExpanded ? null : offer.id)}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {isExpanded ? "إخفاء التفاوض" : "عرض / إدارة التفاوض"}
                      </Button>
                    )}

                    {isExpanded && isPending && (
                      <div className="mt-3 border-t pt-3">
                        <OfferNegotiationPanel
                          offer={offer}
                          onUpdated={() => { refetch(); setExpandedId(null); }}
                        />
                      </div>
                    )}

                    {offer.status === "accepted" && (
                      <div className="flex items-center gap-1.5 text-xs text-green-700 mt-1">
                        <CheckCircle size={12} /> تم قبول عرضك — ابدأ بتصفح مهامك
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ArtisanLayout>
  );
}
