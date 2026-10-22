# AGENTS.md — Hướng Dẫn Phát Triển Dự Án: ScholarLock

**Tài liệu đặc tả kỹ thuật, kiến trúc và kịch bản phát triển dành cho Developer và AI Coding Agents.**  
**Cuộc thi:** RMIT Industry Challenge: Unlocked (Tide / RMIT University).  
**Công nghệ cốt lõi bắt buộc:** **TideCloak** & **Emergent Authority** (Thẩm quyền phái sinh).

---

## 1. BỐI CẢNH DỰ ÁN & QUY TẮC SỐNG CÒN (GROUND TRUTH)

- **Tên dự án:** **ScholarLock — Zero-Trust Capstone & Co-Research IP Vault**.
- **Bài toán giải quyết:**
  1. **Insider Exfiltration (Ăn cắp & bán trộm tài sản trí tuệ nội bộ):** Ngăn chặn thành viên trong nhóm đồ án/nghiên cứu tự ý tải trộm source code, trọng số mô hình AI (`model weights`) hoặc dữ liệu bệnh nhân để bán cho bên thứ ba hoặc đăng ký bản quyền riêng.
  2. **Co-Author Hostage / Deadlock (Chống kẹt đồ án khi thành viên làm phản):** Giải quyết triệt để rủi ro khi áp dụng cơ chế đồng thuận 3/3 nhưng 1 thành viên làm phản, nghỉ ngang hoặc cố tình từ chối ký để tống tiền/cầm chân cả nhóm.
  3. **Blind Storage & Zero Admin Custody (Loại bỏ quyền đọc trộm của Admin hệ thống):** Đảm bảo quản trị viên IT của trường (RMIT IT Admin) hoặc nhà cung cấp đám mây không nắm giữ Master Key và không thể đọc trộm các nghiên cứu chưa công bố.
- **Nguyên tắc kỹ thuật tối thượng của cuộc thi:**
  > *"Nếu ứng dụng của bạn hoạt động y hệt khi chỉ dùng hệ thống đăng nhập thông thường (OAuth/JWT/RBAC) và database backend, dự án sẽ thất bại. TideCloak bắt buộc phải làm thay đổi bản chất những gì ứng dụng có thể làm một cách đáng tin cậy."*
- **Nguyên tắc cốt lõi của TideCloak & Emergent Authority (Thẩm quyền phái sinh):**
  - **Không có Master Key ở trạng thái nghỉ (No Authority at Rest):** Không một Super-Admin, Trưởng nhóm hay máy chủ backend nào có thể đơn phương giải mã toàn bộ gói tài sản trí tuệ của nhóm.
  - **Kiến trúc Bảo mật Phân tầng 2 Lớp (Two-Tier Cryptographic Architecture):**
    - **Lớp 1 — Client-Side E2EE & Working Preview (Phục vụ công việc hàng ngày):** Các đồng tác giả hợp lệ có thể xem bản tóm tắt công việc (`Working Metadata / Preview`) thông qua cơ chế kiểm tra chính sách gắn thẻ (`Tag-based Policy`) của TideCloak trên trình duyệt, trong khi máy chủ lưu trữ và IT Admin chỉ nhìn thấy **100% Ciphertext** (`AES-256-GCM` / `TIDE_E2EE_V1`).
    - **Lớp 2 — Quorum-Locked Master IP Bundle (Xuất bản & Thương mại hóa):** Quyền giải mã và trích xuất trọn bộ tài sản gốc (`Full Plaintext IP Bundle`) để nộp bài báo IEEE hoặc chuyển giao thương mại hóa **hoàn toàn không tồn tại sẵn ở trạng thái nghỉ**. Thẩm quyền này chỉ phái sinh tạm thời (*emerges transiently*) ngay trên trình duyệt khi hội tụ đủ **3/3 mảnh khóa độc lập (3-of-3 Threshold Authority Shards)**.
    - **Tại sao dùng 3-of-3 Threshold Shards trên toàn bộ gói IP thay vì chia mỗi người giữ 1 khóa theo từng file?** Nếu chia theo file (ví dụ mỗi người giữ trọn vẹn khóa của 1 file), kẻ phản bội vẫn có thể tự ý đánh cắp và bán trộm trọn vẹn 1 tài sản độc lập cực kỳ giá trị (như file trọng số `brain_cancer_model.pth`). Việc áp dụng **Threshold Secret Sharing (3/3)** trên toàn bộ gói Master IP đảm bảo mỗi thành viên chỉ giữ **1/3 mảnh toán học của khóa chung** — đứng một mình (`1/3`) sẽ hoàn toàn vô dụng trước cả 3 tài sản.

---

## 2. NHÂN VẬT (ACTORS) & TÀI SẢN TRÍ TUỆ (LOCKED IP ASSETS)

