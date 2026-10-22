# 🚀 TASK.md — Kế Hoạch Tác Chiến Ca Chiều (14:15 – 18:00): ScholarLock

**Dự án:** **ScholarLock — Zero-Trust Capstone & Co-Research IP Vault**  
**Cuộc thi:** RMIT Industry Challenge: Unlocked (Tide / RMIT University)  
**Công nghệ lõi:** **TideCloak (`@tidecloak/react`)** & **Emergent Authority (Thẩm quyền phái sinh 3/3 Shards)**  
**PM / Integration / Submission Gatekeeper:** **Cường Thịnh**  
**3 Thành viên thực thi (Ca chiều):** **Khánh Linh**, **Trung Quân**, **Nhật Tân**

---

## 📌 1. Kiến Trúc "Real Working App" (4 Tính Năng Cốt Lõi — Gọn Sạch Như GitHub / Google Drive)

Ứng dụng **ScholarLock** được thiết kế như một **Workspace quản lý File đồ án thực thụ** (không phải slide thuyết trình nhiều chữ), tập trung vào **4 tính năng trực quan trên cùng 1 màn hình**:

1. **Tính năng 1 — Thanh Chuyển Đổi Tài Khoản (`Active Account Switcher`) + `Log in with TideCloak` (`src/App.jsx`):**
   - Cho phép chuyển nhanh giữa 5 tài khoản thực tế:
     - `👩‍🔬 Khánh Linh (AI Lead · 1/3)`
     - `👨‍💻 Trung Quân (Data Eng · 2/3)`
     - `🚨 Nhật Tân (Co-Author · 3/3)`
     - `⚖️ Dr. Cường Thịnh (Ethics Advisor)`
     - `🖥️ RMIT IT Admin (Server DB)`
2. **Tính năng 2 — Kho File Đồ Án (`📁 Project IP Vault`) + Nút `⬇️ Export` Thực Tế (`src/components/CoAuthorVaultView.jsx` & `src/components/RogueAttackView.jsx`):**
   - Cột bên trái hiển thị 3 file đồ án (`research_paper_final.pdf`, `brain_cancer_model.pth`, `confidential_patient_dataset.csv`) cùng nút **`👁️ Preview`** và **`⬇️ Export Full IP Bundle`**.
   - Khi **Nhật Tân** bấm **`⬇️ Export`** lúc chưa đủ 3/3 chữ ký $\rightarrow$ Bị chặn đứng ngay lập tức với Popup **`403 UNILATERAL_EXFILTRATION_BLOCKED`** (`RogueAttackView.jsx`) và tự động ghi bằng chứng vi phạm vào **Activity Log**!
   - Khi chuyển sang **Dr. Cường Thịnh**, ông không thể đọc trộm file của sinh viên (`🔒 Advisor Cannot Read`).
3. **Tính năng 3 — Bảng Chữ Ký Đồng Thuận 3/3 (`🔐 3-of-3 Release Quorum`) & Chứng Chỉ Bản Quyền (`src/components/QuorumDisputeView.jsx`):**
   - Nằm ngay cột bên phải (nhìn thấy đồng thời cả danh sách File và 3 ô ký tên):
     - **Slot 1:** `👩‍🔬 Khánh Linh` — Nút `✍️ Sign Approval (1/3)`
     - **Slot 2:** `👨‍💻 Trung Quân` — Nút `✍️ Sign Approval (2/3)`
     - **Slot 3 (Dynamic Dispute Slot):** Bình thường **Dr. Cường Thịnh** bị khóa cứng (`🔒 Locked — No Breach Logged`) để chống thông đồng. Ngay sau khi Nhật Tân bấm Export bị lỗi `403`, Slot 3 tự động mở khóa nút **`⚖️ Revoke Nhật Tân & Sign (3/3)`**!
   - Khi đủ `3/3`, khóa giải mã tạm thời được ghép ngay trên trình duyệt (`doDecrypt`), cả 3 file bên trái chuyển sang **`🔓 Unlocked (3/3 Verified)`** và cấp **Chứng chỉ `CERT-TIDE-RMIT-2026-303`**!
