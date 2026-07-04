"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { LockKeyhole, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const demoAccounts = [
  { code: "BLD001", label: "Ban lãnh đạo" },
  { code: "TP001", label: "Trưởng phòng" },
  { code: "MKT001", label: "Marketing" },
  { code: "SALE001", label: "Sale" }
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = useMemo(() => searchParams.get("next") || "/dashboard", [searchParams]);
  const [employeeCode, setEmployeeCode] = useState("BLD001");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ employeeCode, password })
      });
      const result = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setMessage(result.message ?? "Không thể đăng nhập.");
        return;
      }

      router.replace(nextUrl);
      router.refresh();
    } catch {
      setMessage("Không thể kết nối hệ thống đăng nhập.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-card border border-border bg-white p-6 shadow-soft">
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary">Marketing AI</p>
        <h1 className="mt-1 text-2xl font-bold text-text-main">Đăng nhập</h1>
        <p className="mt-2 text-sm leading-6 text-text-muted">Chọn đúng cấp quyền để dashboard hiển thị dữ liệu theo vai trò và phòng ban.</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {demoAccounts.map((account) => (
          <button
            key={account.code}
            type="button"
            className={`rounded-xl border px-3 py-2 text-left text-xs font-bold transition-colors ${
              employeeCode === account.code ? "border-primary bg-primary-soft text-primary" : "border-border bg-white text-text-muted hover:bg-surface-soft"
            }`}
            onClick={() => {
              setEmployeeCode(account.code);
              setPassword("123456");
            }}
          >
            <span className="block">{account.label}</span>
            <span className="text-[11px] font-semibold opacity-75">{account.code}</span>
          </button>
        ))}
      </div>

      <label className="mb-2 block text-sm font-semibold text-text-main">Mã nhân viên</label>
      <div className="relative mb-4">
        <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={17} />
        <Input className="pl-10" value={employeeCode} onChange={(event) => setEmployeeCode(event.target.value)} />
      </div>

      <label className="mb-2 block text-sm font-semibold text-text-main">Mật khẩu</label>
      <div className="relative mb-5">
        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={17} />
        <Input className="pl-10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>

      <Button className="w-full" variant="primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      {message ? <p className="mt-4 rounded-xl bg-danger-soft px-3 py-2 text-sm font-semibold text-red-700">{message}</p> : null}
    </form>
  );
}
