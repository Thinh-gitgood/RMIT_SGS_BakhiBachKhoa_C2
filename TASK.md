# 🚀 TASK.md — Kế Hoạch Tác Chiến Ca Chiều (13:45 – 18:00): ScholarLock

**Dự án:** **ScholarLock — Zero-Trust Capstone & Co-Research IP Vault**  
**Cuộc thi:** RMIT Industry Challenge: Unlocked (Tide / RMIT University)  
**Công nghệ lõi:** **TideCloak (`@tidecloak/react`)** & **Emergent Authority (Thẩm quyền phái sinh 3/3 Shards)**  
**PM / Integration / Submission Gatekeeper:** **Cường Thịnh**  
**3 Thành viên thực thi (Ca chiều sau giờ ăn trưa):** **Khánh Linh**, **Trung Quân**, **Nhật Tân**

---

## 📌 1. Tổng Quan Hiện Trạng (Cập Nhật 13:45 PM)

1. **Base Prototype `ScholarLock (v1.0)` đã sẵn sàng 100%!**
   - Chạy mượt ngay lập tức bằng `npm install` & `npm run dev` (không lỗi đỏ, có sẵn chế độ Hybrid Live TideCloak + Interactive Cryptographic Simulation phục vụ quay video mượt mà).
2. **Kiến trúc Tách File Độc Lập — Tuyệt Đối KHÔNG Bị Git Merge Conflict:**
   - Toàn bộ giao diện đã được chia nhỏ thành **các file component riêng biệt** trong `src/components/`:
     - `src/components/CoAuthorVaultView.jsx` — **Tab 1:** Kho IP, Working Preview (Lớp 1) & trạng thái khóa/mở khóa Master Bundle (Lớp 2) của Khánh Linh & Trung Quân.
     - `src/components/RogueAttackView.jsx` — **Tab 2:** Màn hình tấn công bán trộm IP của Nhật Tân & Popup chặn đứng `403 UNILATERAL_EXFILTRATION_BLOCKED`.
     - `src/components/QuorumDisputeView.jsx` — **Tab 3:** Thanh ghép khóa **3-of-3 Key Shard Assembler**, cơ chế phân xử thu hồi quyền của Dr. Cường Thịnh & **Verified IP Release Certificate**.
     - `src/components/BlindServerView.jsx` — **Tab 4:** Góc nhìn máy chủ mù (100% Ciphertext `AES-256-GCM`) & chặn đứng `Attempt Admin Master Override` (`403 ZERO_CUSTODY_ENFORCED`).
     - `src/App.jsx` & `src/data/mockVaultData.js` — **File lõi điều phối chung (Core Shell):** Đã hoàn thiện, **3 thành viên KHÔNG sửa vào 2 file này** để đảm bảo 0% xung đột code!

---

## 📊 Bảng Phân Quyền Sở Hữu File (Zero-Conflict Matrix)

| Thành viên (Gợi ý gán Role) | Role đảm nhận | File ĐƯỢC PHÉP sửa / tạo (Độc quyền 100%) | File CẤM đụng vào |
| :--- | :--- | :--- | :--- |
| **Thành viên 1** *(VD: Nhật Tân)* | **👩‍🎨 ROLE 1 — Red-Team & Blind Server UX Engineer** | `src/components/RogueAttackView.jsx`<br>`src/components/BlindServerView.jsx` | `src/App.jsx`, `QuorumDisputeView.jsx`, `CoAuthorVaultView.jsx` |
| **Thành viên 2** *(VD: Khánh Linh)* | **⚡ ROLE 2 — Emergent Authority Quorum & Vault UX Engineer** | `src/components/QuorumDisputeView.jsx`<br>`src/components/CoAuthorVaultView.jsx` | `src/App.jsx`, `RogueAttackView.jsx`, `BlindServerView.jsx` |
| **Thành viên 3** *(VD: Trung Quân)* | **🎬 ROLE 3 — Demo Director, Pitch Deck & TideCloak Live QA** | `docs/pitch_slides.html` *(tạo mới)*<br>`public/tidecloak.json` *(nếu bật Docker)*<br>`scholar_lock_demo.mp4` *(file video xuất ra)* | Toàn bộ thư mục `src/` của Role 1 & Role 2 |
| **Leader: Cường Thịnh** | **🧭 PM, Code Reviewer & Final Integrator** | Điều phối merge, kiểm tra `npm run build`, duyệt video & nộp bài | Hỗ trợ gỡ rối khi cần |

