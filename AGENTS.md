\# AGENTS.md — Hướng Dẫn Phát Triển Dự Án: ScholarLock



&#x20;   \*\*Tài liệu đặc tả kỹ thuật, kiến trúc và kịch bản phát triển dành cho Developer và AI Coding Agents.\*\*  

&#x20;   \*\*Cuộc thi:\*\* RMIT Industry Challenge: Unlocked (Tide / RMIT University).  

&#x20;   \*\*Công nghệ cốt lõi bắt buộc:\*\* \*\*TideCloak\*\* \& \*\*Emergent Authority\*\* (Thẩm quyền phái sinh).







\---



\## 1. BỐI CẢNH DỰ ÁN \& QUY TẮC SỐNG CÒN (GROUND TRUTH)



\- 

\*Tên dự án:\*

\*ScholarLock\* — Zero-Trust Capstone \& Co-Research IP Vault.

\- \*Bài toán giải quyết:\* Nạn ăn cắp ý tưởng, bán trộm source code đồ án tốt nghiệp, hoặc nẫng tay trên đề tài nghiên cứu giữa các sinh viên/đồng tác giả trong môi trường đại học.

\- \*Nguyên tắc kỹ thuật tối thượng của cuộc thi:\*

&#x20; > "Nếu ứng dụng của bạn hoạt động y hệt khi chỉ dùng hệ thống đăng nhập thông thường (OAuth/JWT/RBAC) và database backend, dự án sẽ thất bại. TideCloak bắt buộc phải làm thay đổi bản chất những gì ứng dụng có thể làm một cách đáng tin cậy."

\- \*Sự khác biệt của TideCloak (The Superpower):\*

&#x20; - \*Không có Master Key (Khóa vạn năng):\* Không một Super-Admin, Trưởng nhóm hay máy chủ backend nào có thể đơn phương giải mã dữ liệu của nhóm.

&#x20; - \*Emergent Authority (Thẩm quyền phái sinh):\* Quyền giải mã để xuất bản/thương mại hóa \*hoàn toàn không tồn tại sẵn ở trạng thái nghỉ\*. Nó chỉ phái sinh (emerges) khi: Đúng danh tính + Đúng chính sách + 100% đồng tác giả (3/3) cùng xác thực qua TideCloak.



\---



\## 2. KỊCH BẢN NGHIỆP VỤ \& 2 LUỒNG TƯƠNG TÁC ĐỐI LẬP (CORE INTERACTIONS)



Ứng dụng mô phỏng dự án Đồ án Tốt nghiệp (Capstone) của nhóm 3 sinh viên RMIT:

\- 👤 \*Alice (AI Lead)\* — Đồng tác giả (TideCloak Verified).

\- 👤 \*Bob (Data Engineer)\* — Đồng tác giả (TideCloak Verified).

\- 👤 \*Charlie (Rogue Member / Thành viên phản bội)\* — Đồng tác giả (TideCloak Verified).



Dữ liệu tài sản trí tuệ bị khóa trong Vault gồm:

\- 📄 research\_paper\_final.pdf (Bản thảo bài báo khoa học).

\- 💻 brain\_cancer\_model.pth (Trọng số mô hình AI độc quyền).

\- 📊 confidential\_patient\_dataset.csv (Bộ dữ liệu thực nghiệm).



Toàn bộ tài sản này được \*Mã hóa mù (Blind Storage - AES-256-GCM)\*.



\### 🔴 Luồng 1: Kẻ Phản Bội Thử Nghiệm Bán Trộm (The Rogue Attack)

\- \*Hành động:\* Charlie tuyên bố nghỉ nhóm, lén mở app và bấm nút: \*"🚨 Charlie: Attempt Unilateral IP Export (Sell to Company)"`\*\*.

\- \*Kết quả:\* Hệ thống TideCloak chặn đứng tức thì với Popup cảnh báo đỏ:

&#x20; ```json

&#x20; {

&#x20;   "status": 403,

&#x20;   "error": "UNILATERAL\_EXFILTRATION\_BLOCKED",

&#x20;   "message": "Access Denied by TideCloak. Charlie only holds 1 of 3 required co-author authority shards. Master Key does not exist."

&#x20; }