### 👥 Hệ thống Nhân vật (5 Actors)

1. 👩‍🔬 **Khánh Linh (AI Lead)** — Đồng tác giả chính (`Shard 1/3` — *TideCloak Verified*, Role: `co-author`).
   - Phụ trách kiến trúc mô hình Deep Learning. Giữ mảnh khóa thẩm quyền thứ nhất.
2. 👨‍💻 **Trung Quân (Data Engineer)** — Đồng tác giả (`Shard 2/3` — *TideCloak Verified*, Role: `co-author`).
   - Phụ trách tiền xử lý dữ liệu lâm sàng và huấn luyện. Giữ mảnh khóa thẩm quyền thứ hai.
3. 🚨 **Nhật Tân (Rogue Member / Kẻ phản bội)** — Đồng tác giả (`Shard 3/3 ban đầu` — *TideCloak Verified*, Role: `co-author`).
   - Thành viên có ý định nghỉ nhóm và lén xuất bản/bán trộm toàn bộ mô hình AI cùng bộ dữ liệu cho công ty bên ngoài.
4. ⚖️ **Dr. Cường Thịnh (RMIT Academic Advisor / Ethics Chair)** — Trọng tài phân xử học thuật (*TideCloak Verified*, Role: `ethics-arbitrator`).
   - Bình thường **không có quyền tự ý mở khóa tài sản của sinh viên**. Tuy nhiên, khi hệ thống ghi nhận bằng chứng vi phạm của Nhật Tân trong **Immutable Audit Log**, Dr. Cường Thịnh có thẩm quyền kích hoạt cơ chế phân xử đạo đức (*Dispute Arbitration*) để thu hồi mảnh khóa của Nhật Tân và ký thay mảnh khóa thứ 3 (`Arbitration Shard 3/3`), giúp Khánh Linh và Trung Quân không bị kẹt đồ án.
   - **3 Giới hạn Mật mã Cứng (3 Cryptographic Guardrails) đối với Dr. Cường Thịnh:**
     1. **Chỉ giữ `1/3 Arbitration Shard` (No Unilateral Power):** Không nắm giữ Master Key, không thể tự mình giải mã bất kỳ tài sản nào (luôn cần đủ chữ ký đồng thuận của 2 đồng tác giả còn lại) và không xem được `Working Preview` hàng ngày của sinh viên.
     2. **Dormant Policy (Ngủ đông mặc định — Chống thông đồng):** Mảnh khóa phân xử bị khóa cứng ở trạng thái `🔒 DORMANT (NO BREACH)` khi Nhật Tân chưa vi phạm (ngăn chặn rủi ro 2 sinh viên thông đồng với giảng viên để loại bỏ một thành viên vô tội). Mảnh khóa này chỉ được mở khóa khi có bằng chứng vi phạm `403` bất biến được ghi nhận trong **Immutable Audit Log**.
     3. **Public Accountability (Trách nhiệm giải trình bất biến):** Chữ ký số `Ed25519` của Dr. Cường Thịnh cùng biên bản thu hồi quyền của thành viên vi phạm được khắc vĩnh viễn vào **Verified IP Release Certificate** và **Immutable Audit Log**.
5. 🖥️ **RMIT IT Admin / Cloud Server Operator** — Quản trị viên hạ tầng (`0/3 Shards` — Role: `sysadmin`).
   - Có toàn quyền truy cập cơ sở dữ liệu vật lý nhưng **không có bất kỳ mảnh khóa giải mã nào**. Mọi nỗ lực dùng quyền Admin để ghi đè hoặc đọc dữ liệu đều bị chặn đứng.

### 🔐 3 Tài sản Trí tuệ bị khóa trong Vault (Blind Storage — `AES-256-GCM`)

Toàn bộ tài sản nghiên cứu của nhóm Capstone được mã hóa đầu-cuối (Client-side E2EE) gắn với Tag Policy của TideCloak:

1. 📄 **`research_paper_final.pdf`** — *Bản thảo bài báo khoa học chuẩn bị nộp hội nghị IEEE*
   - **TideCloak Tag:** `ip-paper`
   - **Nội dung bảo vệ:** Phương pháp huấn luyện kiến trúc lai Vision-Transformer cho ảnh chụp MRI sọ não và kết quả thực nghiệm độc quyền.
2. 💻 **`brain_cancer_model.pth`** — *Trọng số mô hình AI chẩn đoán ung thư não (Độ chính xác 96.4%)*
   - **TideCloak Tag:** `ip-weights`
   - **Nội dung bảo vệ:** Checkpoint trọng số mạng nơ-ron đã huấn luyện trên 400 giờ GPU cùng siêu tham số tối ưu hóa.