---

## 🛠️ 2. Phân Công Chi Tiết 3 Role Độc Lập (Zero Code Conflict)

---

### 👩‍🎨 ROLE 1 — Red-Team & Blind Server UX Engineer
*(Phụ trách Luồng Tấn Công Bán Trộm IP & Góc Nhìn Máy Chủ Mù)*

#### 📂 File độc quyền được phép sửa:
- `src/components/RogueAttackView.jsx`
- `src/components/BlindServerView.jsx`
*(Tuyệt đối không sửa `src/App.jsx` hay các component của Role 2).*

#### 🎯 Nhiệm vụ cụ thể:
1. **Nâng cấp `src/components/RogueAttackView.jsx` (Luồng 1 — Nhật Tân bán trộm IP):**
   - Làm cho màn hình tấn công của **Nhật Tân** và khung cảnh báo đỏ `403 UNILATERAL_EXFILTRATION_BLOCKED` thật kịch tính, bắt mắt và dễ đọc ngay trên video demo.
   - Thêm các chỉ báo trực quan: Badge đỏ nhấp nháy (`INSIDER EXFILTRATION ATTEMPT DETECTED`), hiển thị rõ Nhật Tân chỉ nắm giữ **`1 / 3 Required Authority Shards`** nên không thể tái tạo khóa giải mã Master Key.
   - Hiển thị rõ thông báo: *"Sự kiện vi phạm đã được ký mật mã và ghi vào Immutable Audit Log"*.
2. **Nâng cấp `src/components/BlindServerView.jsx` (Luồng Phụ — RMIT IT Admin & Blind Server):**
   - Thiết kế bảng **Database Raw Hex / Ciphertext Inspector** trông giống một màn hình Terminal / Cloud Console thật của RMIT IT Admin (nền tối, font monospace, hiệu ứng dòng lệnh sắc nét).
   - Giúp giám khảo nhìn vào trong **3 giây** hiểu ngay: *"Máy chủ lưu trữ chỉ giữ 100% Ciphertext (`TIDE_E2EE_V1[...]`, `AES-256-GCM`), IT Admin có `0/3 Shard` và không tồn tại Master Key trên server"*.
   - Làm nổi bật hộp báo lỗi `403 ZERO_CUSTODY_ENFORCED` khi bấm nút `"⛔ Attempt Admin Master Override"`.

#### 🧰 Skills khuyên dùng (Gõ trực tiếp vào AI Coding Agent):
- **`ui-ux-pro-max`** & **`ui-styling`**: Nâng cấp độ tương phản thị giác theo phong cách *Cybersecurity Red-Team / Dark Terminal Aesthetic*, chữ to rõ khi quay màn hình 1080p.
- **`ponytail`** (`/ponytail`): Giữ code React/Tailwind cực kỳ gọn sạch, dùng inline SVG/CSS sẵn có, **không cài thêm package npm bên ngoài** để tránh lỗi build.