4. **Tính năng 4 — Giao Diện Database Máy Chủ Mù (`🗄️ Raw Server Database View` — `src/components/BlindServerView.jsx`):**
   - Khi chọn tài khoản **`🖥️ RMIT IT Admin (Server DB)`**, màn hình hiển thị bảng PostgreSQL / S3 Inspector chứng minh cả 3 file dưới server chỉ là chuỗi mã hóa mù `AES-256-GCM (TIDE_E2EE_V1)`. Bấm **`⛔ Force Decrypt / Export DB`** bị chặn ngay với lỗi **`403 ZERO_CUSTODY_ENFORCED`** (`0/3 Shards`).

---

## 📊 Bảng Phân Quyền Sở Hữu File (Zero-Conflict Matrix)

| Thành viên (Gợi ý gán Role) | Role đảm nhận | File ĐƯỢC PHÉP sửa / tạo (Độc quyền 100%) | File CẤM đụng vào |
| :--- | :--- | :--- | :--- |
| **Thành viên 1** *(VD: Nhật Tân)* | **👩‍🎨 ROLE 1 — Red-Team Alert & Server DB UX Engineer** | `src/components/RogueAttackView.jsx`<br>`src/components/BlindServerView.jsx` | `src/App.jsx`, `QuorumDisputeView.jsx`, `CoAuthorVaultView.jsx` |
| **Thành viên 2** *(VD: Khánh Linh)* | **⚡ ROLE 2 — File Vault & 3/3 Quorum Panel UX Engineer** | `src/components/CoAuthorVaultView.jsx`<br>`src/components/QuorumDisputeView.jsx` | `src/App.jsx`, `RogueAttackView.jsx`, `BlindServerView.jsx` |
| **Thành viên 3** *(VD: Trung Quân)* | **🎬 ROLE 3 — Demo Director, Pitch Slides & Video Producer** | `docs/pitch_slides.html` *(tạo mới)*<br>`public/tidecloak.json` *(tùy chọn)*<br>`scholar_lock_demo.mp4` *(file video xuất ra)* | Toàn bộ thư mục `src/` của Role 1 & Role 2 |
| **Leader: Cường Thịnh** | **🧭 PM, Code Reviewer & Final Integrator** | Điều phối merge, kiểm tra `npm run build`, duyệt video & nộp bài | Hỗ trợ gỡ rối khi cần |

---

## 🛠️ 2. Phân Công Chi Tiết 3 Role Độc Lập (Zero Code Conflict)

### 👩‍🎨 ROLE 1 — Red-Team Alert & Server DB UX Engineer
- **File độc quyền:** `src/components/RogueAttackView.jsx` và `src/components/BlindServerView.jsx`.
- **Nhiệm vụ:**
  1. Trong `RogueAttackView.jsx`: Chăm chút khung cảnh báo đỏ `403 UNILATERAL_EXFILTRATION_BLOCKED` hiện ra ngay khi Nhật Tân bấm nút Export trái phép (nổi bật thông số `1 / 3 SHARDS PRESENT` và JSON payload).
  2. Trong `BlindServerView.jsx`: Làm đẹp bảng Terminal Database Inspector của `RMIT IT Admin` và thông báo lỗi `403 ZERO_CUSTODY_ENFORCED` khi bấm nút `⛔ Force Decrypt / Export DB`.

#### 📋 Prompt mẫu Copy-Paste cho Role 1:
```text
Sử dụng skill ui-ux-pro-max, ui-styling và ponytail:
Hãy tinh chỉnh giao diện cho CHỈ 2 file: src/components/RogueAttackView.jsx và src/components/BlindServerView.jsx (không sửa file khác và giữ nguyên toàn bộ props hiện có).
1. Trong RogueAttackView.jsx: Làm cho hộp cảnh báo 403 UNILATERAL_EXFILTRATION_BLOCKED (hiện ra khi Nhật Tân bấm Export trái phép) thật sắc nét, nổi bật rõ "1 / 3 SHARDS PRESENT" và JSON lỗi.
2. Trong BlindServerView.jsx: Làm cho bảng Raw Server Database View của RMIT IT Admin trông như một Cloud DB Inspector thực thụ (hiển thị rõ 100% Blind Ciphertext TIDE_E2EE_V1 và cảnh báo 403 ZERO_CUSTODY_ENFORCED khi bấm Force Decrypt).
Kiểm tra chạy npm run build thành công.
```

