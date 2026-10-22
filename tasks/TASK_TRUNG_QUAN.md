# ⚡ TASK_TRUNG_QUAN.md — Nhiệm Vụ Của Trung Quân (3-of-3 Quorum Assembler, Dormant Arbitration & Release Certificate)

> ### 🤖 LỆNH CHẠY AGENT TỰ ĐỘNG (Chỉ cần Copy & Paste đúng 1 câu này vào AI Agent của bạn):
> ```text
> Hãy đọc file tasks/TASK_TRUNG_QUAN.md và thực thi toàn bộ nhiệm vụ được giao trong đó (sử dụng các skill được gợi ý).
> ```

---

## 🔒 1. Ranh Giới File Độc Quyền (Zero-Conflict Boundary)

- **Người phụ trách:** **Trung Quân** (Cột Phải: `🔐 3-of-3 Release Quorum`, Cơ chế Phân xử Đạo đức Chống Thông đồng & Chứng chỉ Bản quyền Số)
- **File ĐƯỢC PHÉP sửa (Độc quyền 100%):**
  1. `src/components/QuorumDisputeView.jsx`
- **File TUYỆT ĐỐI KHÔNG ĐỤNG VÀO (Để tránh Git Conflict với 3 bạn còn lại):**
  - ❌ Không sửa `src/App.jsx`, `src/seed.json`, `src/style.css` (của Cường Thịnh)
  - ❌ Không sửa `src/components/CoAuthorVaultView.jsx` (của Khánh Linh)
  - ❌ Không sửa `src/components/RogueAttackView.jsx` và `src/components/BlindServerView.jsx` (của Nhật Tân)
  - 💡 **Lưu ý về Style:** Hãy tận dụng các class CSS đã có sẵn trong `src/style.css` kết hợp với `style={{ ... }}` (inline style gọn sạch) ngay trong `src/components/QuorumDisputeView.jsx` để **không cần đụng vào `src/style.css`**!

---

## 🔌 2. Hợp Đồng Props (Props Contract) Cần Giữ Nguyên Trong `src/components/QuorumDisputeView.jsx`

**Props nhận vào từ `src/App.jsx` (BẮT BUỘC giữ nguyên):**
```jsx
export default function QuorumDisputeView({
  coAuthors,
  arbitrator,
  activeUser,
  signedShards,
  rogueBreachLogged,
  onSignShard,
  certificateTimestamp,
})
```
- `onSignShard("linh")`, `onSignShard("quan")`, `onSignShard("thinh")` phải được giữ nguyên cách gọi.

---

## 🛠️ 3. Chi Tiết Tính Năng Cần Code / Nâng Cấp Trong `src/components/QuorumDisputeView.jsx`

### ✨ Tính năng 1: Sơ Đồ Ghép Mảnh Khóa Trực Quan (`3-Shard Cryptographic Key Combiner`)
- Ngay dưới thanh tiến trình `Threshold Key Assembly: X of 3 Shards`, thêm một sơ đồ trực quan gồm **3 ô mảnh khóa toán học (`Shard #1`, `Shard #2`, `Shard #3`)** nối vào **1 ô khóa tổng hợp (`Ephemeral AES-256-GCM Key`)**:
  - **Ô 1 (`Khánh Linh · Shard 1/3`):** Khi `signedShards.linh === true`, sáng màu xanh ngọc lục bảo kèm mảnh khóa `0x94a8...309d`.
  - **Ô 2 (`Trung Quân · Shard 2/3`):** Khi `signedShards.quan === true`, sáng màu xanh ngọc lục bảo kèm mảnh khóa `0x3c7d...614e`.
  - **Ô 3 (`Arbitration / Co-Author Shard 3/3`):**
    - Khi chưa có vi phạm (`!rogueBreachLogged`): Hiển thị `⚠️ Nhật Tân Holding Out (Deadlock Risk)`.
    - Khi có vi phạm (`rogueBreachLogged && !signedShards.thinh`): Hiển thị `⚡ Arbitration Slot Ready (Dr. Thịnh)`.
    - Khi `signedShards.thinh === true`: Sáng màu xanh ngọc lục bảo kèm mảnh khóa `0x7f12...883b`.
  - **Ô Kết Quả (`In-Browser Key Assembly`):** Khi `isMasterUnlocked === true` (`3/3`), hiển thị hiệu ứng nổi bật: `⚡ EPHEMERAL KEY RECONSTRUCTED IN RAM (Zero Server Custody)`.

