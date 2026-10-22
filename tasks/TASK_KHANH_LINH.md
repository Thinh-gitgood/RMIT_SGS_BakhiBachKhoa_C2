# 👩‍🔬 TASK_KHANH_LINH.md — Nhiệm Vụ Của Khánh Linh (Project IP Vault, E2EE Inspector & Real Bundle Download)

> ### 🤖 LỆNH CHẠY AGENT TỰ ĐỘNG (Chỉ cần Copy & Paste đúng 1 câu này vào AI Agent của bạn):
> ```text
> Hãy đọc file tasks/TASK_KHANH_LINH.md và thực thi toàn bộ nhiệm vụ được giao trong đó (sử dụng các skill được gợi ý).
> ```

---

## 🔒 1. Ranh Giới File Độc Quyền (Zero-Conflict Boundary)

- **Người phụ trách:** **Khánh Linh** (Cột Trái: `📁 Project IP Vault`, E2EE Envelope Inspector & Tải Gói Tài Sản Trí Tuệ)
- **File ĐƯỢC PHÉP sửa (Độc quyền 100%):**
  1. `src/components/CoAuthorVaultView.jsx`
- **File TUYỆT ĐỐI KHÔNG ĐỤNG VÀO (Để tránh Git Conflict với 3 bạn còn lại):**
  - ❌ Không sửa `src/App.jsx`, `src/seed.json`, `src/style.css` (của Cường Thịnh)
  - ❌ Không sửa `src/components/QuorumDisputeView.jsx` (của Trung Quân)
  - ❌ Không sửa `src/components/RogueAttackView.jsx` và `src/components/BlindServerView.jsx` (của Nhật Tân)
  - 💡 **Lưu ý về Style:** Hãy tận dụng các class CSS đã có sẵn trong `src/style.css` kết hợp với `style={{ ... }}` (inline style gọn sạch) ngay trong `src/components/CoAuthorVaultView.jsx` để **không cần đụng vào `src/style.css`**!

---

## 🔌 2. Hợp Đồng Props (Props Contract) Cần Giữ Nguyên Trong `src/components/CoAuthorVaultView.jsx`

1. **Props nhận vào từ `src/App.jsx` (BẮT BUỘC giữ nguyên):**
   ```jsx
   export default function CoAuthorVaultView({
     assets,
     activeUser,
     workingPreviewUnlocked,
     onToggleWorkingPreview,
     onAttemptExport,
     quorumCount,
     isMasterUnlocked,
     exportBlockModal,
     rogueAttemptCount,
     onCloseBlockModal,
   })
   ```
2. **Component con `RogueAttackView` bên trong `CoAuthorVaultView.jsx` (BẮT BUỘC giữ nguyên dòng gọi này để hiển thị Popup 403 của Nhật Tân):**
   ```jsx
   <RogueAttackView
     exportBlockModal={exportBlockModal}
     rogueAttemptCount={rogueAttemptCount}
     onCloseModal={onCloseBlockModal}
   />
   ```

---

## 🛠️ 3. Chi Tiết Tính Năng Cần Code / Nâng Cấp Trong `src/components/CoAuthorVaultView.jsx`

### ✨ Tính năng 1: Nâng cấp 3 Thẻ Tài Sản IP Trông Giống Kho GitHub Releases / HuggingFace Thực Tế
- Hiển thị thêm các **Technical Metadata Badges** đặc trưng cho từng file dựa theo `asset.id` hoặc `asset.tag`:
  - 📄 **`research_paper_final.pdf` (`ip-paper`):** Badge `IEEE TMI 2026 Submission` · `LaTeX + 8 Figures` · `SHA-256: 4a8d...e91b`
  - 💻 **`brain_cancer_model.pth` (`ip-weights`):** Badge `3D-ViT Glioma Seg` · `Val Dice: 96.4%` · `400× A100 GPU hrs`
  - 📊 **`confidential_patient_dataset.csv` (`ip-dataset`):** Badge `1,200 Patients × 48 Biomarkers` · `HIPAA / RMIT Ethics #EA-2026`
- Hiển thị rõ kiến trúc bảo mật 2 lớp ngay trên đầu danh sách file:
  - **Tier 1 (Daily Collaboration):** `👁️ Working Metadata Preview` (Mở bằng TideCloak Tag Policy `_tide_<tag>` cho đồng tác giả, nhưng bị chặn với Advisor).
  - **Tier 2 (Commercial / IEEE Release):** `🔓 Full Master Plaintext & Raw Weights` (Khóa cứng bằng `3-of-3 Threshold Shards`).