#### 📋 Prompt mẫu Copy-Paste cho Role 1:
```text
Sử dụng skill ui-ux-pro-max, ui-styling và ponytail:
Hãy nâng cấp giao diện trực quan cho CHỈ 2 file: src/components/RogueAttackView.jsx và src/components/BlindServerView.jsx (tuyệt đối không sửa bất kỳ file nào khác và không đổi tên props truyền vào từ App.jsx).
1. Trong RogueAttackView.jsx: Tăng độ kịch tính thị giác cho kịch bản Nhật Tân (Shard 1/3) thử xuất trộm IP bán cho công ty ngoài. Làm nổi bật thanh trạng thái "Only 1 of 3 Shards Present — Cannot Reconstruct Master Key" và làm cho khung phản hồi 403 UNILATERAL_EXFILTRATION_BLOCKED hiển thị cực kỳ sắc nét, có hiệu ứng cảnh báo bảo mật đỏ rõ ràng khi quay video 2 phút.
2. Trong BlindServerView.jsx: Thiết kế khu vực Database Inspector theo phong cách Cloud Security / Terminal Console chuyên nghiệp để giám khảo nhìn 3 giây thấy ngay cả 3 file chỉ là chuỗi mã hóa mù AES-256-GCM (TIDE_E2EE_V1) và Admin giữ 0/3 Shards. Làm nổi bật cảnh báo 403 ZERO_CUSTODY_ENFORCED khi bấm nút Override.
Giữ nguyên toàn bộ props và callback handlers hiện có, kiểm tra chạy npm run build thành công.
```

---

### ⚡ ROLE 2 — Emergent Authority Quorum & Vault UX Engineer
*(Phụ trách Luồng Mở Khóa Đồng Thuận 3/3 Shards, Phân Xử Đạo Đức & Chứng Chỉ Bản Quyền)*

#### 📂 File độc quyền được phép sửa:
- `src/components/QuorumDisputeView.jsx`
- `src/components/CoAuthorVaultView.jsx`
*(Tuyệt đối không sửa `src/App.jsx` hay các component của Role 1).*

#### 🎯 Nhiệm vụ cụ thể:
1. **Tinh chỉnh `src/components/QuorumDisputeView.jsx` (Luồng 2 — 3-of-3 Key Shard Assembler & Certificate):**
   - Nâng cấp thanh tiến trình ghép khóa **3-of-3 Key Shard Assembler** (`0/3` $\rightarrow$ `1/3 Khánh Linh` $\rightarrow$ `2/3 Trung Quân` $\rightarrow$ `3/3 Dr. Cường Thịnh Revoke Nhật Tân & Co-sign`) sao cho khoảnh khắc chuyển từ `2/3` sang `3/3` tạo hiệu ứng **"WOW" thị giác mạnh mẽ nhất** trên video (chuyển từ trạng thái Locked sang **Emergent Authority Active — Ephemeral Key Assembled in Browser**).
   - Chăm chút giao diện **Verified IP Release Certificate** (Chứng chỉ Bản quyền & Xuất bản IEEE): Hiển thị sang trọng như một chứng chỉ mật mã học thuật chính thức, có dấu xác nhận `TIDECLOAK EMERGENT AUTHORITY VERIFIED`, danh sách 3 chữ ký mật mã, và ghi chú rõ quyết định thu hồi Shard của Nhật Tân dựa trên bằng chứng từ Audit Log.
2. **Nâng cấp `src/components/CoAuthorVaultView.jsx` (Tab 1 — Kho Tài Sản IP 2 Lớp):**
   - Làm rõ sự tương phản giữa **Lớp 1 (Daily Working Preview — Mở bằng Tag Policy cho Co-Author)** và **Lớp 2 (Full Master IP Bundle — Bị khóa Ciphertext cho đến khi đủ 3/3 Quorum)**.
   - Khi đạt `3/3 Shards`, làm cho cả 3 thẻ tài sản (`research_paper_final.pdf`, `brain_cancer_model.pth`, `confidential_patient_dataset.csv`) sáng bừng sang màu xanh ngọc lục bảo (`Emerald Unlocked`) với nội dung Plaintext xuất hiện rõ ràng.

#### 🧰 Skills khuyên dùng (Gõ trực tiếp vào AI Coding Agent):
- **`ui-ux-pro-max`** & **`ui-styling`**: Thiết kế khung **Verified IP Release Certificate** và thanh **3-of-3 Shard Assembler** sang trọng, hiện đại, chữ đủ lớn khi lên hình 1080p.
- **`ponytail`** & **`ponytail-review`** (`/ponytail-review`): Rà soát logic render trạng thái `0/3 -> 1/3 -> 2/3 -> 3/3` mượt mà, không phát sinh lỗi khi người dùng bấm ký liên tiếp hoặc bấm Reset Demo.