### ✨ Tính năng 2: Làm Nổi Bật "3 Cryptographic Guardrails" Ở Slot 3 Của Dr. Cường Thịnh
- Giám khảo rất quan tâm câu hỏi: *"Làm sao ngăn 2 sinh viên thông đồng với giảng viên để cướp công của thành viên thứ 3?"*.
- Trong thẻ **Slot 3 (Dr. Cường Thịnh)**, hiển thị một bảng/danh sách nhỏ gọn gồm **3 Guardrails mật mã**:
  1. `🛡️ Guardrail 1 — 1/3 Shard Only`: Advisor không giữ Master Key và không đọc được Working Preview của sinh viên.
  2. `🔒 Guardrail 2 — Anti-Collusion Dormant Lock`: Khóa cứng (`DORMANT`) khi chưa có bằng chứng vi phạm `403` bất biến trong Audit Log.
  3. `📜 Guardrail 3 — Public Accountability`: Quyết định thu hồi Shard của Nhật Tân được đóng dấu vĩnh viễn vào Chứng chỉ xuất bản.

### ✨ Tính năng 3: Nâng Cấp Thẻ Chứng Chỉ `CERT-TIDE-RMIT-2026-303` + Nút Tải Chứng Chỉ (`.json`)
- Khi `isMasterUnlocked === true` (`3/3 Shards`), nâng cấp khung **TideCloak Sovereign Release Certificate (`CERT-TIDE-RMIT-2026-303`)**:
  - Hiển thị đầy đủ bảng 3 chữ ký số `Ed25519` của **Khánh Linh**, **Trung Quân**, và **Dr. Cường Thịnh** + trạng thái `REVOKED: Nhật Tân (Reason: HTTP 403 Unilateral Exfiltration Attempt)`.
  - Thêm2 nút bấm hoạt động thật ngay trên chứng chỉ:
    1. **`⬇️ Download Certificate (.json)`**: Kích hoạt tải file `CERT-TIDE-RMIT-2026-303.json` thật về trình duyệt (dùng `Blob` + `URL.createObjectURL`).
    2. **`📋 Copy Verification Hash`**: Copy chuỗi chứng chỉ đã ký vào clipboard và đổi nhãn nút thành `✓ Copied Hash!` trong 2 giây.

---

## 🧰 4. Skills Khuyên Dùng & Prompt Đầy Đủ Cho AI Agent

- **Skills:** `ui-ux-pro-max`, `ui-styling`, `ponytail`, `ponytail-review`
- **Prompt chi tiết (nếu muốn copy trực tiếp):**
  ```text
  Sử dụng skill ui-ux-pro-max, ui-styling, ponytail và ponytail-review:
  Hãy đọc file tasks/TASK_TRUNG_QUAN.md và nâng cấp DUY NHẤT file src/components/QuorumDisputeView.jsx (tuyệt đối không sửa src/App.jsx, src/style.css hay bất kỳ file nào khác).
  1. Giữ nguyên 100% danh sách props nhận vào của QuorumDisputeView và các lệnh gọi onSignShard("linh" | "quan" | "thinh").
  2. Thêm sơ đồ trực quan 3-Shard Cryptographic Key Combiner (Shard 1/3 + Shard 2/3 + Shard 3/3 -> Ephemeral AES-256-GCM Key in Browser RAM).
  3. Trong Slot 3 của Dr. Cường Thịnh, hiển thị rõ 3 Cryptographic Guardrails (Anti-Collusion Dormant Policy, 1/3 Shard Only, Public Accountability) để chứng minh giảng viên không thể tự ý mở khóa hay thông đồng loại sinh viên vô tội khi chưa có log vi phạm 403.
  4. Khi đạt 3/3 Shards (isMasterUnlocked === true), nâng cấp thẻ chứng chỉ CERT-TIDE-RMIT-2026-303 kèm nút "⬇️ Download Certificate (.json)" (tải file JSON thật về trình duyệt) và nút "📋 Copy Verification Hash".
  5. Dùng các class có sẵn kết hợp inline styles gọn sạch để không đụng vào src/style.css. Chạy npm run build để đảm bảo không có lỗi.
  ```

---

## 🚀 5. Quy Trình Git Push Không Xung Đột (Zero-Conflict Git Commands)

Sau khi AI Agent báo `npm run build` thành công, Trung Quân chạy đúng các lệnh sau:

```bash
git status
# Đảm bảo CHỈ CÓ duy nhất file src/components/QuorumDisputeView.jsx thay đổi!
git add src/components/QuorumDisputeView.jsx
git commit -m "feat(quorum): add visual 3-shard combiner, anti-collusion guardrails & downloadable release certificate"
git pull --rebase origin main
npm run build
git push origin main
```
