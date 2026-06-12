import { ArtisanLayout } from "@/components/layouts/ArtisanLayout";
import { useListConversations, getListConversationsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MessageSquare, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ArtisanChat() {
  const { data: conversations, isLoading } = useListConversations({
    query: { queryKey: getListConversationsQueryKey() }
  });

  if (isLoading) return <ArtisanLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></ArtisanLayout>;

  return (
    <ArtisanLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">المحادثات</h1>
        {(!conversations || conversations.length === 0) ? (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare size={64} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد محادثات بعد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(conv => {
              const other = conv.customer;
              return (
                <Link href={`/artisan/chat/${conv.id}`} key={conv.id}>
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{other?.name?.[0] || "ع"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{other?.name || "العميل"}</p>
                        <p className="text-sm text-muted-foreground truncate">{conv.request?.title}</p>
                        {conv.lastMessage?.message && (
                          <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.message}</p>
                        )}
                      </div>
                      <ChevronLeft size={20} className="text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </ArtisanLayout>
  );
}
