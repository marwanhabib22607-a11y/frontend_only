import { ArtisanLayout } from "@/components/layouts/ArtisanLayout";
import { useListPlans, useCreateSubscription, useGetMySubscription, getGetMySubscriptionQueryKey, getListPlansQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Crown } from "lucide-react";

export function ArtisanSubscription() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: plans, isLoading: plansLoading } = useListPlans({ query: { queryKey: getListPlansQueryKey() } });
  const { data: mySubscription, isLoading: subLoading } = useGetMySubscription({ query: { queryKey: getGetMySubscriptionQueryKey() } });

  const { mutate: subscribe, isPending } = useCreateSubscription({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMySubscriptionQueryKey() });
        toast({ title: "تم الاشتراك!", description: "تم تفعيل اشتراكك بنجاح" });
      },
      onError: (err: any) => toast({ title: "خطأ", description: err?.data?.error || "حدث خطأ في الاشتراك", variant: "destructive" }),
    },
  });

  if (plansLoading || subLoading) return <ArtisanLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></ArtisanLayout>;

  return (
    <ArtisanLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Crown className="text-yellow-500" size={28} />
          <h1 className="text-2xl font-bold">الاشتراكات والباقات</h1>
        </div>

        {mySubscription && mySubscription.status === "active" && (
          <Card className="border-green-400 bg-green-50/20">
            <CardContent className="p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-green-800">اشتراكك الحالي: {mySubscription.plan?.name}</p>
                <p className="text-sm text-green-700 mt-1">
                  صالح حتى: {mySubscription.endDate ? new Date(mySubscription.endDate).toLocaleDateString("ar-SA") : "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(plans || []).map(plan => {
            const isCurrentPlan = mySubscription?.planId === plan.id && mySubscription?.status === "active";
            return (
              <Card key={plan.id} className={isCurrentPlan ? "border-primary border-2" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrentPlan && <Badge>الحالي</Badge>}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {plan.price} <span className="text-lg font-normal text-muted-foreground">ج.م/شهر</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
                  {plan.features && plan.features.length > 0 && (
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />{f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "secondary" : "default"}
                    disabled={isCurrentPlan || isPending}
                    onClick={() => !isCurrentPlan && subscribe({ data: { planId: plan.id, billingCycle: "monthly" } })}
                  >
                    {isCurrentPlan ? "باقتك الحالية" : "اشترك الآن"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </ArtisanLayout>
  );
}
