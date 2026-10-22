# 🚨 TASK_NHAT_TAN.md — Nhiệm Vụ Của Nhật Tân (PM, 403 Rogue Exfiltration Alert, Blind Server Inspector & 2-Min Pitch Slides/Video)

> ### 🤖 LỆNH CHẠY AGENT TỰ ĐỘNG (Chỉ cần Copy & Paste đúng 1 câu này vào AI Agent của bạn):
> ```text
> Hãy đọc file tasks/TASK_NHAT_TAN.md và thực thi toàn bộ nhiệm vụ được giao trong đó (sử dụng các skill được gợi ý).
> ```

---

## 🔒 1. Ranh Giới File Độc Quyền (Zero-Conflict Boundary)

- **Người phụ trách:** **Nhật Tân** (PM / Gatekeeper, Màn hình chặn Kẻ phản bội `403`, Góc nhìn Máy chủ Mù của RMIT IT Admin & Slide mở đầu/kết thúc cho Video 2 phút)
- **File ĐƯỢC PHÉP sửa / tạo mới (Độc quyền 100%):**
  1. `src/components/RogueAttackView.jsx`
  2. `src/components/BlindServerView.jsx`
  3. `docs/pitch_slides.html` *(File HTML slide thuyết trình độc lập phục vụ quay 15s đầu & 15s cuối video)*
- **File TUYỆT ĐỐI KHÔNG ĐỤNG VÀO (Để tránh Git Conflict với 3 bạn còn lại):**
  - ❌ Không sửa `src/App.jsx`, `src/seed.json`, `src/style.css` (của Cường Thịnh)
  - ❌ Không sửa `src/components/CoAuthorVaultView.jsx` (của Khánh Linh)
  - ❌ Không sửa `src/components/QuorumDisputeView.jsx` (của Trung Quân)
  - 💡 **Lưu ý về Style:** Trong `RogueAttackView.jsx` và `BlindServerView.jsx`, hãy tận dụng các class CSS đã có sẵn trong `src/style.css` kết hợp với `style={{ ... }}` (inline style gọn sạch) để **không cần đụng vào `src/style.css`**!

---

## 🔌 2. Hợp Đồng Props (Props Contract) Cần Giữ Nguyên

1. **Trong `src/components/RogueAttackView.jsx` (được gọi từ `CoAuthorVaultView.jsx`):**
   ```jsx
   export default function RogueAttackView({
     exportBlockModal,
     rogueAttemptCount,
     onCloseModal,
   })
   ```
   *(Khi `!exportBlockModal`, return `null` như hiện tại).*

2. **Trong `src/components/BlindServerView.jsx` (được gọi từ `src/App.jsx`):**
   ```jsx
   export default function BlindServerView({
     adminActor,
     assets,
     adminOverrideBlocked,
     adminAttemptCount,
     onTriggerAdminOverride,
     onReturnToVault,
   })
   ```

---

## 🛠️ 3. Chi Tiết Tính Năng Cần Code / Nâng Cấp

### ✨ Nhiệm vụ 1: Nâng cấp `src/components/RogueAttackView.jsx` (`403 UNILATERAL_EXFILTRATION_BLOCKED`)
- Khi Nhật Tân bấm xuất trộm tài sản IP và hộp cảnh báo đỏ `.crypto-block-alert` hiện ra:
  1. **Thêm thanh so sánh trực quan `Threshold Verification Matrix`:**
     - `Presented Authority`: **`🔑 1 / 3 Shards (Nhật Tân — Co-Author Shard #3)`** (Màu đỏ `INSUFFICIENT`)
     - `Required Authority`: **`🔐 3 / 3 Shards (3-of-3 Threshold DKG Quorum)`**
     - `Master Key at Rest`: **`🚫 NONE (Zero-Knowledge Enclave)`**
  2. **Nút `📋 Copy Signed 403 Evidence JSON`:** Cho phép copy biên bản lỗi `403 UNILATERAL_EXFILTRATION_BLOCKED` kèm timestamp và đổi chữ thành `✓ Copied Breach Proof!`.
  3. **Hộp chỉ dẫn sang Bước Tiếp Theo (`Next Step Callout`):** Làm nổi bật dòng chỉ dẫn: *"👉 Bằng chứng vi phạm đã mở khóa **Slot 3 (Dr. Cường Thịnh)** ở cột **3-of-3 Release Quorum** bên phải!"*.

### ✨ Nhiệm vụ 2: Nâng cấp `src/components/BlindServerView.jsx` (`RMIT IT Admin` & `403 ZERO_CUSTODY_ENFORCED`)
- Giúp giám khảo nhìn vào **3 giây** là hiểu ngay sự khác biệt giữa **TideCloak Blind Storage** và hệ thống OAuth/RBAC truyền thống:
  1. **Thêm nút chuyển đổi chế độ xem trên thanh Terminal (`SQL Table View` vs `Raw S3 Ciphertext Dump`):**
     - Chế độ 1 (`🗄️ PostgreSQL Table View`): Bảng 5 cột hiển thị `OBJECT ID`, `FILE NAME`, `TIDECLOAK TAG`, `RAW DATABASE PAYLOAD (100% BLIND CIPHERTEXT)` và badge `🔒 0% · BLIND`.
     - Chế độ 2 (`📦 Raw S3 / KMS Hex & JSON Dump`): Hiển thị cấu trúc JSON thô của bucket S3 (`s3://rmit-scholarlock-vault/blobs/...`) chứng minh `server_master_key: null`, `admin_shards: 0`, và dữ liệu chỉ là các khối `TIDE_E2EE_V1` mã hóa `AES-256-GCM`.
  2. **Thêm bảng đối chiếu nhanh (`Traditional RBAC DB vs. ScholarLock TideCloak Vault`):**
     - `Traditional OAuth / RBAC`: Admin hoặc hacker chiếm DB có thể `SELECT *` hoặc lấy KMS Master Key giải mã toàn bộ file.
     - `ScholarLock (TideCloak)`: Server giữ **`0/3 Shards`** — ngay cả lệnh `⛔ Force Decrypt / Export DB` của Root Admin cũng bị chặn bởi toán học mật mã (`403 ZERO_CUSTODY_ENFORCED`).