#### 📋 Prompt mẫu Copy-Paste cho Role 2:
```text
Sử dụng skill ui-ux-pro-max, ui-styling và ponytail:
Hãy nâng cấp giao diện trực quan cho CHỈ 2 file: src/components/QuorumDisputeView.jsx và src/components/CoAuthorVaultView.jsx (tuyệt đối không sửa bất kỳ file nào khác và không đổi tên props truyền vào từ App.jsx).
1. Trong QuorumDisputeView.jsx: Thiết kế thanh tiến trình ghép khóa 3-of-3 Key Shard Assembler (0/3 -> 1/3 Khánh Linh -> 2/3 Trung Quân -> 3/3 Dr. Cường Thịnh Revoke Nhật Tân) thật trực quan và ấn tượng. Khi đạt 3/3 Shards, làm nổi bật hiệu ứng mở khóa "Emergent Authority Active" và thiết kế thẻ "Verified IP Release Certificate" sang trọng, rõ nét trên video 1080p.
2. Trong CoAuthorVaultView.jsx: Làm rõ kiến trúc bảo mật 2 lớp (Layer 1: Working Preview vs Layer 2: Quorum-Locked Full IP Bundle) và hiệu ứng chuyển đổi trực quan từ Ciphertext sang Unlocked Plaintext khi đạt đủ 3/3 Shards.
Sau khi sửa xong, dùng tinh thần ponytail-review để kiểm tra không có lỗi render và chạy npm run build thành công.
```

---

### 🎬 ROLE 3 — Demo Director, Pitch Deck & TideCloak Live QA
*(Phụ trách Slide Mở Đầu 15s, Kiểm Thử TideCloak & Sản Xuất Video Demo 2 Phút)*

#### 📂 File độc quyền được phép tạo / sửa:
- `docs/pitch_slides.html` *(Slide HTML mở đầu/kết thúc phục vụ 15s đầu và 15s cuối video)*
- `public/tidecloak.json` *(Tùy chọn nếu cấu hình chạy Docker TideCloak live ở cổng `8080`)*
- `scholar_lock_demo.mp4` *(File video hoàn chỉnh xuất ra ở thư mục gốc, dung lượng `< 100MB`)*
*(Tuyệt đối KHÔNG đụng vào bất kỳ file nào trong thư mục `src/` của Role 1 & Role 2!)*

#### 🎯 Nhiệm vụ cụ thể:
1. **Tạo Slide Mở Đầu & Kết Thúc (`docs/pitch_slides.html`):**
   - Dùng cho **15 giây đầu tiên của video** để giới thiệu cực nhanh bối cảnh: Nhóm Capstone AI Y sinh tại RMIT gồm **Khánh Linh, Trung Quân, Nhật Tân** và cố vấn **Dr. Cường Thịnh** đang bảo vệ 3 tài sản IP quý giá trước 2 nguy cơ: **Ăn cắp nội bộ (Insider Exfiltration)** và **Kẹt đồ án khi thành viên làm phản (3/3 Co-Author Hostage Deadlock)**.
   - Slide cuối (10 giây cuối video): Tóm tắt **Why TideCloak & Emergent Authority Matters** (Tại sao OAuth/RBAC/Database thông thường thất bại còn TideCloak giải quyết triệt để).
2. **Kiểm thử luồng Demo & Chuẩn bị Màn hình Quay (1920x1080, Zoom 110%–125%):**
   - Mở trình duyệt ở chế độ toàn màn hình (`F11`), phóng to `110%` hoặc `125%` để giám khảo xem video thấy rõ từng dòng chữ trên UI.
   - Tập dượt bấm mượt mà qua 4 Tab theo đúng kịch bản 120 giây bên dưới.
