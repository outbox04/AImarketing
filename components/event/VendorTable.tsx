import { Card } from "@/components/ui/Card";

const vendors = [
  { name: "AV Partner", scope: "Âm thanh ánh sáng", status: "Chờ báo giá" },
  { name: "Studio One", scope: "Quay dựng recap", status: "Đã nhận brief" },
  { name: "Print Hub", scope: "Backdrop, standee", status: "Cần duyệt file" }
];

export function VendorTable() {
  return (
    <Card>
      <h2 className="text-lg font-bold text-text-main">Vendor/bên thứ 3</h2>
      <div className="mt-4 space-y-3">
        {vendors.map((vendor) => (
          <div key={vendor.name} className="grid gap-2 rounded-2xl border border-border p-3 text-sm md:grid-cols-3">
            <p className="font-bold text-text-main">{vendor.name}</p>
            <p className="text-text-muted">{vendor.scope}</p>
            <p className="font-semibold text-primary">{vendor.status}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
