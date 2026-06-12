import { ArtisanLayout } from "@/components/layouts/ArtisanLayout";
import { useListNotifications, useMarkAllNotificationsRead, useMarkNotificationRead, getListNotificationsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function ArtisanNotifications() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: notifications, isLoading } = useListNotifications({ query: { queryKey: getListNotificationsQueryKey() } });
  const { mutate: markAll } = useMarkAllNotificationsRead({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }); toast({ title: "تم", description: "تم تعليم جميع الإشعارات كمقروءة" }); } } });
  const { mutate: markOne } = useMarkNotificationRead({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }) } });

  if (isLoading) return <ArtisanLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></ArtisanLayout>;

  const unread = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <ArtisanLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">الإشعارات</h1>
            {unread > 0 && <p className="text-sm text-muted-foreground">{unread} غير مقروءة</p>}
          </div>
          {unread > 0 && <Button variant="outline" size="sm" className="gap-2" onClick={() => markAll()}><CheckCheck size={16} /> تعليم الكل</Button>}
        </div>
        {(!notifications || notifications.length === 0) ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell size={64} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <Card key={n.id} className={n.isRead ? "opacity-60" : "border-primary/30 bg-primary/5"}>
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString("ar-SA")}</p>
                  </div>
                  {!n.isRead && <Button variant="ghost" size="sm" onClick={() => markOne({ notificationId: n.id })}><CheckCheck size={16} /></Button>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ArtisanLayout>
  );
}
