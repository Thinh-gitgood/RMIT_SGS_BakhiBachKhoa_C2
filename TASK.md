# 🚀 TASK.md — Tổng Chỉ Huy Phân Công 4 Thành Viên (Zero-Conflict Master Plan)

**Dự án:** **ScholarLock — Zero-Trust Capstone & Co-Research IP Vault**  
**Cuộc thi:** RMIT Industry Challenge: Unlocked (Tide / RMIT University)  
**Công nghệ lõi:** **TideCloak (`@tidecloak/react`)** & **Emergent Authority (3-of-3 Threshold Shards)**

---

## ⚡ Cách Chạy Nhanh Cho Từng Thành Viên (1-Click AI Agent Execution)

Mỗi thành viên đã có **1 file nhiệm vụ riêng biệt** trong thư mục `tasks/` với **ranh giới file độc quyền 100% (kể cả `style.css`)** để cả 4 người cùng chạy AI Agent và push code lên Git mà **không bao giờ bị Merge Conflict**:

| Thành viên | File Nhiệm Vụ Chi Tiết | File Code Độc Quyền Được Sửa | Lệnh Gõ Vào AI Agent Của Bạn |
| :--- | :--- | :--- | :--- |
| 🧭 **Cường Thịnh** | [`tasks/TASK_CUONG_THINH.md`](tasks/TASK_CUONG_THINH.md) | `src/App.jsx`<br>`src/seed.json`<br>`src/style.css` | `Hãy đọc file tasks/TASK_CUONG_THINH.md và thực thi toàn bộ nhiệm vụ được giao trong đó (sử dụng các skill được gợi ý).` |
| 👩‍🔬 **Khánh Linh** | [`tasks/TASK_KHANH_LINH.md`](tasks/TASK_KHANH_LINH.md) | `src/components/CoAuthorVaultView.jsx` | `Hãy đọc file tasks/TASK_KHANH_LINH.md và thực thi toàn bộ nhiệm vụ được giao trong đó (sử dụng các skill được gợi ý).` |
| 👨‍💻 **Trung Quân** | [`tasks/TASK_TRUNG_QUAN.md`](tasks/TASK_TRUNG_QUAN.md) | `src/components/QuorumDisputeView.jsx` | `Hãy đọc file tasks/TASK_TRUNG_QUAN.md và thực thi toàn bộ nhiệm vụ được giao trong đó (sử dụng các skill được gợi ý).` |
| 🚨 **Nhật Tân (PM)** | [`tasks/TASK_NHAT_TAN.md`](tasks/TASK_NHAT_TAN.md) | `src/components/RogueAttackView.jsx`<br>`src/components/BlindServerView.jsx`<br>`docs/pitch_slides.html` | `Hãy đọc file tasks/TASK_NHAT_TAN.md và thực thi toàn bộ nhiệm vụ được giao trong đó (sử dụng các skill được gợi ý).` |

---

## 🎙️ Kịch Bản Quay Video 2 Phút (120 Giây) Chuẩn Từng Khung Hình & Lời Thoại Tiếng Anh

> **💡 Mẹo quay mượt nhất:**  
> - Bấm phím **`1` – `5`** (do Cường Thịnh tích hợp) hoặc click lên thanh **ACTIVE ACCOUNT** trên cùng để chuyển góc nhìn tức thì.  
> - Mở `docs/pitch_slides.html` (do Nhật Tân tạo) ở Tab trình duyệt thứ 1 để quay 15s đầu và 15s cuối; mở `http://localhost:5173` ở Tab trình duyệt thứ 2 (Zoom `110%`–`125%`, Fullscreen `F11`) để quay phần tương tác.

### ⏱️ Scene 1 (0:00 – 0:20) | The Problem: Insider Theft & Co-Author Hostage
- **🖥️ Trên màn hình:** Mở Slide 1 của `docs/pitch_slides.html` (0:00–0:10), sau đó chuyển sang giao diện **ScholarLock** đang ở tài khoản **Khánh Linh (`[1]`)**, bấm `👁️ Preview` trên file `brain_cancer_model.pth` để cho thấy Lớp 1 (Working Preview) mở được nhưng Lớp 2 (Full Export) bị khóa bởi `3/3 Quorum`.
- **🎙️ Voiceover (English — 20s):**
  > *"University research teams face a critical security paradox. Meet our RMIT Capstone team: **Khánh Linh**, **Trung Quân**, and **Nhật Tân**, building a 96.4% accuracy brain cancer AI model. How do they collaborate daily without letting a rogue member steal the model weights—or hold the entire team hostage by refusing to sign off? And how do we ensure even **RMIT IT Admins** cannot peek at unpublished breakthroughs? Welcome to **ScholarLock**, powered by **TideCloak**."*

