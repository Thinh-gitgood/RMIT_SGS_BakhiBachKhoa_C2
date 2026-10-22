# 🧭 TASK_CUONG_THINH.md — Nhiệm Vụ Của Cường Thịnh (Core Shell, Keyboard Shortcuts & Audit Ledger)

> ### 🤖 LỆNH CHẠY AGENT TỰ ĐỘNG (Chỉ cần Copy & Paste đúng 1 câu này vào AI Agent của bạn):
> ```text
> Hãy đọc file tasks/TASK_CUONG_THINH.md và thực thi toàn bộ nhiệm vụ được giao trong đó (sử dụng các skill được gợi ý).
> ```

---

## 🔒 1. Ranh Giới File Độc Quyền (Zero-Conflict Boundary)

- **Người phụ trách:** **Cường Thịnh** (Core Architecture, TideCloak Enclave Shell & Tamper-Evident Audit Ledger)
- **File ĐƯỢC PHÉP sửa (Độc quyền 100%):**
  1. `src/App.jsx`
  2. `src/seed.json`
  3. `src/style.css`
- **File TUYỆT ĐỐI KHÔNG ĐỤNG VÀO (Để tránh Git Conflict với 3 bạn còn lại):**
  - ❌ Không sửa `src/components/CoAuthorVaultView.jsx` (của Khánh Linh)
  - ❌ Không sửa `src/components/QuorumDisputeView.jsx` (của Trung Quân)
  - ❌ Không sửa `src/components/RogueAttackView.jsx` và `src/components/BlindServerView.jsx` (của Nhật Tân)
  - ❌ Không sửa `package.json` / `package-lock.json`

---

## 🔌 2. Hợp Đồng Props (Props Contract) Cần Giữ Nguyên Trong `src/App.jsx`

Khi nâng cấp `src/App.jsx`, **BẮT BUỘC giữ nguyên tên các props** truyền xuống 3 component con để code của Khánh Linh, Trung Quân và Nhật Tân ghép vào chạy mượt 100%:

```jsx
// 1. Props truyền cho BlindServerView (của Nhật Tân):
<BlindServerView
  adminActor={seed.adminActor}
  assets={seed.assets}
  adminOverrideBlocked={adminOverrideBlocked}
  adminAttemptCount={adminAttemptCount}
  onTriggerAdminOverride={handleTriggerAdminOverride}
  onReturnToVault={() => handleSelectUser("linh")}
/>

// 2. Props truyền cho CoAuthorVaultView (của Khánh Linh):
<CoAuthorVaultView
  assets={seed.assets}
  activeUser={activeUser}
  workingPreviewUnlocked={workingPreviewUnlocked}
  onToggleWorkingPreview={handleToggleWorkingPreview}
  onAttemptExport={handleAttemptExport}
  quorumCount={quorumCount}
  isMasterUnlocked={isMasterUnlocked}
  exportBlockModal={exportBlockModal}
  rogueAttemptCount={rogueAttemptCount}
  onCloseBlockModal={() => setExportBlockModal(null)}
/>

// 3. Props truyền cho QuorumDisputeView (của Trung Quân):
<QuorumDisputeView
  coAuthors={seed.coAuthors}
  arbitrator={seed.arbitrator}
  activeUser={activeUser}
  signedShards={signedShards}
  rogueBreachLogged={rogueBreachLogged}
  onSignShard={handleSignShard}
  certificateTimestamp={certificateTimestamp}
/>
```

---

## 🛠️ 3. Chi Tiết Tính Năng Cần Code / Nâng Cấp

### ✨ Tính năng 1: Phím tắt chuyển nhanh 5 Tài khoản (`Phím 1` $\rightarrow$ `Phím 5`) phục vụ quay Video Demo
- Trong `src/App.jsx`:
  - Thêm `useEffect` lắng nghe sự kiện `keydown` (bỏ qua nếu đang focus vào `INPUT`, `TEXTAREA`, `SELECT`):
    - Bấm phím **`1`** $\rightarrow$ Chuyển sang `linh` (`👩‍🔬 Khánh Linh · Shard 1/3`)
    - Bấm phím **`2`** $\rightarrow$ Chuyển sang `quan` (`👨‍💻 Trung Quân · Shard 2/3`)
    - Bấm phím **`3`** $\rightarrow$ Chuyển sang `tan` (`🚨 Nhật Tân · Rogue 3/3`)
    - Bấm phím **`4`** $\rightarrow$ Chuyển sang `thinh` (`⚖️ Dr. Cường Thịnh · Ethics Advisor`)
    - Bấm phím **`5`** $\rightarrow$ Chuyển sang `sysadmin` (`🖥️ RMIT IT Admin · Server DB`)
  - Trên mỗi nút `.account-pill` trong thanh `ACTIVE ACCOUNT`, hiển thị một badge phím tắt nhỏ gọn (ví dụ `[1]`, `[2]`, `[3]`, `[4]`, `[5]`) để người quay video hoặc giám khảo biết có thể bấm phím số chuyển góc nhìn tức thì.

