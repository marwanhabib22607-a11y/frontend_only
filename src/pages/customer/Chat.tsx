import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { useListConversations, getListConversationsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MessageSquare, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export function CustomerChat() {
  const { user } = useAuth();
  const { data: conversations, isLoading } = useListConversations({
    query: { queryKey: getListConversationsQueryKey() }
  });

  if (isLoading) return <CustomerLayout><div className="flex items-center justify-center h-64">جاري التحميل...</div></CustomerLayout>;

  return (
    <CustomerLayout>
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
              const other = conv.artisan?.user;
              const lastName = conv.lastMessage?.message;
              return (
                <Link href={`/customer/chat/${conv.id}`} key={conv.id}>
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{other?.name?.[0] || "ح"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{other?.name || "الحرفي"}</p>
                        <p className="text-sm text-muted-foreground truncate">{conv.request?.title}</p>
                        {lastName && <p className="text-xs text-muted-foreground truncate">{lastName}</p>}
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
    </CustomerLayout>
  );
}
