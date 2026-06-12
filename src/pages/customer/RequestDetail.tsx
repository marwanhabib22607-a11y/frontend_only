import { useState } from "react";
import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import {
  useGetRequest, useSelectOffer, useCreateReview,
  getGetRequestQueryKey
} from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Star, MessageSquare, CheckCircle, MapPin, Calendar, Tag, MessageCircle, ArrowLeftRight, DollarSign, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  open: { label: "مفتوح", color: "bg-blue-100 text-blue-800" },
  receiving_offers: { label: "يستقبل عروض", color: "bg-yellow-100 text-yellow-800" },
  offer_selected: { label: "تم اختيار عرض", color: "bg-purple-100 text-purple-800" },
  in_progress: { label: "قيد التنفيذ", color: "bg-amber-100 text-amber-800" },
  completed: { label: "مكتمل", color: "bg-green-100 text-green-800" },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-800" },
};

// Direct API calls for negotiation (not in generated client)
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

function NegotiationThread({ offerId, offer, requestStatus, onFinalized }: {
  offerId: number;
  offer: any;
  requestStatus: string;
  onFinalized: () => void;
}) {
  const { toast } = useToast();
  const [counterPrice, setCounterPrice] = useState("");
  const [counterMessage, setCounterMessage] = useState("");

  const { data: rounds = [], refetch } = useQuery({
    queryKey: ["negotiations", offerId],
    queryFn: () => apiCall("GET", `/offers/${offerId}/negotiations`),
    enabled: offer.status === "pending",
  });

  const { mutate: submitCounter, isPending: submittingCounter } = useMutation({
    mutationFn: (data: { proposedPrice: number; message: string }) =>
      apiCall("POST", `/offers/${offerId}/counter`, data),
    onSuccess: () => {
      refetch();
      setCounterPrice("");
      setCounterMessage("");
      toast({ title: "تم إرسال العرض المضاد" });
    },
    onError: (e: any) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  const { mutate: acceptCurrent, isPending: accepting } = useMutation({
    mutationFn: () => apiCall("POST", `/offers/${offerId}/accept-current`, {}),
    onSuccess: () => {
      toast({ title: "تم القبول!", description: "تم قبول العرض بنجاح وسيتواصل معك الحرفي" });
      onFinalized();
    },
    onError: (e: any) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  const canNegotiate = requestStatus === "receiving_offers" && offer.status === "pending";
  const latestPrice = rounds.length > 0 ? rounds[rounds.length - 1].proposedPrice : offer.price;
  const lastSender = rounds.length > 0 ? rounds[rounds.length - 1].senderRole : "artisan";
  const customerCanRespond = canNegotiate && lastSender === "artisan";
  // Accept button must show the latest price proposed by the ARTISAN, not the customer's own counter
  const latestArtisanRound = [...rounds].reverse().find((r: any) => r.senderRole === "artisan");
  const latestArtisanPrice = latestArtisanRound ? latestArtisanRound.proposedPrice : offer.price;

  return (
    <div className="mt-3 border-t pt-3 space-y-3">
      {/* Negotiation history */}
      {rounds.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">سجل التفاوض</p>
          {rounds.map((r: any) => (
            <div key={r.id} className={`flex gap-2 ${r.senderRole === "customer" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs rounded-xl px-3 py-2 text-sm ${
                r.senderRole === "customer"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <User size={12} />
                  <span className="text-xs opacity-80">{r.senderRole === "customer" ? "أنت" : "الحرفي"}</span>
                  <span className="font-bold text-sm">{r.proposedPrice} ج.م</span>
                </div>
                {r.message && <p className="text-xs opacity-90">{r.message}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current price summary */}
      {rounds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-center">
          <span className="text-blue-700">السعر الحالي المقترح: </span>
          <span className="font-bold text-blue-900 text-lg">{latestPrice} ج.م</span>
        </div>
      )}

      {/* Customer actions */}
      {canNegotiate && (
        <div className="space-y-3">
          {customerCanRespond && (
            <div className="space-y-2 bg-muted/40 rounded-xl p-3">
              <p className="text-xs font-semibold text-muted-foreground">عرض مضاد</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="سعرك المقترح (ج.م)"
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
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-2"
                disabled={!counterPrice || submittingCounter}
                onClick={() => submitCounter({ proposedPrice: parseFloat(counterPrice), message: counterMessage })}
              >
                <ArrowLeftRight size={14} /> إرسال عرض مضاد
              </Button>
            </div>
          )}
          <Button
            size="sm"
            className="w-full gap-2 bg-green-600 hover:bg-green-700"
            disabled={accepting}
            onClick={() => acceptCurrent()}
          >
            <CheckCircle size={14} /> قبول السعر ({latestArtisanPrice} ج.م)
          </Button>
        </div>
      )}
    </div>
  );
}

export function CustomerRequestDetail() {
  const [, params] = useRoute("/customer/requests/:id");
  const id = parseInt(params?.id || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [expandedOffer, setExpandedOffer] = useState<number | null>(null);

  const { data: request, isLoading } = useGetRequest(id, {
    query: { enabled: !!id, queryKey: getGetRequestQueryKey(id) }
  });

  const { mutate: selectOffer, isPending: selectingOffer } = useSelectOffer({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetRequestQueryKey(id) });
        toast({ title: "تم!", description: "تم قبول العرض وسيتواصل معك الحرفي قريباً" });
      },
      onError: (err: any) => toast({ title: "خطأ", description: err?.data?.error || "حدث خطأ", variant: "destructive" }),
    },
  });

  const { mutate: createReview, isPending: creatingReview } = useCreateReview({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetRequestQueryKey(id) });
        setReviewOpen(false);
        toast({ title: "شكراً!", description: "تم إرسال تقييمك بنجاح" });
      },
      onError: (err: any) => toast({ title: "خطأ", description: err?.data?.error || "حدث خطأ", variant: "destructive" }),
    },
  });

  const handleFinalized = () => {
    queryClient.invalidateQueries({ queryKey: getGetRequestQueryKey(id) });
  };

  if (isLoading) return <CustomerLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></CustomerLayout>;
  if (!request) return <CustomerLayout><div className="text-center py-16 text-muted-foreground">الطلب غير موجود</div></CustomerLayout>;

  const statusInfo = STATUS_MAP[request.status] ?? { label: request.status, color: "bg-gray-100 text-gray-800" };

  return (
    <CustomerLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{request.title}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          {(request as any).conversation && (
            <Link href={`/customer/chat/${(request as any).conversation.id}`}>
              <Button variant="outline" className="gap-2"><MessageSquare size={16} /> المحادثة</Button>
            </Link>
          )}
        </div>

        {/* Details */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground"><Tag size={16} /><span>{request.category}</span></div>
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin size={16} /><span>{request.city} · {request.locationText}</span></div>
            <div className="flex items-center gap-2 text-muted-foreground"><Calendar size={16} /><span>التاريخ المفضل: {request.preferredDate}</span></div>
            <Separator />
            <p className="text-foreground leading-relaxed">{request.description}</p>
          </CardContent>
        </Card>

        {/* Offers */}
        <Card>
          <CardHeader>
            <CardTitle>العروض ({(request as any).offers?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!((request as any).offers?.length) && (
              <p className="text-center py-6 text-muted-foreground">لا توجد عروض بعد</p>
            )}
            {(request as any).offers?.map((offer: any) => (
              <div key={offer.id} className={`border rounded-xl p-4 transition-colors ${
                offer.status === "accepted" ? "border-green-400 bg-green-50/30" :
                offer.status === "rejected" || offer.status === "withdrawn" ? "opacity-60 border-dashed" : ""
              }`}>
                {/* Artisan info + price */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{offer.artisan?.user?.name || "حرفي"}</p>
                    <p className="text-sm text-muted-foreground">{offer.artisan?.city}</p>
                    {offer.artisan?.averageRating && (
                      <div className="flex items-center gap-1 text-sm mt-0.5">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{Number(offer.artisan.averageRating).toFixed(1)} ({offer.artisan.reviewsCount} تقييم)</span>
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-primary">{offer.price} ج.م</p>
                    <div className="flex justify-end mt-1">
                      {offer.status === "accepted" && <Badge className="bg-green-600">مقبول</Badge>}
                      {offer.status === "rejected" && <Badge variant="destructive">مرفوض</Badge>}
                      {offer.status === "withdrawn" && <Badge variant="outline">مسحوب</Badge>}
                      {offer.status === "pending" && <Badge variant="outline">معلق</Badge>}
                    </div>
                  </div>
                </div>

                {/* Offer details */}
                <div className="text-sm space-y-1 mb-3">
                  <p><strong>وقت الوصول:</strong> {offer.arrivalTimeText}</p>
                  <p><strong>المدة المتوقعة:</strong> {offer.estimatedDurationText}</p>
                  <p className="text-muted-foreground">{offer.message}</p>
                </div>

                {/* Actions: accept directly or negotiate */}
                {request.status === "receiving_offers" && offer.status === "pending" && (
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => selectOffer({ requestId: id, data: { offerId: offer.id } })}
                      disabled={selectingOffer}
                    >
                      <CheckCircle size={14} className="ml-1" /> قبول فوري
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => setExpandedOffer(expandedOffer === offer.id ? null : offer.id)}
                    >
                      <MessageCircle size={14} />
                      {expandedOffer === offer.id ? "إغلاق التفاوض" : "تفاوض على السعر"}
                    </Button>
                  </div>
                )}

                {/* Negotiation thread */}
                {expandedOffer === offer.id && (
                  <NegotiationThread
                    offerId={offer.id}
                    offer={offer}
                    requestStatus={request.status}
                    onFinalized={handleFinalized}
                  />
                )}

                {/* Show negotiation thread for accepted offer (read-only history) */}
                {offer.status === "accepted" && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-700">
                    <CheckCircle size={12} /> تم قبول هذا العرض بسعر {offer.price} ج.م
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Review */}
        {request.status === "completed" && !(request as any).review && (
          <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2"><Star size={16} /> تقييم الحرفي</Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>تقييم الخدمة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>التقييم</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => setReviewRating(n)}>
                        <Star size={28} className={n <= reviewRating ? "text-yellow-500 fill-yellow-500" : "text-muted"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>تعليقك (اختياري)</Label>
                  <Textarea placeholder="شاركنا تجربتك مع الحرفي..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} />
                </div>
                <Button className="w-full" disabled={creatingReview} onClick={() => {
                  const selectedOffer = (request as any).offers?.find((o: any) => o.status === "accepted");
                  if (!selectedOffer) return;
                  createReview({ data: { requestId: id, artisanId: selectedOffer.artisanId, rating: reviewRating, comment: reviewComment || undefined } });
                }}>
                  {creatingReview ? "جاري الإرسال..." : "إرسال التقييم"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {(request as any).review && (
          <Card>
            <CardHeader><CardTitle>تقييمك</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} size={20} className={n <= (request as any).review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"} />
                ))}
              </div>
              {(request as any).review.comment && <p className="text-muted-foreground">{(request as any).review.comment}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </CustomerLayout>
  );
}