3. **Thu âm Voiceover & Dựng Video 2 Phút (`scholar_lock_demo.mp4`):**
   - Quay màn hình sắc nét (OBS Studio / Windows Snipping Video / Loom / CapCut), ghép lời thoại tiếng Anh (bản chuẩn 120 giây có sẵn ở Mục 3 bên dưới).
   - Kiểm tra kỹ: Thời lượng **$\le$ 2 phút 00 giây**, định dạng `.mp4`, dung lượng **$< 100\text{ MB}$**, âm thanh rõ ràng.

#### 🧰 Skills khuyên dùng (Gõ trực tiếp vào AI Coding Agent):
- **`slides`**, **`brand`** & **`design-system`**: Tạo nhanh bộ slide HTML tự chạy (`docs/pitch_slides.html`) có thiết kế chuẩn Cybersecurity/RMIT để quay 15 giây mở đầu và 15 giây kết thúc.
- **`banner-design`**: Tạo sơ đồ kiến trúc trực quan hoặc ảnh bìa/thumbnail cho bài nộp nếu cần.

#### 📋 Prompt mẫu Copy-Paste cho Role 3:
```text
Sử dụng skill slides, design-system và brand:
Hãy tạo file độc lập docs/pitch_slides.html (tuyệt đối không sửa bất kỳ file nào trong src/) chứa 3 slide HTML trình chiếu toàn màn hình (chuyển slide bằng phím mũi tên trái/phải, giao diện Dark Mode Cybersecurity sắc nét cho độ phân giải 1920x1080) để quay phần mở đầu và kết thúc cho video demo 2 phút của dự án ScholarLock:
- Slide 1 (0:00 - 0:15): The Research IP Dilemma at RMIT — Giới thiệu 3 tài sản IP (IEEE Paper, 96.4% Brain Cancer AI Model, 1,200 Patient Dataset) và 4 nhân vật (Khánh Linh, Trung Quân, kẻ phản bội Nhật Tân, và trọng tài đạo đức Dr. Cường Thịnh). Nêu bật 2 bài toán: Insider Theft & Co-Author Hostage Deadlock.
- Slide 2: Sơ đồ kiến trúc 2 lớp của TideCloak Emergent Authority (No Master Key at Rest, Blind Server AES-256-GCM, 3-of-3 Transient Browser Decryption + Ethics Arbitration).
- Slide 3 (1:40 - 2:00): Why Standard RBAC/OAuth Fails vs. Why TideCloak Wins — Khẳng định thông điệp cốt lõi của cuộc thi: "Authority does not exist at rest; it emerges transiently only when legitimate quorum aligns."
```

---

## 🎙️ 3. Kịch Bản Quay Video 2 Phút (120 Giây) Chuẩn Từng Khung Hình & Lời Thoại Tiếng Anh

> **💡 Mẹo quay nhanh & đạt điểm tối đa:**  
> - Một bạn điều khiển chuột bấm theo đúng cột **[Hành động trên màn hình]**, một bạn đọc cột **[Voiceover Script (English)]** (hoặc thu âm trước rồi ghép hình).  
> - Tốc độ đọc vừa phải (~140 từ/phút), nhấn giọng ở các từ khóa in đậm.

---

### ⏱️ Phân Cảnh 1 (0:00 – 0:20) | The Problem: Insider Theft & Co-Author Hostage
- **🖥️ Hành động trên màn hình:**
  - `0:00–0:10`: Mở `docs/pitch_slides.html` (Slide 1) hoặc chỉ thẳng vào thanh Header & 3 thẻ tài sản IP trên giao diện chính của **ScholarLock** (`Tab 1: Co-Author Vault`).
  - `0:10–0:20`: Di chuột qua 3 tài sản (`research_paper_final.pdf`, `brain_cancer_model.pth`, `confidential_patient_dataset.csv`) đang ở trạng thái **Lớp 1: Working Preview Visible** nhưng **Lớp 2: Full IP Bundle Locked (`AES-256-GCM`)**.