---

### ⚡ ROLE 2 — File Vault & 3/3 Quorum Panel UX Engineer
- **File độc quyền:** `src/components/CoAuthorVaultView.jsx` và `src/components/QuorumDisputeView.jsx`.
- **Nhiệm vụ:**
  1. Trong `CoAuthorVaultView.jsx`: Tinh chỉnh danh sách 3 file (`research_paper_final.pdf`, `brain_cancer_model.pth`, `confidential_patient_dataset.csv`), nút `👁️ Preview`, nút `⬇️ Export Full IP Bundle` và hiệu ứng chuyển sang màu xanh `🔓 Unlocked (3/3 Verified)` khi đủ 3/3 chữ ký.
  2. Trong `QuorumDisputeView.jsx`: Tinh chỉnh cột `🔐 3-of-3 Release Quorum` bên phải (thanh tiến trình `0/3 -> 1/3 -> 2/3 -> 3/3`, hiệu ứng Slot 3 chuyển từ `🔒 DORMANT` sang `⚡ UNLOCKED` khi Nhật Tân vi phạm, và thẻ chứng chỉ `CERT-TIDE-RMIT-2026-303`).

#### 📋 Prompt mẫu Copy-Paste cho Role 2:
```text
Sử dụng skill ui-ux-pro-max, ui-styling và ponytail:
Hãy tinh chỉnh giao diện cho CHỈ 2 file: src/components/CoAuthorVaultView.jsx và src/components/QuorumDisputeView.jsx (không sửa file khác và giữ nguyên toàn bộ props hiện có).
1. Trong CoAuthorVaultView.jsx: Làm cho danh sách 3 file đồ án và nút "⬇️ Export Full IP Bundle" trông gọn gàng, hiện đại như GitHub Releases / Google Drive, và sáng bừng màu xanh ngọc khi mở khóa đủ 3/3.
2. Trong QuorumDisputeView.jsx: Làm nổi bật 3 ô ký tên (Slot 1 Khánh Linh, Slot 2 Trung Quân, Slot 3 Dr. Cường Thịnh tự động mở khóa từ trạng thái Dormant sau khi Nhật Tân vi phạm 403) và thẻ chứng chỉ CERT-TIDE-RMIT-2026-303.
Kiểm tra chạy npm run build thành công.
```

---

### 🎬 ROLE 3 — Demo Director, Pitch Slides & Video Producer
- **File độc quyền:** `docs/pitch_slides.html` và video `scholar_lock_demo.mp4` (`< 100MB`, $\le 2$ phút).
- **Nhiệm vụ:**
  1. Tạo `docs/pitch_slides.html` (2-3 slide ngắn gọn cho 15s đầu và 15s cuối video).
  2. Quay màn hình ứng dụng hoạt động thực tế + lồng tiếng Anh theo đúng kịch bản 120 giây bên dưới.

---

## 🎙️ 3. Kịch Bản Quay Video 2 Phút (120 Giây) — Thao Tác Như App Thật 100%

### ⏱️ Phân Cảnh 1 (0:00 – 0:20) | Giới thiệu Workspace & Quyền Xem Hàng Ngày
- **🖥️ Thao tác trên màn hình:**
  - Đang ở tài khoản **`👩‍🔬 Khánh Linh (AI Lead · 1/3)`**.
  - Bấm nhẹ **`👁️ Preview`** ở file `brain_cancer_model.pth` để xem thông số mô hình hàng ngày, trong khi cột bên phải hiện rõ **`0/3 Shards`** (chưa thể xuất file gốc).
- **🎙️ Voiceover (English — 20s):**
  > *"Meet **ScholarLock**, a zero-trust academic IP vault built on **TideCloak**. Co-authors **Khánh Linh**, **Trung Quân**, and **Nhật Tân** are building a 96.4% accuracy brain cancer AI model. In their daily workspace, co-authors can preview working metadata via TideCloak tags—but no single person or server holds a master key to export the raw IP bundle."*