3. 📊 **`confidential_patient_dataset.csv`** — *Bộ dữ liệu lâm sàng 1,200 bệnh nhân (Đã ẩn danh)*
   - **TideCloak Tag:** `ip-dataset`
   - **Nội dung bảo vệ:** Hồ sơ chỉ số sinh học và nhãn chẩn đoán bệnh lý thần kinh nhạy cảm tuân thủ quy định đạo đức y sinh.

---

## 3. KỊCH BẢN NGHIỆP VỤ & 3 LUỒNG TƯƠNG TÁC DEMO (CORE INTERACTIONS)

### 🔴 Luồng 1: Kẻ Phản Bội Thử Nghiệm Bán Trộm (The Rogue Attack — Nhật Tân)

- **Bối cảnh:** Nhật Tân nhận được lời đề nghị mua lại mô hình AI từ một công ty bên ngoài nên lén đăng nhập vào ScholarLock để tải trọn bộ `brain_cancer_model.pth` và `confidential_patient_dataset.csv`.
- **Hành động:** Người dùng chuyển sang góc nhìn **Rogue Insider (Nhật Tân)** và bấm nút:
  `"🚨 Nhật Tân: Attempt Unilateral IP Export (Sell to Company)"`.
- **Kết quả xử lý của TideCloak:**
  1. Hệ thống TideCloak kiểm tra thẩm quyền mật mã và **chặn đứng tức thì** hành vi trích xuất đơn phương với Popup cảnh báo đỏ (`403 UNILATERAL_EXFILTRATION_BLOCKED`):
     ```json
     {
       "status": 403,
       "error": "UNILATERAL_EXFILTRATION_BLOCKED",
       "message": "Access Denied by TideCloak. Nhật Tân only holds 1 of 3 required co-author authority shards. Master Key does not exist."
     }
     ```
  2. Ngay lập tức, hành vi vi phạm của Nhật Tân được ký xác thực và ghi tự động vào **Immutable Audit Log** (Nhật ký kiểm toán bất biến), tạo bằng chứng mật mã không thể chối cãi để làm căn cứ phân xử tranh chấp.

---

### 🛡️ Luồng Phụ: Nhà Vận Hành / IT Admin Thử Vượt Quyền (Blind Server & Admin Override Blocked)

- **Bối cảnh:** Để chứng minh hệ thống không chỉ là bước kiểm tra `if (role === 'admin')` thông thường ở phía giao diện hay backend, giám khảo chuyển sang góc nhìn máy chủ lưu trữ và quản trị viên hệ thống.
- **Hành động:**
  1. Mở tab **Blind Server / IT Admin Inspector**: Kiểm tra trực tiếp dữ liệu thô trong Database — cả 3 tài sản chỉ hiển thị dưới dạng chuỗi mã hóa mù `TIDE_E2EE_V1[ip-weights]::gAAAAAB...` (`AES-256-GCM`).
  2. Bấm nút `"⛔ Attempt Admin Master Override"` để thử dùng đặc quyền Root/SysAdmin giải mã hoặc ép buộc xuất file.
- **Kết quả xử lý của TideCloak:**
  - Hệ thống từ chối tuyệt đối với mã lỗi `403 ZERO_CUSTODY_ENFORCED`:
    ```json
    {
      "status": 403,
      "error": "ZERO_CUSTODY_ENFORCED",
      "message": "Cryptographic Failure: Infrastructure Operator holds 0 of 3 authority shards. Server possesses only blind ciphertext."
    }
    ```
  - Ghi nhận sự kiện cảnh báo can thiệp trái phép của Admin vào **Immutable Audit Log**.

---

### 🟢 Luồng 2: Thẩm Quyền Phái Sinh & Phân Xử Mở Khóa Hợp Pháp (Emergent Authority 3/3 Quorum)

- **Bối cảnh:** Sau khi Nhật Tân âm mưu bán trộm tài sản bất thành và bỏ nhóm, Khánh Linh và Trung Quân cần xuất bản công trình nghiên cứu lên IEEE đúng hạn mà không bị Nhật Tân làm kẹt (Deadlock).
- **Hành động:**
  1. Chuyển sang tab **Quorum & Dispute Panel**. Dựa trên bằng chứng vi phạm của Nhật Tân đã ghi trong Audit Log, Khánh Linh và Trung Quân kích hoạt **Dispute & Official IP Release Proposal**.
  2. Trên thanh ghép khóa **3-of-3 Key Shard Assembler**, thu thập lần lượt 3 chữ ký mật mã độc lập:
     - **Chữ ký 1:** 👩‍🔬 **Khánh Linh (Shard 1/3)** — *Co-Author Approval Signed*.
     - **Chữ ký 2:** 👨‍💻 **Trung Quân (Shard 2/3)** — *Co-Author Approval Signed*.
     - **Chữ ký 3:** ⚖️ **Dr. Cường Thịnh (Shard 3/3 — Revoke Nhật Tân & Co-sign)** — *Academic Ethics Arbitrator xác nhận bằng chứng vi phạm trong Audit Log, thu hồi hiệu lực mảnh khóa của Nhật Tân và ký mảnh khóa thứ 3*.