- **🎙️ Voiceover Script (English — 20s):**
  > *"University research teams face a critical security paradox. Meet our RMIT Capstone team: **Khánh Linh**, **Trung Quân**, and **Nhật Tân**, building a 96.4% accuracy brain cancer AI model. How do they collaborate daily without letting a rogue member steal the model weights—or hold the entire team hostage by refusing to sign off? And how do we ensure even **RMIT IT Admins** cannot peek at unpublished breakthroughs? Welcome to **ScholarLock**, powered by **TideCloak**."*

---

### ⏱️ Phân Cảnh 2 (0:20 – 0:50) | Flow 1 & Flow 2: Rogue Insider & Blind Server Blocked
- **🖥️ Hành động trên màn hình:**
  - `0:20–0:35`: Chuyển sang **`Tab 2: Rogue Insider (Nhật Tân)`**. Bấm nút màu đỏ **"🚨 Nhật Tân: Attempt Unilateral IP Export (Sell to Company)"**.
  - Khung cảnh báo đỏ **`403 UNILATERAL_EXFILTRATION_BLOCKED`** bung ra cùng sự kiện ghi ngay lập tức vào cột **Immutable Audit Log** bên phải.
  - `0:35–0:50`: Chuyển sang **`Tab 4: Blind Server / IT Admin`**. Chỉ vào bảng Ciphertext (`TIDE_E2EE_V1[...]`), sau đó bấm nút **"⛔ Attempt Admin Master Override"** $\rightarrow$ Hiện cảnh báo **`403 ZERO_CUSTODY_ENFORCED`**.
- **🎙️ Voiceover Script (English — 30s):**
  > *"First, suppose co-author **Nhật Tân** goes rogue and tries to export the full AI weights and patient dataset to sell to an outside company. When he clicks export, **TideCloak** blocks him instantly with **403 Unilateral Exfiltration Blocked**. Why? Because no single user holds a master key—Nhật Tân holds only **one of three** required authority shards, and his breach attempt is cryptographically sealed into the **Immutable Audit Log**.*  
  > *Even if we switch to the **Blind Server & IT Admin view**, the database stores pure **AES-256-GCM ciphertext**. An Admin Override attempt fails with **Zero Custody Enforced**—because the server holds **zero shards**."*

---

### ⏱️ Phân Cảnh 3 (0:50 – 1:35) | Flow 3: Emergent Authority 3/3 Quorum & Dispute Arbitration
- **🖥️ Hành động trên màn hình:**
  - `0:50–1:00`: Chuyển sang **`Tab 3: Quorum & Dispute Panel`**. Chỉ vào thanh **3-of-3 Key Shard Assembler** đang ở mức `0/3`.
  - `1:00–1:15`: Bấm lần lượt:
    1. **"Sign Shard 1/3 (Khánh Linh)"** $\rightarrow$ Tiến trình lên `1/3`.
    2. **"Sign Shard 2/3 (Trung Quân)"** $\rightarrow$ Tiến trình lên `2/3` (vẫn chưa giải mã được).
  - `1:15–1:35`: Chỉ vào bằng chứng vi phạm của Nhật Tân, sau đó bấm nút thứ 3: **"⚖️ Sign Shard 3/3 (Dr. Cường Thịnh — Revoke Nhật Tân & Co-Sign)"**.
  - Thanh trạng thái chuyển sang **`3/3 Shards Aligned — Emergent Authority Active`**! Cuộn nhẹ xuống khoe **Verified IP Release Certificate** và bấm qua **`Tab 1: Co-Author Vault`** để thấy cả 3 tài sản đã chuyển sang **Unlocked Plaintext**!
