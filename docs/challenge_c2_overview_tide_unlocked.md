# 🔐 RMIT HACKATHON 2026 — CHALLENGE C2: UNLOCKED (Sponsored by Tide)

- **Diễn giả:** Ben Waters (Co-founder of Tide & Cựu sinh viên RMIT University)
- **Đơn vị tài trợ thử thách (Challenge Sponsor):** Tide (`tide.org`)
- **Video giới thiệu (Launch Video):** [https://www.youtube.com/watch?v=gHlev6-kB3I](https://www.youtube.com/watch?v=gHlev6-kB3I)
- **Cổng thông tin & Hướng dẫn chính thức:** [https://tide.org/unlocked](https://tide.org/unlocked)

---

## 1. Bối cảnh & Vấn đề cốt lõi (Problem Statement)
- **Thực trạng mất an toàn thông tin:** Các vụ rò rỉ dữ liệu, đánh cắp danh tính và tấn công làm tê liệt dịch vụ ngày càng gia tăng. Một khi thông tin cá nhân bị lộ, nó không bao giờ có thể lấy lại sự riêng tư ban đầu.
- **Sự khuếch đại từ AI:**
  - Kẻ tấn công dùng AI để tấn công nhanh hơn và tinh vi hơn.
  - Ở chiều ngược lại, người dùng và tổ chức đang kết nối các **AI Agents** vào thông tin cá nhân, tài khoản và hệ thống cốt lõi, giao cho chúng những tác vụ ngày càng nhạy cảm và hệ trọng.
- **Chi phí cơ hội:** Việc dồn quá nhiều nguồn lực vào kiểm tra, vá lỗi và giám sát khiến chúng ta đánh mất cơ hội xây dựng những ý tưởng táo bạo, không dám khai thác dữ liệu nhạy cảm hoặc bỏ lỡ các sự hợp tác giá trị vì sợ rủi ro bảo mật.

---

## 2. Công nghệ cốt lõi: Emergent Authority & TideCloak

### 🔹 Khái niệm "Emergent Authority" (Quyền hạn phân tán tự hợp)
Trong các hệ thống số truyền thống, luôn có một cá nhân, máy chủ hoặc tổ chức nắm giữ quyền năng tối cao ("Authority" / Master Key) để định danh người dùng, mở khóa dữ liệu hoặc phê duyệt hành động. Nếu điểm tập trung này bị xâm phạm, toàn bộ hệ thống sụp đổ.

**Cách tiếp cận của Tide (Emergent Authority):**
1. **Không có Master Key tập trung:** Thay vì giao chìa khóa tổng cho một người gác cổng (guardian) duy nhất, quyền hạn chỉ được hình thành khi thực sự cần thiết thông qua nhiều **Independent Guardians** (các nút bảo vệ độc lập) cùng phối hợp.
2. **Phân mảnh khóa (Key Fragments):** Nhiều Guardian độc lập giữ các mảnh khóa khác nhau.
3. **Cơ chế xác thực đa bên:** Khi có yêu cầu, từng Guardian sẽ kiểm tra:
   - Ai đang yêu cầu (*Who's asking*)?
   - Hành động nào được yêu cầu (*What action is requested*)?
   - Quyền hạn có cho phép thực hiện không (*Whether permissions allow it*)?
4. **Thực thi mật mã học:** Mỗi Guardian thực hiện phần tính toán mật mã của riêng mình. Chỉ khi tập hợp đủ số lượng đóng góp hợp lệ (threshold), kết quả được cấp phép mới được tạo ra.
5. **An toàn mặc định (Secured by Default):** Việc chiếm quyền điều khiển (compromise) một Guardian đơn lẻ không đủ để mở khóa toàn bộ dữ liệu mà nó bảo vệ.

### 🔹 Công cụ bắt buộc: TideCloak & Tide MCP
- **TideCloak:** Nền tảng tích hợp cơ chế *Emergent Authority* trực tiếp vào ứng dụng của bạn, xử lý trọn gói:
  - Đăng nhập (Sign-in / Authentication)
  - Quản lý quyền truy cập người dùng (User Access)
  - Bảo vệ dữ liệu (Data Protection)
- **Tích hợp nhanh bằng AI Coding Agent (Vibe Coding):**
  - Kết nối **Tide's MCP (Model Context Protocol)** vào AI Coding Agent mà team bạn đang dùng (như Antigravity, Cursor, Claude Code...) để Agent tự động xử lý toàn bộ phần tích hợp TideCloak vào ứng dụng.

---

## 3. Gợi ý các hướng ý tưởng (Suggested Use Cases)
Tide gợi mở 3 hướng tiếp cận lớn mà bạn có thể chọn để giải quyết:
1. **Ủy quyền an toàn cho AI Agents:** Làm thế nào để một AI Agent có thể thay bạn xử lý nhiều công việc hàng ngày hơn với quyền hạn chỉ được cấp chính xác cho từng tác vụ cụ thể (*specific tasks*), thay vì trao quyền truy cập rộng khắp (*broad access*) vào mọi thứ?
2. **Chia sẻ dữ liệu nhạy cảm cho Nghiên cứu (Privacy-Preserving Research):** Làm thế nào để người dân có thể đóng góp thông tin nhạy cảm (y tế, tài chính, cá nhân...) cho các nghiên cứu khoa học mà vẫn giữ toàn quyền kiểm soát việc dữ liệu đó được phép sử dụng vào mục đích gì?
3. **Chia sẻ tài nguyên cộng đồng phi tập trung:** Làm thế nào để một cộng đồng cùng chia sẻ các tài nguyên giá trị mà không cần giao quyền kiểm soát toàn bộ hệ thống cho một cá nhân hay một công ty duy nhất?

---

## 4. Nhiệm vụ & Yêu cầu nộp bài (Deliverables & Submission)

### 🛠️ Nhiệm vụ (Your Task)
Xây dựng một **Working Proof of Concept (PoC)** (ứng dụng mẫu hoạt động được) thể hiện rõ ý tưởng của team trong thực tế và **bắt buộc có sử dụng TideCloak**.

### 📦 Quy cách nộp bài (Submission Checklist)
1. **Public GitHub Repository:**
   - Nộp đường link dẫn tới **Public GitHub Repo** của dự án.
   - Có file **`README.md`** mô tả chi tiết bài toán, ý tưởng giải pháp, kiến trúc tích hợp TideCloak và hướng dẫn chạy dự án.
2. **Video Demo (Tối đa 2 phút):**
   - Một **2-minute demo video** trình diễn sản phẩm thực tế đang chạy.
3. **Tài liệu & Hướng dẫn chi tiết:**
   - Truy cập **[tide.org/unlocked](https://tide.org/unlocked)** để xem:
     - Tiêu chí chấm điểm chi tiết (*Judging Criteria*)
     - Cổng nộp bài & Hạn chót (*Submission Instructions & Deadlines*)
     - Video hướng dẫn thực hành của Sasha (*Sasha's Practical Walkthrough*)

---

## 5. Bản chép lời đầy đủ (Full Video Transcript With Timestamps)
- **[0:00 - 0:20]** You've seen the headlines. Another organisation breached. Personal information exposed. Or services brought to a standstill. Behind every headline are people like you facing stolen identities and personal information that can never be made private again. And AI is compounding the challenge. AI helps attackers work faster and makes their attacks more convincing.
- **[0:20 - 0:44]** But at the same time, we're connecting AI agents to our information, our accounts and our systems asking them to do increasingly consequential things. We spend so much time and energy locking our systems down, checking, patching and monitoring. There's another cost too. We lose opportunities. The things we decide are too risky to build. The information we never use or the collaboration that never happens.
- **[0:44 - 1:07]** What if systems were secured by default so we could put more of our energy into what becomes possible? Hi. I'm Ben Waters, co-founder of Tide and a graduate of RMIT University. We've been collaborating with RMIT for years on the research to solve this problem. Today, we're inviting you to explore what that approach could make possible. Welcome to UNLOCKED.
- **[1:07 - 1:41]** To make this possible, we need to rethink where control actually comes from. In most digital systems, someone or something ultimately holds the power to identify you, unlock information or approve an action. We call that power authority. But what if that authority didn't have to belong to any one system or organisation? At Tide, we've developed an approach called Emergent Authority. Instead of one guardian holding the power to act, authority comes together only when it's needed through multiple independent guardians working together to perform an authorised action.
- **[1:41 - 2:14]** Here's how it works. Rather than trusting one guardian with a master key, multiple guardians hold key fragments. They check who's asking, what action is requested, and whether the permissions allow it. Each performs their part of the cryptographic operation and only when enough valid contributions are available can they produce the permitted result. The power needed for an action can be exercised without giving any one participant a master key. Compromising one guardian alone is no longer enough to unlock everything it protects. Now think about what that could enable.
- **[2:14 - 2:36]** Could an AI agent take care of more of your everyday life with permission to perform specific tasks instead of broad access to everything? Could people contribute sensitive information to research while retaining control over its authorised use? Or could a community share valuable resources without giving one person or company control over the whole system? What would you change in the world?
- **[2:36 - 3:05]** Your task is to build a working proof of concept that shows your idea in action using TideCloak. TideCloak brings Emergent Authority into your app, handling sign-in, user access and data protection so you can focus on the problem you're solving. Connect Tide's MCP to your preferred coding agent and let the agent handle the TideCloak integration. And when you're done, submit a link to your public GitHub repo with a README describing your project and a two-minute demo video.
- **[3:05 - 3:23]** For now, head to `tide.org/unlocked` or scan the code on the screen. You'll find the judging criteria, submission instructions, deadlines and help, including Sasha's practical walkthrough. Today, you get to explore what else we could build when a secure foundation is available. Best of luck, we can't wait to see what you build.