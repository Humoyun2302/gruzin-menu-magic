import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GruzinLogo } from "@/components/menu/GruzinLogo";
import { signInAdmin } from "@/lib/adminAuth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "GRUZIN — Admin Login" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const login = email.trim();

    if (!login || !password) {
      toast.error("Введите логин и пароль");
      return;
    }

    setLoading(true);
    try {
      await signInAdmin(login, password);
      toast.success("Добро пожаловать");
      void navigate({ to: "/admin", replace: true });
    } catch {
      toast.error("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--cream-deep)]/35 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col items-center text-center">
          <GruzinLogo small />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Админ-панель
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Вход</h1>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <div className="grid gap-2">
            <Label htmlFor="admin-email">Логин / email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-9"
                placeholder="admin@gruzin.uz"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="admin-password">Пароль</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Проверяем..." : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