### ✨ Tính năng 2: Bộ Chuyển Đổi Chế Độ Xem Trên Từng File (Envelope Inspector Tabs)
- Trên mỗi thẻ file (`.file-row-card`), cho phép người dùng nhìn rõ sự khác biệt giữa 3 trạng thái dữ liệu:
  1. `🔒 Raw Ciphertext Envelope`: Hiển thị chuỗi mã hóa `TIDE_E2EE_V1[...]` + thông số `AES-256-GCM · IV 96-bit · AuthTag 128-bit`.
  2. `👁️ Tier-1 Working Preview`: Khi bấm nút `👁️ Preview` (gọi `onToggleWorkingPreview(asset)`), hiển thị khung tóm tắt công việc hàng ngày của Co-Author.
  3. `⚡ Tier-2 Master Plaintext`: Khi `isMasterUnlocked === true` (`3/3 Quorum`), làm nổi bật khung dữ liệu gốc đã giải mã kèm badge `✓ DECRYPTED IN BROWSER VIA TIDECLOAK doDecrypt()`.

### ✨ Tính năng 3: Tải Xuống File Thật (`Real Browser Download`) Khi Đạt `3/3 Quorum`
- Viết hàm helper `triggerRealFileDownload(targetFileName)` ngay bên trong `CoAuthorVaultView.jsx`:
  - Khi người dùng bấm **`⬇️ Export Full IP Bundle`** hoặc nút **`⬇️ Export`** của từng file:
    - Luôn gọi `onAttemptExport(targetName)` trước để `App.jsx` ghi nhận vào Audit Log (hoặc bật cảnh báo đỏ `403` nếu chưa đủ `3/3`).
    - **Nếu `isMasterUnlocked === true` (đã đủ `3/3 Shards`):** Ngoài việc gọi `onAttemptExport`, tự động tạo một file JSON/Manifest thật bằng `new Blob([...], { type: "application/json" })` và kích hoạt tải về trình duyệt (ví dụ: `ScholarLock_Verified_IP_Bundle_CERT-303.json` hoặc `<fileName>.unlocked.json`) chứa đầy đủ `unlockedPlaintext`, `cipherSuite`, và `certificateId: "CERT-TIDE-RMIT-2026-303"`! Khi quay video demo, thấy trình duyệt tải file xuống thật sẽ cực kỳ thuyết phục giám khảo!

---

## 🧰 4. Skills Khuyên Dùng & Prompt Đầy Đủ Cho AI Agent

- **Skills:** `ui-ux-pro-max`, `ui-styling`, `ponytail`, `ponytail-review`
- **Prompt chi tiết (nếu muốn copy trực tiếp):**
  ```text
  Sử dụng skill ui-ux-pro-max, ui-styling, ponytail và ponytail-review:
  Hãy đọc file tasks/TASK_KHANH_LINH.md và nâng cấp DUY NHẤT file src/components/CoAuthorVaultView.jsx (tuyệt đối không sửa src/App.jsx, src/style.css hay bất kỳ file nào khác).
  1. Giữ nguyên 100% danh sách props nhận vào của CoAuthorVaultView và giữ nguyên component <RogueAttackView exportBlockModal={exportBlockModal} rogueAttemptCount={rogueAttemptCount} onCloseModal={onCloseBlockModal} />.
  2. Bổ sung các Technical Metadata Badges chuyên ngành AI Y sinh (Val Dice 96.4%, 400 A100 GPU hrs, 1,200 MRI Patients, IEEE LaTeX Manuscript) và thanh giải thích rõ Kiến trúc 2 Lớp (Tier 1: Tag-based Working Preview vs Tier 2: 3-of-3 Quorum Master Plaintext).
  3. Khi isMasterUnlocked === true (đạt 3/3 Shards) và người dùng bấm nút Export (cả nút Export Full IP Bundle lẫn nút Export từng file), ngoài việc gọi onAttemptExport(...), hãy kích hoạt tải xuống một file JSON/Manifest giải mã thật trên trình duyệt (Blob download) để demo lên video thật ấn tượng.
  4. Sử dụng các class có sẵn kết hợp inline styles sạch đẹp để không cần sửa src/style.css. Chạy npm run build để kiểm tra không có lỗi.
  ```

---

## 🚀 5. Quy Trình Git Push Không Xung Đột (Zero-Conflict Git Commands)

Sau khi AI Agent báo `npm run build` thành công, Khánh Linh chạy đúng các lệnh sau:

```bash
git status
# Đảm bảo CHỈ CÓ duy nhất file src/components/CoAuthorVaultView.jsx thay đổi!
git add src/components/CoAuthorVaultView.jsx
git commit -m "feat(vault): add AI/clinical metadata badges, 2-tier E2EE inspector & real bundle download on 3/3 unlock"
git pull --rebase origin main
npm run build
git push origin main
```
