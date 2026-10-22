# 🛠️ CHALLENGE C2 WALKTHROUGH: TỪ Ý TƯỞNG ĐẾN WORKING DEMO VỚI TIDECLOAK & MCP

- **Video gốc:** [Sasha's Practical Walkthrough (Challenge C2)](https://www.youtube.com/watch?v=z0o-B3258Cg)
- **Người hướng dẫn:** Sasha (Tide Team)
- **Cổng thông tin & Công cụ:** [https://tide.org/unlocked](https://tide.org/unlocked)
- **MCP Server URL:** `mcp.tide.org/mcp`
- **Dự án mẫu trong video:** **CreatorVault** (Nền tảng đăng ký nội dung cho Creator không cần đặt niềm tin vào bên thứ ba / Zero-trust Creator Platform).

---

## 🎯 1. Tư duy cốt lõi để thắng giải Challenge C2 (The Core Pattern)

Sasha đúc kết công thức chung cho mọi đội thi ở Challenge C2:
1. **Chọn một hệ thống quen thuộc hiện nay** (ví dụ: nền tảng mạng xã hội/subscription như YouTube, Patreon, hệ thống chia sẻ tài liệu y tế, quản lý quỹ cộng đồng...).
2. **Đặt câu hỏi mấu chốt:** *"Ở điểm nào hệ thống này vẫn đang bắt người dùng phải nhắm mắt tin tưởng (blindly trust) vào nhà vận hành (Operator/Admin)?"*
3. **Loại bỏ điểm phải tin tưởng đó bằng TideCloak:** Thiết kế lại để nội dung được mã hóa trước khi lưu trữ, chỉ mở khóa khi đúng người dùng có quyền (entitlement) được cấp phát thông qua chữ ký phê duyệt, và **ngay cả Admin/Server vận hành cũng chỉ thấy bản mã (ciphertext)**.
4. **Thể hiện rõ trong 1 khoảnh khắc Demo (One Strong Demo Moment):** Dùng dữ liệu giả lập (synthetic data), giữ quy mô ứng dụng nhỏ gọn và tập trung làm nổi bật khoảnh khắc chứng minh *"Operator/Attacker không thể tự mở khóa dữ liệu"*.

---

## 💡 2. Case Study Mẫu: Dự án "CreatorVault"

### Vấn đề của các nền tảng hiện tại (YouTube / TikTok / Patreon)
- Nội dung trả phí (Premium) thường chỉ được bảo vệ bằng một đường link ẩn hoặc một cờ (flag) trong Database.
- **Rủi ro niềm tin:** Bản thân nền tảng (Platform Operator) có toàn quyền mở xem nội dung của mọi Creator bất cứ lúc nào, hoặc âm thầm cấp quyền cho bên thứ ba (như các công ty quảng cáo), hay một Admin bị hack có thể lấy toàn bộ dữ liệu gốc (plaintext).

### Giải pháp tái thiết kế với TideCloak (CreatorVault)
1. **Mã hóa đầu cuối phía Client:** Bài viết và file dành riêng cho Subscriber được mã hóa ngay trên trình duyệt của Creator (Nova) trước khi tải lên. Server chỉ lưu trữ **Ciphertext**.
2. **Phân mảnh & Thủy vân số cá nhân hóa (Individualized A/B Watermarking):**
   - Mỗi bức ảnh/file chất lượng cao được cắt thành **4 mảnh (strips)**.
   - Mỗi mảnh được tạo ra **2 phiên bản A và B** có gắn dấu thủy vân ẩn (invisible marks) khác nhau.
   - Mỗi mảnh A/B được mã hóa bằng một khóa **AES riêng biệt**, và chính khóa AES đó được bọc (wrapped) 2 lớp bởi mạng lưới Tide: một lớp cho quyền *"Đã mua file này"* và một lớp cho *"Mẫu vân tay (Fingerprint) của riêng Subscriber đó"* (ví dụ: `ABBA`).
3. **Truy vết rò rỉ (Leak Attribution) & Thu hồi quyền (Revocation):**
   - Nếu người mua (Alex) tải ảnh về rồi đem phát tán lậu lên mạng, Creator (Nova) chỉ cần tải bức ảnh bị lộ đó vào công cụ **Leak Trace**.
   - Hệ thống đọc mẫu ghép `ABBA` trên ảnh, chỉ đích danh bản sao đó thuộc về **Alex**, và Nova lập tức thu hồi (Revoke) quyền truy cập của Alex thông qua chữ ký Tide.

---

## 🚀 3. Quy trình 6 Bước Thực Chiến (Step-by-Step Workflow)

### Bước 1: Kiểm tra chéo ý tưởng với Hackbot (01:32 – 04:22)
Trước khi bắt tay vào viết code, hãy truy cập phần **Idea Section** tại `tide.org/unlocked` để dùng **Hackbot** (hoặc bất kỳ AI nào bạn muốn) nhằm "phản biện" ý tưởng.

**Prompt mẫu để hỏi Hackbot:**
> *"Here's my idea for UNLOCKED: [Tên dự án] — [Mô tả ngắn gọn cách hệ thống hoạt động và cách mã hóa quyền truy cập]. Review it: Where would people still have to trust the system? What's the strongest demo moment? And what am I missing?"*

**Những điểm vàng cần rút ra từ phản hồi của Hackbot:**
- Đừng biến ứng dụng thành một trang web thu phí thông thường chỉ gắn thêm tính năng đăng nhập. Phải nhấn mạnh câu chuyện **"Why TideCloak matters"**: Nền tảng không còn là kẻ trung gian nắm giữ toàn bộ dữ liệu gốc.
- Trong file `README.md`, phải ghi rõ: **"The operator cannot open the content"** (Nhà vận hành không thể mở được nội dung), chứ không chỉ dừng ở mức *"Người dùng cần đăng nhập"*.

---

### Bước 2: Kết nối Tide MCP vào Coding Agent (04:31 – 05:35)
Bạn không cần tự code tay phần tích hợp mật mã của Tide. Hãy kết nối **Tide MCP** vào AI Coding Agent của bạn (Claude Code, Cursor, Antigravity...).

1. Vào trang `tide.org/unlocked` $\rightarrow$ mục **Start Building** $\rightarrow$ bấm **Connect your coding agent**.
2. Thêm địa chỉ MCP Server: `mcp.tide.org/mcp` vào cấu hình Agent.
3. **QUAN TRỌNG:** Khởi động một **Session mới (New Chat/Session)** trong Agent để MCP được nạp vào bộ nhớ.
4. Kiểm tra bằng câu lệnh:
   ```text
   Is the MCP server at mcp.tide.org/mcp loaded into session? List its tools.
   ```
   *(Chỉ khi Agent liệt kê ra danh sách các công cụ của Tide thì mới bắt đầu làm bước tiếp theo).*

---

### Bước 3: Kiểm tra tính khả thi kỹ thuật qua Tide MCP (05:36 – 07:31)
Tide liên tục cập nhật các bản vá, vì vậy hãy yêu cầu Agent dùng công cụ của Tide MCP để kiểm tra xem ý tưởng của bạn có phần nào TideCloak hỗ trợ sẵn (built-in) và phần nào cần tự code (custom work).

**Prompt mẫu:**
```text
Using the Tide MCP, check whether this idea works with TideCloak today: [Mô tả ý tưởng của bạn].
Which parts are built-in? Which need custom work? And what would you change?
```

**Bài học kiến trúc quan trọng từ kết quả kiểm tra:**
- **Những gì TideCloak hỗ trợ sẵn (Built-in):** Xác thực không mật khẩu, phân quyền theo vai trò/đăng ký (Role/Subscription access), mã hóa/giải mã dữ liệu dựa trên chính sách (Policy).
- **Những gì cần Custom Work (Nằm ngoài Tide):** Logic chia cắt file, gắn watermark A/B và thuật toán dò tìm ảnh rò rỉ (Leak tracing).
- **Mẹo tối ưu hóa kiến trúc (Best Practice):** **Hãy dùng Tide để mã hóa các khóa (AES Keys), đừng mã hóa trực tiếp cả file video/ảnh nặng bằng Tide.** Mã hóa từng phân đoạn file bằng khóa AES, sau đó dùng Tide để bọc (protect) các khóa AES đó.

---

### Bước 4: Ra lệnh cho Coding Agent dựng ứng dụng & Cấu hình Realm (07:32 – 09:18)

**Prompt khởi tạo ứng dụng:**
```text
Build [Tên App]. [Mô tả các tính năng chính]. Use mocked subscriptions/payments and synthetic data.
[Dán kèm bản thiết kế chi tiết đã được Hackbot và MCP tinh chỉnh ở Bước 1 & 3].
```

**Các câu hỏi cấu hình bắt buộc mà Agent sẽ hỏi bạn khi tạo TideCloak Realm:**
1. **Email quản lý License của Tide:** Phải nhập một địa chỉ email thật mà bạn đang kiểm soát.
2. **Đồng ý Điều khoản dịch vụ (Terms & Conditions tại `https://tide.org`):** Bạn phải tự trả lời `Yes, I agree` (Agent không được phép tự đồng ý thay bạn).
3. **Nơi chạy TideCloak:** Chọn chạy **Locally** (`localhost:8080` cho TideCloak, và ứng dụng web thường ở `localhost:3000`). *Lưu ý: Một Realm sau khi tạo sẽ không thể chuyển đổi qua lại giữa Local và Cloud.*
4. **Liên kết tài khoản Tide đầu tiên (Bootstrap):** Agent sẽ xuất ra một đường link trên Terminal. Bạn phải mở link đó trên trình duyệt thật (Chrome/Edge) để tạo và liên kết tài khoản Admin/Creator đầu tiên thì script cài đặt mới chạy tiếp được.

---

### Bước 5: Cấu hình bật Đăng ký người dùng (User Registration) trên TideCloak (14:42 – 16:05)
Khi bạn mở trình duyệt ẩn danh để đóng vai người dùng thứ hai (Subscriber - Alex) tạo tài khoản mới, mặc định TideCloak có thể đang tắt tính năng cho phép người dùng tự đăng ký. Cách bật như sau:

1. Hỏi Coding Agent: *"What is the master account username and password for my TideCloak instance at localhost:8080?"*
2. Mở trình duyệt vào `http://localhost:8080` $\rightarrow$ Đăng nhập bằng tài khoản `admin` và mật khẩu Agent cung cấp.
3. Chọn Realm của dự án (ví dụ: `CreatorVault`) $\rightarrow$ vào **Realm Settings / Advanced Settings** $\rightarrow$ tab **Login**.
4. Bật công tắc **User registration** (Cho phép người dùng mới tạo tài khoản) $\rightarrow$ bấm **Save**.
5. **Bước bắt buộc của TideCloak:** Vào mục **Change Requests / Approvals (QEA Approvals)** ở menu bên trái $\rightarrow$ tích chọn cả 2 yêu cầu thay đổi cài đặt vừa tạo $\rightarrow$ bấm **Approve** và **Submit Approvals** để chính thức áp dụng.

---

### Bước 6: Kịch bản chạy Demo chuẩn chỉnh (The Winning Demo Flow) (10:23 – 21:55)
Để quay video demo 2 phút thuyết phục nhất, hãy bố trí 2 cửa sổ trình duyệt (1 cửa sổ cho **Creator/Owner**, 1 cửa sổ ẩn danh cho **Subscriber/User**) và trình diễn 6 phân cảnh sau:

1. **Creator khởi tạo & Ký chính sách (Sign Policies):**
   - Creator đăng nhập qua Tide Enclave (không mật khẩu nào lưu trên app).
   - Vào Studio bấm **Sign all policies** $\rightarrow$ Cửa sổ pop-up của Tide hiện lên $\rightarrow$ Bấm **Approve All**.
   - Bấm **Encrypt & Publish** để mã hóa các bài viết/file ngay trên trình duyệt trước khi gửi lên server.
2. **Subscriber đăng ký & Mua quyền truy cập:**
   - Subscriber (Alex) tạo tài khoản mới, bấm Subscribe/Buy (dùng thanh toán giả lập - Mock checkout).
   - Trạng thái hiện: *"Awaiting Creator's signature"* kèm mã định danh được cấp riêng (ví dụ: `ABBA`).
3. **Creator phê duyệt quyền (Grant Approval) & Subscriber mở khóa:**
   - Creator vào mục **Approvals**, ký duyệt yêu cầu mua của Alex bằng Tide Enclave.
   - Alex làm mới phiên (Refresh access) và bấm **Unlock with Tide** để ghép các mảnh ảnh theo đúng mẫu `ABBA` và tải về.
4. **Màn 1 — Chặn tấn công giải mã trái phép (The Attack Demo):**
   - Giả sử Server bị lộ hoặc giao toàn bộ các bản mã và khóa đã bọc cho Alex, và Alex cố tình bấm **"Try to open someone else's variant"** (mở mảnh ảnh không thuộc mẫu `ABBA` của mình).
   - Mạng lưới các nút của Tide (ORKs) lập tức từ chối (`Got 0 out of 14 required / 20 of 20 failed`).
5. **Màn 2 — Truy vết kẻ làm lộ dữ liệu & Thu hồi quyền (Leak Trace & Revoke):**
   - Creator tải bức ảnh bị phát tán lậu lên mục **Leak Trace** $\rightarrow$ Hệ thống chỉ ra mẫu `ABBA` thuộc về **Alex**.
   - Creator bấm **Revoke** quyền của Alex và ký xác nhận trên Tide $\rightarrow$ Ở lần làm mới tiếp theo, Alex hoàn toàn mất quyền mở file đó.
6. **Màn 3 — Góc nhìn của Nhà vận hành / Hacker (What the Operator Sees):**
   - Mở trang **Operator View** để cho Giám khảo thấy: Toàn bộ Database trên server chỉ chứa các chuỗi mã hóa (Ciphertext) vô nghĩa.
   - Nếu một Admin độc hại hoặc Hacker chiếm quyền server và tự ý chèn lệnh cấp quyền miễn phí (Free Grant) cho một tài khoản, hệ thống cũng **chặn đứng** vì lệnh đó bị đẩy vào hàng đợi bắt buộc phải có chữ ký số từ khóa riêng của Creator.

---

## ⚠️ 4. Tổng hợp 10 Lỗi Kỹ Thuật Thường Gặp & Cách Xử Lý (Sasha's Gotchas)

Đây là danh sách 10 bẫy kỹ thuật được Sasha nhấn mạnh ở cuối video (22:40 – 24:25) mà các đội rất dễ vấp phải khi dùng AI Agent tích hợp TideCloak:

| # | Vấn đề / Lỗi thường gặp | Nguyên nhân | Cách khắc phục triệt để |
| :--- | :--- | :--- | :--- |
| **1** | **Không thấy công cụ Tide trong Agent** | Hầu hết các Coding Agent chỉ nạp MCP Server khi khởi tạo phiên mới. | Sau khi thêm `mcp.tide.org/mcp`, bắt buộc phải **mở một Session/Chat mới** rồi yêu cầu Agent liệt kê các tool của Tide. |
| **2** | **Model AI tự ý nhảy cóc qua các bước** | Các model nhỏ hoặc yếu thường bỏ qua hướng dẫn của MCP và tự viết code đại. | Nhắc rõ trong prompt: *"Follow Tide's playbook step by step and check that it works after each step."* |
| **3** | **Bấm Đăng nhập hoặc Ký duyệt bị đứng im, không báo lỗi** | Trình duyệt chặn cửa sổ **Pop-up** của Tide Enclave, hoặc bạn đang mở web bằng **VS Code Built-in Browser** (không hỗ trợ hidden frame của Tide). | Luôn mở ứng dụng trên **trình duyệt chuẩn bên ngoài (Chrome/Edge/Brave)** và chọn **Always allow pop-ups** cho cả `localhost:3000` và `localhost:8080`. |
| **4** | **Cố gắng đăng nhập tự động qua CLI / Headless** | Tide bắt buộc phải có người thật đăng nhập và ký trên trình duyệt để bảo mật. Không có chế độ đăng nhập ngầm qua dòng lệnh. | Nếu ứng dụng có Bot hoặc Background Job, vẫn phải thiết kế bước để người dùng thật đăng nhập và cấp quyền trên trình duyệt trước. |
| **5** | **Gọi API lên Server liên tục bị lỗi `401 Unauthorized`** | Code Frontend dùng hàm `fetch()` mặc định của trình duyệt thay vì hàm của Tide SDK. | Bắt buộc mọi lời gọi API về server nội bộ phải đi qua **`secureFetch` của Tide SDK** (không dùng plain `fetch`). |
| **6** | **Backend từ chối mọi Token dù đã đăng nhập đúng** | Tide ký các chuỗi JWT Token bằng thuật toán **`EdDSA`**. Nhiều thư viện phổ biến (như `jsonwebtoken` mặc định trên Node.js) không hỗ trợ xác thực `EdDSA`. | Kiểm tra ngay thư viện giải mã token ở Backend (dùng thư viện hỗ trợ `EdDSA` như `jose` hoặc hàm verify chuẩn trong Tide SDK). |
| **7** | **Chỉ ẩn nút bấm trên giao diện (UI Security)** | Ẩn nút bấm trên Frontend không phải là bảo mật. | Backend Server bắt buộc phải kiểm tra **Role / Entitlement** trong Token ở mỗi Request gửi lên. |
| **8** | **Agent tự ý "tối ưu hóa" làm hỏng trang đăng nhập** | Agent sửa đổi nội dung các file helper nguyên bản của Tide (như trang `sign-in helper page`). | Dặn Agent: **Tuyệt đối copy nguyên vẹn 100%** các file helper của Tide, không được tự ý viết lại hay rút gọn. |
| **9** | **Tài khoản mới không có Tên hoặc Email** | Tài khoản Tide mặc định khởi tạo ẩn danh (không chứa sẵn tên hay email). Đừng để Agent tự bịa ra các email giả (placeholder emails). | Nếu ứng dụng cần hiển thị tên người dùng, hãy thêm một biểu mẫu nhỏ (Short Form) hỏi Display Name ngay sau lần đăng nhập đầu tiên. |
| **10** | **Thu hồi quyền (Revoke) hoặc Cấp quyền mới nhưng chưa thấy tác dụng ngay / Lỗi kẹt đăng nhập** | Quyền truy cập gắn với Token của phiên hiện tại; hoặc trình duyệt lưu cache phiên cũ gây xung đột khi đổi tài khoản. | Để áp dụng quyền mới/thu hồi ngay lập tức, hãy bấm **Sign out rồi Sign in lại** (hoặc mở `DevTools -> Application -> Storage -> Clear site data` rồi tải lại trang). |

---

## 📌 5. Ghi chú về Giới hạn Thực tế (Đưa vào phần Reflection / Q&A)
Nếu trình bày trong `README.md` hoặc video demo, việc nêu rõ nhận thức về giới hạn bảo mật sẽ giúp team ghi điểm rất cao với Ban Giám khảo:
- **Thu hồi quyền (Revocation)** chỉ chặn các lượt giải mã trong tương lai; nó không thể thu hồi lại file mà người dùng đã tải về hoặc chụp màn hình từ trước.
- **Truy vết thủy vân (Watermarking/Tracing)** trên ảnh và video rất bền vững (ngay cả khi dùng điện thoại quay lại màn hình), nhưng với văn bản thuần túy (plain text) thì người đọc có thể gõ lại bằng tay. Ngoài ra, nếu nhiều người mua thông đồng ghép các mảnh của nhau lại thì có thể làm mờ mẫu nhận dạng — do đó cần tính đến bài toán thông đồng (colluding subscribers) khi thiết kế số lượng phân đoạn.