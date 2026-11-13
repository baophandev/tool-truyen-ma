---
name: asset-management
description: Quy chuẩn quản lý, phát triển và cập nhật asset đồ họa 2D thuần code (Limbo Horror Engine). BẮT BUỘC cập nhật đồng thời GEMINI_DIRECTOR_ASSETS.md, types.ts, placementRules.ts, layoutRouter.ts, EditorView.tsx và asset_manifest.json mỗi khi thêm mới bất kỳ asset nào.
---

# SKILL: QUY TRÌNH PHÁT TRIỂN & CẬP NHẬT ASSET 2D THUẦN CODE
> **Dự án:** 2D Procedural Graphics & Layout Engine (Limbo / Badland Horror Minimalist)  
> **Nguyên tắc bất biến:** Mọi asset thêm mới đều phải được mô tả chi tiết vào file **`GEMINI_DIRECTOR_ASSETS.md`** để mô hình LLM Director đọc hiểu chính xác và điều khiển kịch bản 100% hợp lệ.

---

## 1. NGUYÊN TẮC VÀNG (THE GOLDEN RULE)

> [!IMPORTANT]
> **BẮT BUỘC CẬP NHẬT `GEMINI_DIRECTOR_ASSETS.md` MỖI KHI THÊM ASSET MỚI**  
> Khi tạo mới hoặc sửa đổi bất kỳ asset nào (Công trình, Đạo cụ cảnh, Khung cơ thể nhân vật, Trang phục, Khuôn mặt, Tư thế động tác, Đồ vật cầm tay), bạn **BẮT BUỘC** phải ghi chép ngay vào file `GEMINI_DIRECTOR_ASSETS.md`.  
> Nếu không cập nhật file này, LLM AI bên ngoài sẽ không biết asset tồn tại, sinh ID giả định hoặc sinh sai vị trí neo dẫn tới kịch bản bị bộ Validator từ chối.

---

## 2. MA TRẬN ĐỒNG BỘ 7 ĐIỂM (7-POINT SYNCHRONIZATION CHECKLIST)

Khi thêm bất kỳ asset nào vào Engine, bắt buộc phải hoàn thành tuần tự 7 bước đồng bộ:

```
[1. types.ts] ───────► Khai báo Union Type / Enum định danh
      │
[2. graphics/] ──────► Dựng SVG procedural JSX component thuần code
      │
[3. placementRules] ─► Định nghĩa Slot cho phép (allowedSlots) & lý do ngữ nghĩa
      │
[4. layoutRouter] ───► Đưa vào danh sách VALID_* và hàm validate/normalize
      │
[5. EditorView] ─────► Thêm UI chọn (<option> / nút bấm) trong Studio
      │
[6. GEMINI_DIRECTOR_ASSETS.md] ◄── [BẮT BUỘC] Mô tả ngữ nghĩa, ID, Slot cho LLM
      │
[7. asset_manifest.json] ───────► Cập nhật từ điển JSON cho máy
```

### Chi tiết 7 điểm đồng bộ:

1. **`src/engine/types.ts`**:
   - Khai báo Union Type định danh (ví dụ `StructureId`, `DetailId`, `CharacterBaseId`, `CostumeId`, `CharacterFaceId`, `CharacterPoseId`, `HeldItemId`).
2. **`src/engine/graphics/`**:
   - Dựng hình SVG thuần code trong component tương ứng (`Structures.tsx`, `Details.tsx`, `CharacterRig.tsx`, `HandheldItems.tsx`, `Environments.tsx`).
   - Tuyệt đối không dùng ảnh PNG/JPG bên ngoài.
   - Vật thể tiếp đất phải neo gốc tại `[bottom-center]` (`[0, 0]` trên Ground Line `Y = 800px`).
   - Đồ vật cầm tay phải neo cán cầm tại `[0, 0]` (Hand Socket lòng bàn tay).
3. **`src/engine/placementRules.ts`**:
   - Đăng ký quy tắc vị trí vào `STRUCTURE_RULES`, `DETAIL_RULES` hoặc `getAllowedSlotsForActor`.
   - Nêu rõ các slot được phép đứng và lý do mỹ thuật (ví dụ cây to chỉ ở rìa, mộ ở giữa, quạ đậu khắp nơi).
4. **`src/engine/layoutRouter.ts`**:
   - Thêm ID vào các mảng kiểm tra `VALID_STRUCTURES`, `VALID_DETAILS`, `VALID_BASES`, `VALID_COSTUMES`, `VALID_FACES`, `VALID_POSES`, `VALID_HELD_ITEMS`.
   - Cập nhật hàm `validateDirectorScript` và logic sao chép trong `normalized` để script chứa asset mới không bị validator loại bỏ.
5. **`src/components/EditorView.tsx`**:
   - Thêm `<option>` vào các dropdown tương ứng trong tab Nhân Vật, Công Trình hoặc Chi Tiết để người dùng có thể chọn và kéo thả trực tiếp trên giao diện Studio.
6. **`GEMINI_DIRECTOR_ASSETS.md` (Trọng tâm của Skill)**:
   - Thêm bảng hoặc mục mô tả rõ:
     - `Asset ID`: Tên định danh chính xác bằng tiếng Anh viết thường (snake_case).
     - `Tên tiếng Việt`: Tên hiển thị dễ hiểu.
     - `Vai trò ngữ nghĩa (Semantic Role)`: Giải thích cảm xúc, ý nghĩa rùng rợn của vật thể trong phim kinh dị bóng đen.
     - `Slot được phép`: Liệt kê danh sách slot hợp lệ.
     - `Cấu trúc JSON mẫu`: Đoạn JSON script mẫu để LLM học theo.
7. **`public/asset_manifest.json`**:
   - Thêm node cấu hình vào file manifest chuẩn phục vụ các công cụ parsing tự động.

---

## 3. TIÊU CHUẨN THIẾT KẾ ĐỒ HỌA THUẦN CODE (GRAPHICS SPECS)

- **Độ phân giải chuẩn:** ViewBox `0 0 1920 1080` (16:9).
- **Trục mặt đất chính:** `Y = 800px`. Mọi vật thể đứng trên đất có gốc tọa độ `[bottom-center]`.
- **Hệ màu Silhouette Limbo:**
  - Bóng đen: `#0A0A0C` - `#141419`
  - Đỏ máu: `#991B1B`, `#DC2626`
  - Vàng bùa / Lửa ma: `#FACC15`, `#D4AF37`, `#10B981`
  - Trắng đục sương mù: `#E2E8F0`
- **Hand Socket:** Điểm neo `[0, 0]` gắn vào bàn tay của `CharacterRig` (`ArmsRig.tsx`), hỗ trợ `heldHand: "right"` (tay trước) hoặc `"left"` (tay sau).

---

## 4. QUY TRÌNH NGHIỆM THU (VERIFICATION)

Sau khi hoàn tất cả 7 bước trên, bắt buộc phải:
1. Chạy lệnh:
   ```powershell
   npm run build
   ```
   Đảm bảo lệnh biên dịch TypeScript và Vite kết thúc với mã `exit code 0` (zero error).
2. Kiểm tra `GEMINI_DIRECTOR_ASSETS.md` đã có đầy đủ thông tin asset mới, không bị sót ID nào.

