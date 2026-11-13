# QUY TẮC PHÁT TRIỂN DỰ ÁN (PROJECT RULES & GUIDELINES)

## 1. NGUYÊN TẮC BẮT BUỘC KHI THÊM HOẶC CHỈNH SỬA ASSET
Mỗi khi thêm mới hoặc chỉnh sửa bất kỳ asset nào (Công trình, Đạo cụ cảnh, Khung cơ thể nhân vật, Trang phục, Khuôn mặt, Tư thế, Đồ vật cầm tay), **BẮT BUỘC PHẢI THỰC HIỆN CẬP NHẬT ĐỒNG THỜI VÀO CÁC TỆP SAU**:

1. **`GEMINI_DIRECTOR_ASSETS.md`** *(BẮT BUỘC)*:
   - Cập nhật tài liệu này với đầy đủ: ID chuẩn, Tên tiếng Việt, Vai trò ngữ nghĩa, Slot cho phép và JSON mẫu để LLM Director bên ngoài đọc hiểu và sinh kịch bản đúng 100%.
2. **`src/engine/types.ts`**: Khai báo Union Type / Enum tương ứng.
3. **`src/engine/graphics/`**: Dựng hình bằng procedural SVG JSX thuần code (100% pure code, không dùng ảnh PNG/JPG ngoài).
4. **`src/engine/placementRules.ts`**: Định nghĩa quy tắc vùng cho phép (`allowedSlots`) và lý do ngữ nghĩa.
5. **`src/engine/layoutRouter.ts`**: Đưa vào mảng `VALID_*` tương ứng và cập nhật hàm `validateDirectorScript` để script chứa asset mới hợp lệ.
6. **`src/components/EditorView.tsx`**: Bổ sung lựa chọn vào dropdown của Studio để người dùng chọn và kéo thả được.
7. **`public/asset_manifest.json`**: Cập nhật từ điển JSON cho máy.

Tham khảo chi tiết quy trình chuẩn 7 bước trong Skill: [`.agents/skills/asset-management/SKILL.md`](.agents/skills/asset-management/SKILL.md).

---

## 2. QUY CHUẨN KỸ THUẬT GRAPHICS & LAYOUT
- **ViewBox cố định:** `1920 x 1080` (16:9).
- **Trục mặt đất chuẩn:** `Y = 800px`. Điểm neo tiếp đất là `[bottom-center]` (`[0, 0]` trên Ground Line `Y = 800px`).
- **Hand Socket chuẩn:** Đồ vật cầm tay neo tại cán cầm `[0, 0]` (tâm lòng bàn tay của nhân vật), đồng bộ chuyển động và hướng nhìn (`facing: left | right`).
- **Phong cách đồ họa:** Silhouette Minimalist Horror (Limbo / Badland / U Linh Kỳ Truyện) với bóng đen `#0A0A0C` - `#141419` và các điểm nhấn trắng sương mù, đỏ máu, vàng bùa, xanh lân tinh.
- **Nghiệm thu:** Luôn chạy `npm run build` (`tsc -b && vite build`) đảm bảo `exit code 0` trước khi hoàn tất công việc.