### ⏱️ Phân Cảnh 2 (0:20 – 0:55) | Nhật Tân Bấm Export Bán Trộm & IT Admin Xem DB Mù
- **🖥️ Thao tác trên màn hình:**
  - `0:20–0:38`: Trên thanh tài khoản, bấm chuyển sang **`🚨 Nhật Tân (Co-Author · 3/3)`**. Bấm ngay nút **`🚨 ⬇️ Export Full IP Bundle (Unilateral)`**!
  - Ngay lập tức, khung đỏ **`403 UNILATERAL_EXFILTRATION_BLOCKED`** bung ra (`1/3 Shards Present`), và nhìn sang cột phải: **Slot 3 của Dr. Cường Thịnh** lập tức chuyển từ `🔒 DORMANT` sang **`⚡ UNLOCKED`**!
  - `0:38–0:55`: Bấm chuyển tài khoản sang **`🖥️ RMIT IT Admin (Server DB)`**. Chỉ vào bảng Ciphertext mù và bấm **`⛔ Force Decrypt / Export DB`** $\rightarrow$ Hiện lỗi **`403 ZERO_CUSTODY_ENFORCED`** (`0/3 Shards`).
- **🎙️ Voiceover (English — 35s):**
  > *"Suppose **Nhật Tân** goes rogue and clicks **Export** to steal and sell the AI weights. TideCloak blocks him instantly with **403 Unilateral Exfiltration Blocked** because he holds only **one of three** threshold shards. Crucially, this immutable breach log automatically unlocks Ethics Arbitration in Slot 3.*  
  > *Even if we switch to **RMIT IT Admin**, the database stores pure **AES-256-GCM ciphertext**. Clicking **Force Decrypt** fails with **Zero Custody Enforced**—because the server holds **zero shards**."*

### ⏱️ Phân Cảnh 3 (0:55 – 1:40) | Ký Đủ 3/3 Ngay Trên Cột Phải & Xuất Bản Thành Công
- **🖥️ Thao tác trên màn hình:**
  - Bấm quay lại Vault (`👩‍🔬 Khánh Linh`). Nhìn sang cột phải **`🔐 3-of-3 Release Quorum`**:
    1. Bấm **`✍️ Sign Approval (1/3)`** (Khánh Linh) $\rightarrow$ Thanh tiến trình lên `1/3`.
    2. Bấm **`✍️ Sign Approval (2/3)`** (Trung Quân) $\rightarrow$ Thanh tiến trình lên `2/3`.
    3. Bấm **`⚖️ Revoke Nhật Tân & Sign (3/3)`** (Dr. Cường Thịnh) $\rightarrow$ Thanh tiến trình đạt **`3/3 Unlocked`**!
  - Ngay lập tức, cả 3 file bên trái chuyển sang màu xanh **`🔓 Unlocked (3/3 Verified)`** hiện rõ Plaintext, và chứng chỉ **`CERT-TIDE-RMIT-2026-303`** xuất hiện! Bấm **`⬇️ Export Full IP Bundle (3/3 Unlocked)`**.
- **🎙️ Voiceover (English — 45s):**
  > *"To prevent Nhật Tân from holding the capstone team hostage, **Khánh Linh** signs Slot 1, and **Trung Quân** signs Slot 2. Normally, Advisor **Dr. Cường Thịnh’s** arbitration shard is cryptographically dormant so he cannot collude against an innocent student. But because the Audit Log recorded Nhật Tân’s 403 breach, Dr. Cường Thịnh can now click **Revoke Nhật Tân and Sign Slot 3**.*  
  > *The moment all **3 of 3 shards align**, decryption authority **emerges transiently in the browser** via TideCloak's `doDecrypt`. All three files unlock instantly and mint a **Verified IP Release Certificate**."*

### ⏱️ Phân Cảnh 4 (1:40 – 2:00) | Kết Luận Ngắn Gọn & Đắt Giá
- **🖥️ Thao tác trên màn hình:**
  - Chỉ vào **Chứng chỉ `CERT-TIDE-RMIT-2026-303`** và bảng **Immutable Activity & Quorum Audit Log** ở dưới cùng.
- **🎙️ Voiceover (English — 20s):**
  > *"Unlike standard OAuth or RBAC where a server still holds a master key, **TideCloak** ensures authority never exists at rest—it emerges only when legitimate human consensus aligns. **ScholarLock**: Provable Zero-Trust IP Protection for collaborative research."*
