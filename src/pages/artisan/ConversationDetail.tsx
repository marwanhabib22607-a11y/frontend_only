import { useState, useEffect, useRef } from "react";
import { ArtisanLayout } from "@/components/layouts/ArtisanLayout";
import { useListMessages, useSendMessage, getListMessagesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Send } from "lucide-react";

export function ArtisanConversationDetail() {
  const [, params] = useRoute("/artisan/chat/:id");
  const id = parseInt(params?.id || "0", 10);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useListMessages(id, {
    query: { enabled: !!id, queryKey: getListMessagesQueryKey(id), refetchInterval: 5000 }
  });

  const { mutate: sendMessage, isPending } = useSendMessage({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(id) });
        setMsg("");
      },
      onError: () => toast({ title: "خطأ", description: "فشل إرسال الرسالة", variant: "destructive" }),
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    sendMessage({ conversationId: id, data: { message: msg.trim() } });
  };

  return (
    <ArtisanLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <h1 className="text-xl font-bold mb-4">المحادثة</h1>
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2">
          {isLoading && <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>}
          {messages?.map(m => {
            const isMe = m.senderId === user?.id;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  <p>{m.message}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(m.createdAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <Input placeholder="اكتب رسالتك..." value={msg} onChange={e => setMsg(e.target.value)} className="flex-1" />
          <Button type="submit" size="icon" disabled={isPending || !msg.trim()}><Send size={18} /></Button>
        </form>
      </div>
    </ArtisanLayout>
  );
}