- **Kết quả xử lý của TideCloak:**
  1. Khi đạt trạng thái **`3/3 Shards Aligned — Emergent Authority Active`**, khóa giải mã tạm thời được tái tạo ngay trên trình duyệt của phiên làm việc thông qua cơ chế `doDecrypt` của TideCloak.
  2. Toàn bộ 3 tài sản (`research_paper_final.pdf`, `brain_cancer_model.pth`, `confidential_patient_dataset.csv`) chuyển từ **Ciphertext** sang **Unlocked Plaintext** ngay lập tức.
  3. Hệ thống cấp **Chứng chỉ Bản quyền & Xuất bản Số (Verified IP Release Certificate)** ghi rõ mã băm mật mã của 3 chữ ký đồng thuận, thời điểm mở khóa và quyết định thu hồi quyền của thành viên vi phạm.

---

## 4. KIẾN TRÚC KỸ THUẬT & HƯỚNG DẪN CHO CODING AGENTS (TECHNICAL BLUEPRINT)

### 🛠️ Stack Công nghệ & Tích hợp `@tidecloak/react`

- **Frontend Framework:** React 19 + Vite + TypeScript/JavaScript.
- **TideCloak SDK:** Sử dụng trực tiếp gói chính thức `@tidecloak/react` thông qua hook `useTideCloak()`:
  - Xác thực & Vai trò: `login`, `logout`, `authenticated`, `hasRealmRole`, `getValueFromIdToken`.
  - Mã hóa đầu-cuối gắn thẻ (Tag-bound E2EE): `doEncrypt`, `doDecrypt` kết hợp định dạng phong bì mật mã `TIDE_E2EE_V1[<tag>]::<ciphertext>`.

### ⚡ Cơ chế Hybrid Thông Minh (Live TideCloak + Zero-Friction Judge Simulation)

- **Tương thích thực tế 100%:** Khi có cấu hình `public/tidecloak.json` kết nối tới container `tideorg/tidecloak-dev:latest` (cổng `8080`), ứng dụng gọi trực tiếp các phương thức `doEncrypt` / `doDecrypt` và kiểm tra role thật từ TideCloak.
- **Trải nghiệm Chấm thi & Quay Demo Mượt mà (Zero-Error Banner):** Nếu giám khảo chạy ứng dụng ngay bằng `npm run dev` mà chưa bật Docker container ở cổng `8080`, ứng dụng tự động vận hành ở chế độ **Interactive Cryptographic Simulation** mượt mà:
  - **Tuyệt đối không hiển thị banner báo lỗi kết nối đỏ** gây hiểu nhầm hoặc làm xấu khung hình khi quay video demo 2 phút.
  - Vẫn thực thi đầy đủ logic phong bì mã hóa `AES-256-GCM` / `TIDE_E2EE_V1`, kiểm tra mảnh khóa `1/3`, `0/3`, `3/3` và nhật ký kiểm toán bất biến.

### 🎨 Thiết kế Giao diện Phục vụ Video Pitch 2 Phút (Single-Screen Command Center)

- Tập trung toàn bộ trải nghiệm vào **1 màn hình điều khiển trung tâm (Zero-Trust Vault Command Center)** với độ tương phản thị giác rõ rệt:
  - **Thanh chuyển đổi góc nhìn nhanh (4-Tab Role Switcher):**
    1. `Co-Author Vault (Khánh Linh & Trung Quân)` — Xem trạng thái 3 tài sản IP, Working Preview (Lớp 1) và trạng thái khóa Master Bundle (Lớp 2).
    2. `Rogue Insider (Nhật Tân)` — Nút bấm nổi bật để thử nghiệm hành vi bán trộm IP và kích hoạt Popup chặn `403 UNILATERAL_EXFILTRATION_BLOCKED`.
    3. `Quorum & Dispute Panel` — Thanh tiến trình **3-of-3 Key Shard Assembler** trực quan (0/3 → 1/3 → 2/3 → 3/3) cùng hiển thị **Verified IP Release Certificate** khi mở khóa thành công.
    4. `Blind Server / IT Admin` — Góc nhìn chứng minh máy chủ mù (100% Ciphertext) và chặn đứng nút `Attempt Admin Master Override` (`403 ZERO_CUSTODY_ENFORCED`).
  - **Immutable Audit Log cố định / trực quan:** Luôn cập nhật theo thời gian thực mọi sự kiện (Nhật Tân bị chặn, Admin bị từ chối, Dr. Cường Thịnh thu hồi shard và mở khóa 3/3) để giám khảo thấy rõ chuỗi nhân quả bảo mật.