### ✨ Tính năng 2: Nâng cấp `Immutable Activity & Quorum Audit Log` (SHA-256 Hash + Bộ lọc + Xuất file JSON thật)
- Trong `src/App.jsx` & `src/seed.json`:
  - Tạo hàm tạo mã băm định danh kiểu SHA-256 ngắn gọn, nhất quán (`txHash`, ví dụ: `0x8f3a...91c2`) cho mỗi sự kiện trong `auditLog` (bao gồm cả sự kiện khởi tạo trong `seed.json` và mỗi khi gọi `appendAudit(...)`).
  - Thêm **3 nút lọc nhanh (Filter Pills)** trên thanh tiêu đề của Audit Log:
    - `All Events (N)`
    - `🚨 403 Blocked` (lọc `severity === "danger"`)
    - `⚡ Quorum & Release` (lọc `severity === "quorum" || severity === "emerald"`)
  - Thêm nút **`⬇️ Export Audit Ledger (.json)`** ngay trên header của Audit Log: Khi bấm vào sẽ tải xuống một file thật tên là `ScholarLock_Immutable_Audit_Log.json` (dùng `Blob` + `URL.createObjectURL`) chứa toàn bộ lịch sử kiểm toán kèm chữ ký mật mã.

### ✨ Tính năng 3: Tinh chỉnh CSS trong `src/style.css`
- Bổ sung CSS gọn đẹp cho:
  - Badge phím tắt `.key-hint-badge` trên `.account-pill`
  - Thanh Filter Pills và nút `⬇️ Export Audit Ledger (.json)` của Audit Log
  - Chip hiển thị mã băm `.audit-tx-hash` (`font-family: monospace`) trong từng dòng `.audit-row`
- Giữ nguyên toàn bộ các class CSS hiện có trong `src/style.css` để không làm ảnh hưởng giao diện của 3 thành viên còn lại.

---

## 🧰 4. Skills Khuyên Dùng & Prompt Đầy Đủ Cho AI Agent

- **Skills:** `ponytail`, `ui-styling`, `ponytail-review`
- **Prompt chi tiết (nếu muốn copy trực tiếp):**
  ```text
  Sử dụng skill ponytail, ui-styling và ponytail-review:
  Hãy thực hiện đúng các yêu cầu trong file tasks/TASK_CUONG_THINH.md.
  Chỉ chỉnh sửa 3 file: src/App.jsx, src/seed.json và src/style.css (tuyệt đối không chạm vào bất kỳ file nào trong src/components/).
  1. Giữ nguyên 100% tên các props truyền xuống BlindServerView, CoAuthorVaultView và QuorumDisputeView.
  2. Thêm phím tắt bàn phím 1, 2, 3, 4, 5 để chuyển nhanh giữa 5 tài khoản (linh, quan, tan, thinh, sysadmin) và hiển thị badge [1]..[5] trên thanh Account Switcher.
  3. Nâng cấp khu vực Immutable Activity & Quorum Audit Log ở cuối trang: mỗi dòng log có mã băm SHA-256 (ví dụ 0x8f3a...c91b), có bộ lọc nhanh (All / 403 Blocked / Quorum & Release) và nút "⬇️ Export Audit Ledger (.json)" cho phép tải file JSON thật về máy.
  4. Chạy npm run build để kiểm tra không có bất kỳ lỗi cú pháp nào.
  ```

---

## 🚀 5. Quy Trình Git Push Không Xung Đột (Zero-Conflict Git Commands)

Sau khi AI Agent báo `npm run build` thành công, Cường Thịnh chạy đúng các lệnh sau:

```bash
git status
# Đảm bảo chỉ có src/App.jsx, src/seed.json, src/style.css thay đổi
git add src/App.jsx src/seed.json src/style.css
git commit -m "feat(core): add 1-5 account hotkeys, SHA-256 audit hashes, filter pills & JSON ledger export"
git pull --rebase origin main
npm run build
git push origin main
```