- **🎙️ Voiceover Script (English — 45s):**
  > *"Now, Nhật Tân abandons the team. Normally, a strict 3-of-3 multi-sig would permanently deadlock Khánh Linh and Trung Quân from publishing to IEEE. Here is how **Emergent Authority** solves both security and deadlock:*  
  > *In the **Quorum Panel**, **Khánh Linh** signs Shard 1 of 3. **Trung Quân** signs Shard 2 of 3. At 2 of 3, the vault remains cryptographically locked.*  
  > *Because the **Immutable Audit Log** proved Nhật Tân's misconduct, Academic Ethics Chair **Dr. Cường Thịnh** is authorized to revoke Nhật Tân’s shard and co-sign **Arbitration Shard 3 of 3**.*  
  > *The moment all **3 of 3 shards align**, decryption authority **emerges transiently right inside the browser** via TideCloak's `doDecrypt`. All three IP assets unlock instantly, generating a **Verified IP Release Certificate** ready for IEEE submission."*

---

### ⏱️ Phân Cảnh 4 (1:35 – 2:00) | Why TideCloak Matters & Real-World Impact
- **🖥️ Hành động trên màn hình:**
  - `1:35–1:50`: Giữ trên màn hình **Verified IP Release Certificate** cùng **Immutable Audit Log** (hoặc chuyển sang Slide 3 của `docs/pitch_slides.html`).
  - `1:50–2:00`: Nhấn mạnh thông điệp kết thúc.
- **🎙️ Voiceover Script (English — 25s):**
  > *"If ScholarLock used traditional OAuth, JWTs, or backend RBAC, a database admin or a compromised server could still silently dump every file. With **TideCloak**, master decryption authority **does not exist at rest**—neither in the database nor in any admin account. It emerges only when legitimate human governance aligns. **ScholarLock**: Provable Zero-Trust IP Protection for the next generation of research."*

---

## ⏰ 4. Quy Tắc Git & Timeline Chốt Sổ (13:45 – 17:30)

### 🛡️ Quy Tắc Vàng Khi Push Code (Đảm Bảo 0% Conflict):
1. **Chỉ sửa đúng file thuộc Role của mình** (xem bảng phân quyền ở Mục 1).
2. Trước khi commit và push, luôn chạy đúng 4 lệnh sau:
   ```bash
   git status
   # Kiểm tra chắc chắn chỉ có file của Role mình thay đổi!
   git add <chỉ-tên-file-của-role-mình>
   git commit -m "feat(role-X): polish UI for <tên-component>"
   git pull --rebase origin main
   npm run build
   git push origin main
   ```
3. **Không cài thêm thư viện npm mới (`package.json` / `package-lock.json`)** nếu không thật sự cần thiết để tránh xung đột file lock.

### 🗓️ Mốc Thời Gian Tác Chiến Ca Chiều:
- **`13:45 – 14:00` (15 phút):** Cả nhóm đọc `TASK.md`, chốt gán tên từng người vào **Role 1, Role 2, Role 3**, pull code mới nhất về máy và chạy thử `npm run dev`.
- **`14:00 – 15:30` (90 phút):**
  - **Role 1** nâng cấp `RogueAttackView.jsx` & `BlindServerView.jsx`.
  - **Role 2** nâng cấp `QuorumDisputeView.jsx` & `CoAuthorVaultView.jsx`.
  - **Role 3** tạo `docs/pitch_slides.html`, luyện đọc script tiếng Anh 120s và chuẩn bị công cụ quay màn hình.
- **`15:30 – 16:00` (30 phút — Code Freeze & Merge):**
  - **Cường Thịnh** cùng Role 1 & Role 2 ghép code (`git pull --rebase`), chạy `npm run build` và kiểm tra toàn bộ 4 Tab trên trình duyệt ở độ phân giải Full HD 1920x1080.
- **`16:00 – 17:00` (60 phút — Quay & Dựng Video 2 Phút):**
  - **Role 3** chủ trì quay màn hình + thu âm theo kịch bản 4 phân cảnh ở Mục 3, xuất file `scholar_lock_demo.mp4` (`< 100MB`).
- **`17:00 – 17:30` (30 phút — Final Check & Submit):**
  - Kiểm tra lần cuối toàn bộ checklist nộp bài cùng **Cường Thịnh** và nộp trước hạn `18:00` ít nhất 30 phút!
