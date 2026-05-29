# Marketing AI Assistant

Marketing Operations Command Center cho một người đang vận hành toàn bộ phòng Marketing: content, approval, creative, website, event, ads, CRM, reports và AI assistant.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000/dashboard`.

## Environment

Copy `.env.local.example` thành `.env.local` và điền secret thật khi tích hợp backend. Không commit `.env.local`.

Frontend không gọi Google/OpenAI/Telegram/Facebook trực tiếp. Luồng đúng:

```text
Frontend -> /api/* -> Google Sheet / Drive / Calendar / Telegram / OpenAI / Claude / Facebook
```

## Deploy Vercel

1. Push repository lên GitHub.
2. Import project trong Vercel.
3. Khai báo toàn bộ biến trong `.env.local.example` tại Vercel Environment Variables.
4. Deploy bằng build command mặc định `npm run build`.

## Cấu trúc chính

- `app/`: App Router pages và API route placeholders.
- `components/`: layout, UI primitives, dashboard/content/task/event/report components.
- `lib/mock-data.ts`: dữ liệu demo cho frontend phase.
- `lib/*`: connector stubs server-side.
- `types/`: TypeScript domain types.
- `public/media`: placeholder nội bộ, không dùng hotlink ảnh online.

## Bảo mật

- Không hard-code API key trong code.
- Không log token trong API routes.
- Token ở settings luôn được masked.
- Auto posting chỉ được xem là sẵn sàng khi content `status === "APPROVED"`.
- Các hành động xóa hoặc publish thật cần confirmation ở bước tích hợp backend.