### ⏱️ Scene 2 (0:20 – 0:50) | Flow 1 & Flow 2: Rogue Insider & Blind Server Blocked
- **🖥️ Trên màn hình:**
  - `0:20–0:35`: Bấm sang tài khoản **🚨 Nhật Tân (`[3]`)**, click nút đỏ **"🚨 ⬇️ Export Full IP Bundle (Unilateral)"** $\rightarrow$ Cảnh báo đỏ **`403 UNILATERAL_EXFILTRATION_BLOCKED`** bung ra kèm bảng `1/3 vs 3/3 Shards` và ghi vào **Immutable Audit Log**.
  - `0:35–0:50`: Bấm sang tài khoản **🖥️ RMIT IT Admin (`[5]`)**, chuyển qua lại giữa `PostgreSQL Table View` và `Raw S3 Ciphertext Dump`, rồi bấm **"⛔ Force Decrypt / Export DB"** $\rightarrow$ Hiện cảnh báo **`403 ZERO_CUSTODY_ENFORCED`**.
- **🎙️ Voiceover (English — 30s):**
  > *"First, suppose co-author **Nhật Tân** goes rogue and tries to export the full AI weights and patient dataset to sell to an outside company. When he clicks export, **TideCloak** blocks him instantly with **403 Unilateral Exfiltration Blocked**. Why? Because no single user holds a master key—Nhật Tân holds only **one of three** required authority shards, and his breach attempt is cryptographically sealed into the **Immutable Audit Log**.*  
  > *Even if we switch to the **RMIT IT Admin Database view**, the server stores pure **AES-256-GCM ciphertext**. An Admin Override fails with **Zero Custody Enforced**—because the server holds **zero shards**."*

### ⏱️ Scene 3 (0:50 – 1:35) | Flow 3: Emergent Authority 3/3 Quorum & Dispute Arbitration
- **🖥️ Trên màn hình:**
  - `0:50–1:15`: Quay lại màn hình chính, ở cột phải **🔐 3-of-3 Release Quorum**, bấm lần lượt:
    1. **Slot 1 (Khánh Linh):** `✍️ Sign Approval (1/3)` $\rightarrow$ Lên `1/3`.
    2. **Slot 2 (Trung Quân):** `✍️ Sign Approval (2/3)` $\rightarrow$ Lên `2/3`.
  - `1:15–1:35`: Chỉ vào **Slot 3 (Dr. Cường Thịnh)** vừa được mở khóa nhờ bằng chứng vi phạm `403` của Nhật Tân, bấm **`⚖️ Revoke Nhật Tân & Sign (3/3)`** $\rightarrow$ Đạt **`3/3 Unlocked`**!
  - Bấm **`⬇️ Download Certificate (.json)`** trên chứng chỉ `CERT-TIDE-RMIT-2026-303` và bấm **`⬇️ Export Full IP Bundle (3/3 Unlocked)`** ở cột trái để trình duyệt tải file giải mã thật về máy!
- **🎙️ Voiceover (English — 45s):**
  > *"Now, Nhật Tân abandons the team. Normally, a strict 3-of-3 multi-sig would permanently deadlock Khánh Linh and Trung Quân from publishing to IEEE. Here is how **Emergent Authority** solves both security and deadlock:*  
  > *In the **Quorum Panel**, **Khánh Linh** signs Shard 1 of 3. **Trung Quân** signs Shard 2 of 3. At 2 of 3, the vault remains cryptographically locked.*  
  > *Because the **Immutable Audit Log** proved Nhật Tân's misconduct, Academic Ethics Chair **Dr. Cường Thịnh**’s dormant arbitration shard unlocks—allowing him to revoke Nhật Tân and co-sign **Shard 3 of 3**.*  
  > *The moment all **3 of 3 shards align**, decryption authority **emerges transiently right inside the browser** via TideCloak's `doDecrypt`. All three IP assets unlock for download, minting a **Verified IP Release Certificate**."*

### ⏱️ Scene 4 (1:35 – 2:00) | Why TideCloak Matters & Real-World Impact
- **🖥️ Trên màn hình:** Bấm nút `⬇️ Export Audit Ledger (.json)` ở bảng Audit Log cuối trang, sau đó chuyển sang Slide 3 của `docs/pitch_slides.html` (1:45–2:00).
- **🎙️ Voiceover (English — 25s):**
  > *"If ScholarLock used traditional OAuth, JWTs, or backend RBAC, a database admin or a compromised server could still silently dump every file. With **TideCloak**, master decryption authority **does not exist at rest**—neither in the database nor in any admin account. It emerges only when legitimate human governance aligns. **ScholarLock**: Provable Zero-Trust IP Protection for the next generation of research."*

---

## 🛡️ Quy Tắc Git Chung Cho Cả 4 Thành Viên

```bash
git status
# 1. Chỉ git add đúng file thuộc quyền sở hữu trong bảng phân công của mình!
git add <file-của-bạn>
git commit -m "feat(<role>): <mô-tả-ngắn>"
git pull --rebase origin main
npm run build
git push origin main
```
