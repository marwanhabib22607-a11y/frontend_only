import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAdminListUsers, getAdminListUsersQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Users } from "lucide-react";

function roleBadge(role: string) {
  if (role === "admin") return <Badge className="bg-red-100 text-red-800">مدير</Badge>;
  if (role === "artisan") return <Badge className="bg-purple-100 text-purple-800">حرفي</Badge>;
  return <Badge variant="secondary">عميل</Badge>;
}

export function AdminUsers() {
  const [search, setSearch] = useState("");
  const { data: users, isLoading } = useAdminListUsers({
    query: { queryKey: getAdminListUsersQueryKey() }
  });

  const filtered = users?.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <Input placeholder="بحث بالاسم أو البريد..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-md" />

        {isLoading && <div className="flex items-center justify-center h-64">جاري التحميل...</div>}

        {!isLoading && (!filtered || filtered.length === 0) && (
          <div className="text-center py-16 text-muted-foreground">
            <Users size={64} className="mx-auto mb-4 opacity-20" />
            <p>لا يوجد مستخدمون</p>
          </div>
        )}

        <div className="space-y-2">
          {filtered?.map(user => (
            <Card key={user.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{user.name}</p>
                    {roleBadge(user.role)}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                </div>
                <div className="text-left text-sm text-muted-foreground">
                  <p>{user.city}</p>
                  <p>{new Date(user.createdAt).toLocaleDateString("ar-SA")}</p>
                  <Badge variant={user.isActive ? "default" : "destructive"} className="mt-1">
                    {user.isActive ? "نشط" : "موقوف"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