### ✨ Nhiệm vụ 3: Tạo Slide Thuyết Trình Độc Lập `docs/pitch_slides.html` (Phục vụ 15s Mở đầu & 15s Kết thúc Video 2 Phút)
- Tạo file `docs/pitch_slides.html` tự chứa (self-contained HTML/CSS/JS, chuyển slide bằng phím mũi tên `←` / `→` hoặc click chuột, thiết kế chuẩn **1920x1080 High-Contrast Cybersecurity & Academic Emerald**):
  - **Slide 1 (0:00 – 0:15 của Video) — The Academic IP Paradox at RMIT:**
    - Giới thiệu 3 tài sản IP giá trị cao (`IEEE ViT-MRI Paper`, `96.4% Brain Cancer AI Weights`, `1,200 Patient Clinical Cohort`) và 4 nhân vật (**Khánh Linh**, **Trung Quân**, kẻ phản bội **Nhật Tân**, cố vấn đạo đức **Dr. Cường Thịnh**).
    - Nêu bật 2 rủi ro chí mạng: **Insider Exfiltration (Ăn cắp bán trộm)** & **3/3 Co-Author Hostage Deadlock (Kẹt đồ án khi 1 thành viên làm phản)**.
  - **Slide 2 — ScholarLock’s Two-Tier Emergent Authority Architecture:**
    - Sơ đồ kiến trúc 2 lớp với **TideCloak**: Lớp 1 (`Tag-based Daily Preview`), Lớp 2 (`3-of-3 Ephemeral Browser Decryption`), kèm **Breach-Gated Ethics Arbitration** (chỉ mở khóa phân xử khi có bằng chứng vi phạm `403` bất biến).
  - **Slide 3 (1:40 – 2:00 của Video) — Why TideCloak Changes What the App Can Trustworthy Do:**
    - Bảng so sánh trực diện giữa **Standard OAuth/RBAC Backend** (Admin/Server vẫn đọc trộm được) vs **ScholarLock + TideCloak** (*"No Master Key at Rest. Decryption authority emerges transiently in the browser only when legitimate 3-of-3 human governance aligns."*).

---

## 🧰 4. Skills Khuyên Dùng & Prompt Đầy Đủ Cho AI Agent

- **Skills:** `ui-ux-pro-max`, `ui-styling`, `slides`, `ponytail`
- **Prompt chi tiết (nếu muốn copy trực tiếp):**
  ```text
  Sử dụng skill ui-ux-pro-max, ui-styling, slides và ponytail:
  Hãy đọc file tasks/TASK_NHAT_TAN.md và thực hiện nâng cấp CHỈ 3 file: src/components/RogueAttackView.jsx, src/components/BlindServerView.jsx, và tạo mới docs/pitch_slides.html (tuyệt đối không sửa src/App.jsx, src/style.css hay các component khác).
  1. Trong src/components/RogueAttackView.jsx: Giữ nguyên props (exportBlockModal, rogueAttemptCount, onCloseModal). Thêm bảng Threshold Verification Matrix (Presented: 1/3 Shards vs Required: 3/3 Shards | Master Key: None) và nút Copy Signed 403 Evidence JSON.
  2. Trong src/components/BlindServerView.jsx: Giữ nguyên props hiện tại. Thêm nút chuyển đổi giữa "PostgreSQL Table View" và "Raw S3 Ciphertext Dump", cùng dải so sánh "Why Standard RBAC Fails vs TideCloak Zero Server Custody".
  3. Tạo mới file docs/pitch_slides.html: Bộ 3 slide HTML trình chiếu toàn màn hình 1920x1080 (chuyển slide bằng phím mũi tên trái/phải) cực kỳ sắc nét để quay 15 giây mở đầu và 15 giây kết thúc cho video demo 2 phút.
  4. Chạy npm run build để đảm bảo không có lỗi build.
  ```

---

## 🚀 5. Quy Trình Git Push Không Xung Đột (Zero-Conflict Git Commands)

Sau khi AI Agent báo `npm run build` thành công, Nhật Tân chạy đúng các lệnh sau:

```bash
git status
# Đảm bảo CHỈ CÓ src/components/RogueAttackView.jsx, src/components/BlindServerView.jsx và docs/pitch_slides.html thay đổi!
git add src/components/RogueAttackView.jsx src/components/BlindServerView.jsx docs/pitch_slides.html
git commit -m "feat(security-demo): upgrade 403 exfiltration proof, S3 blind DB inspector & 1080p pitch slides"
git pull --rebase origin main
npm run build
git push origin main
```
