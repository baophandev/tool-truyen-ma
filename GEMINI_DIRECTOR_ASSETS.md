# TỪ ĐIỂN TÀI NGUYÊN & HƯỚNG DẪN ĐẠO DIỄN (GEMINI DIRECTOR ASSETS GUIDE)
> **Tài liệu chuẩn dành riêng cho Mô hình Ngôn ngữ Lớn (LLM AI Director)**  
> Dùng để cấp vào Prompt Context, System Instruction hoặc RAG Knowledge Base giúp LLM hiểu 100% ngữ nghĩa kho tài nguyên, tuân thủ nghiêm ngặt hệ tọa độ và sinh kịch bản JSON (`DirectorSceneScript`) hợp lệ tuyệt đối, không bao giờ bị lỗi vị trí hay sai cấu trúc.

---

## 1. NGUYÊN TẮC HỆ THỐNG CỐT LÕI (CORE HARD RULES)

1. **Đồ Họa 100% Thuần Code (React / SVG / CSS Procedural Graphics):**
   - Không sử dụng bất kỳ file ảnh ngoài (PNG, JPG), không dùng URL external, không phụ thuộc AI sinh ảnh bitmap.
   - Toàn bộ nhân vật, công trình, ngọn đồi, bia mộ, đèn lồng đều được render bằng SVG Path, Polygon, Ellipse và CSS gradient.

2. **Khung Hình & Tọa Độ Neo Chuẩn (Viewport & Coordinate System):**
   - **ViewBox cố định:** `1920 x 1080` (Tỷ lệ điện ảnh `16:9`).
   - **Trục Mặt Đất Chuẩn (Ground Plane):** `Y = 800px`.
   - **Gốc neo vật thể tiếp đất (Ground Anchor):** `[bottom-center]` (`X: chính giữa bề ngang, Y: chân tiếp đất tại Y=800px`). Tuyệt đối không làm nhân vật lơ lửng hay chìm dưới đất.
   - **Gốc neo đồ vật cầm tay (Hand Socket):** `[0, 0]` gắn trực tiếp vào tâm lòng bàn tay của nhân vật, tự động xoay và di chuyển theo chuyển động của tay.

3. **Bảng Màu Phong Cách Kinh Dị Bóng Đen Tối Giản (Silhouette Minimalist Horror):**
   - **Bóng đen chủ đạo (Silhouettes):** `#0A0A0C` đến `#141419`.
   - **Điểm nhấn cảm xúc & tâm linh:**
     - Trắng sương / Mắt ma: `#E2E8F0`
     - Đỏ máu / Trăng máu: `#991B1B`, `#DC2626`
     - Vàng bùa chú / Lửa nến: `#FACC15`, `#D4AF37`
     - Lửa ma trơi đầm lầy: `#10B981`, `#06B6D4`

---

## 2. BẢNG TỌA ĐỘ VỊ TRÍ NEO (LAYOUT SLOTS)

Hệ thống cung cấp 8 vị trí neo cố định (5 trên mặt đất, 3 trên không). Ngoài ra hỗ trợ tinh chỉnh tự do theo pixel qua `offsetX`, `offsetY`.

```
========================================================================================
[Y=280..350]   air_left (400, 350)        air_center (960, 280)       air_right (1520, 350)
----------------------------------------------------------------------------------------
[Y=800 Ground] far_left (250)  mid_left (600)  center (960)  mid_right (1320)  far_right (1670)
========================================================================================
```

### 2.1. 5 Điểm Neo Mặt Đất (Ground Slots - `Y = 800px`)
- `"far_left"`: `X = 250px, Y = 800px` (Rìa cực trái sân khấu)
- `"mid_left"`: `X = 600px, Y = 800px` (Nửa bên trái)
- `"center"`: `X = 960px, Y = 800px` (Chính giữa màn hình)
- `"mid_right"`: `X = 1320px, Y = 800px` (Nửa bên phải)
- `"far_right"`: `X = 1670px, Y = 800px` (Rìa cực phải sân khấu)

### 2.2. 3 Điểm Neo Trên Không (Air Slots - Dành riêng cho hồn ma, ma trơi, quạ, dây bùa)
- `"air_left"`: `X = 400px, Y = 350px`
- `"air_center"`: `X = 960px, Y = 280px`
- `"air_right"`: `X = 1520px, Y = 350px`

### 2.3. Quy Tắc Đặt Tự Do Trên Đường Line Mặt Đất (Continuous Ground Line)
- Nhân vật hoặc đạo cụ tiếp đất có thể đứng ở **bất kỳ pixel nào** trong đoạn `X ∈ [80, 1840]` bằng cách gán `slot` gần nhất kèm `offsetX`:
  $$\text{Tọa độ X thực tế} = \text{slot.X} + \text{offsetX}$$
- **Quy tắc bất biến:** Nhân vật tiếp đất (pose mặt đất) **luôn luôn có `offsetY = 0`** để khóa chặt chân trên trục `Y=800px`. Chỉ nhân vật bay (`pose_floating`) hoặc treo cổ (`pose_hanging`) mới dùng `offsetY` trên không.

---

## 3. KHO TÀI NGUYÊN BỐI CẢNH & CÔNG TRÌNH (ENVIRONMENTS & STRUCTURES)

### 3.1. Chủ Đề Bối Cảnh (Themes)
- `"rural_graveyard"`: Bãi tha ma nông thôn (nghĩa địa âm u hoang tàn, bia đá rêu phong, rặng tre ma mị).
- `"abandoned_village"`: Đường làng hoang vắng (con đường đất cô quạnh, lều tranh xiêu vẹo, cây cổ thụ trơ trụi).
- `"cursed_swamp"`: Đầm lầy u minh (vùng nước chết tĩnh mịch, lau sậy khẳng khiu, sương độc ma trơi).
- `"modern_indoor"`: Hành lang & Không gian trong nhà hiện đại (hành lang bệnh viện, sảnh khách sạn u ám, siêu thị bỏ hoang, nhà hàng đêm muộn với trần nhà drop-tile, đèn tuýp huỳnh quang, biển báo EXIT và sàn gạch bóng loáng).

### 3.2. Bầu Trời & Chiếu Sáng (Sky Presets)
- `"blood_moon"`: Trăng Máu U Uất (Gradient đỏ rực `#2B0808` -> `#0D0202`, trăng đỏ quạch khổng lồ).
- `"foggy_night"`: Đêm Sương Lạnh Buốt (Gradient đen tím `#06070B` -> `#141724`, trăng bạc nhợt nhạt).
- `"stormy_dark"`: Bão Đêm Sấm Chớp (Trời dông đen đặc `#030408` -> `#0B0E17`, có thể bật `thunder_flash: true`).
- `"eclipse_abyss"`: Nhật Thực Hắc Ám & Ma Trơi (Trời xanh đen `#021A12` -> `#04090E`, mặt trời đen viền lửa xanh lân tinh).
- `"flickering_fluorescent"`: Đèn Tuýp Huỳnh Quang Chập Chờn (Ánh sáng xanh ngọc lạnh lẽo trong nhà, bóng tuýp chập chờn, biển báo EXIT xanh lục phát sáng).
- `"dim_indoor_night"`: Ánh Vàng Đêm Mờ Ảo (Ánh đèn vàng hổ phách u tịch trong khách sạn / nhà hàng đêm muộn).

### 3.3. 13 Công Trình Môi Trường (Structures) & Quy Tắc Vị Trí Bắt Buộc

Mỗi công trình có kích thước và vai trò thị giác riêng, **chỉ được đặt tại các Slot được phép** sau:

| Asset ID | Tên Tiếng Việt | Vai Trò Ngữ Nghĩa | Slot Cho Phép (`allowed_slots`) |
| :--- | :--- | :--- | :--- |
| `creepy_banyan_tree` | Cây đa cổ thụ cành trơ trụi | Tạo vẻ thê lương, vòm che quái dị ở hai rìa | `["far_left", "far_right"]` |
| `haunted_gallows_tree` | Cây treo cổ rủ cành liễu | Điềm báo tử khí, thòng lọng rủ xuống bìa rừng | `["far_left", "far_right"]` |
| `ancient_tomb` | Ngôi mộ cổ nứt nẻ và bia đá | Tâm điểm hiện tượng dị thường, nơi ma quỷ xuất hiện | `["mid_left", "center", "mid_right"]` |
| `abandoned_shrine` | Miếu hoang cô hồn | Nơi thờ cúng hoang phế, lập lòe hương tàn | `["mid_left", "center", "mid_right"]` |
| `creepy_well` | Giếng cạn oan hồn | Nơi oan hồn ném xác hoặc bò trườn trỗi dậy | `["mid_left", "center", "mid_right"]` |
| `dilapidated_hut` | Căn lều tranh xiêu vẹo | Nơi trú ẩn rách nát, nguồn cơn rùng rợn | `["far_left", "center", "far_right"]` |
| `broken_wooden_bridge` | Cầu gỗ gãy nhịp | Cây cầu bắc qua vùng nước chết, chia cắt không gian | `["far_left", "center", "far_right"]` |
| `scarecrow_of_the_damned`| Bù nhìn rơm bị quỷ ám | Bù nhìn mặt rách rưới dang tay giữa đồng hoang | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `hospital_operating_bed` | Giường mổ bệnh viện rỉ sét | Tâm điểm kinh hoàng bệnh viện, đệm ố vấy máu, cọc truyền và đèn phẫu thuật | `["mid_left", "center", "mid_right"]` |
| `hotel_reception_desk` | Quầy lễ tân khách sạn u ám | Quầy gỗ cổ, chuông dịch vụ bí ẩn, sổ đăng ký khách và giá treo chìa khóa phòng | `["mid_left", "center", "mid_right"]` |
| `supermarket_shelf_aisle`| Dãy kệ hàng siêu thị hoang tàn | Kệ thép cao nhiều tầng chất đầy hàng hóa đổ nát, dây lòng thòng và biển số dãy | `["far_left", "center", "far_right"]` |
| `creepy_elevator_doors` | Cửa thang máy rùng rợn hé mở | Cửa thang máy kim loại hé mở khe đen ngòm, mắt đỏ rực và đèn báo tầng âm 4 | `["mid_left", "center", "mid_right"]` |
| `dining_table_chairs` | Bàn ăn nhà hàng khăn rách | Bàn ăn phủ khăn trải bàn rách rưới, hai ghế tựa cao, chân nến và chai rượu bám bụi | `["mid_left", "center", "mid_right"]` |

---

## 4. KHO ĐẠO CỤ BỐI CẢNH (DETAILS & PROPS)

Đạo cụ đặt trong mảng `details` dùng để tăng chiều sâu và không khí rùng rợn cho cảnh:

| Asset ID | Tên Tiếng Việt | Vai Trò Ngữ Nghĩa | Slot Cho Phép |
| :--- | :--- | :--- | :--- |
| `detail_black_crow` | Quạ đen mắt trắng | Điềm báo xui xẻo, đậu đất hoặc bay liệng trên không | Cả 5 Ground Slots và 3 Air Slots |
| `detail_will_o_wisp` | Đốm ma trơi lân tinh | Ngọn lửa hồn ma lơ lửng hoặc bay là là bãi tha ma | `["air_left", "air_center", "air_right", "mid_left", "center", "mid_right"]` |
| `detail_blood_lantern` | Đèn lồng giấy đỏ rách | Ánh sáng ma mị hắt đỏ một góc cảnh | 5 Ground Slots hoặc `["air_left", "air_right"]` |
| `detail_incense_bowl` | Bát hương tàn & Nến cầu hồn | Khói hương nghi ngút đặt tiếp đất trước mộ hoặc miếu | `["mid_left", "center", "mid_right"]` (Ground only) |
| `detail_skull_pile` | Đống đầu lâu & Xương khô | Tàn tích rùng rợn nằm rải rác trên mặt đất | Cả 5 Ground Slots (Ground only) |
| `detail_hanging_talisman`| Dây bùa trấn yểm | Dây bùa đỏ vàng giăng ngang không trung phong ấn tà ma | `["air_left", "air_center", "air_right"]` (Air only) |
| `detail_iv_drip_stand` | Cột truyền dịch y tế rỉ máu | Cột truyền dịch di động có bánh xe, túi dịch và ống truyền rỉ máu tiếp đất Y=800px | Cả 5 Ground Slots (Ground only) |
| `detail_shopping_cart` | Xe đẩy siêu thị rỉ sét | Xe đẩy kim loại rỉ sét bỏ quên giữa hành lang tiếp đất Y=800px | Cả 5 Ground Slots (Ground only) |
| `detail_surveillance_camera` | Camera an ninh chớp đỏ | Camera giám sát treo trần chớp đèn đỏ liên tục | `["air_left", "air_center", "air_right"]` (Air only) |
| `detail_flickering_ceiling_lamp`| Đèn huỳnh quang trần chập chờn | Đèn tuýp huỳnh quang công nghiệp treo lơ lửng trên trần chập chờn phát sáng | `["air_left", "air_center", "air_right"]` (Air only) |

---

## 5. HỆ THỐNG NHÂN VẬT LẮP GHÉP (CHARACTER RIG ARCHITECTURE)

Mỗi nhân vật được định nghĩa trong mảng `actors` gồm 8 thành phần module:

```
[Actor] ──┬── base (Khung xương cơ thể: 6 loại)
          ├── costume (Bộ trang phục: 8 bộ)
          ├── face (Biểu cảm khuôn mặt: 7 biểu cảm)
          ├── pose (Tư thế động tác: 8 tư thế)
          ├── facing (Hướng nhìn: "left" | "right")
          ├── slot + offsetX + offsetY (Vị trí tọa độ neo)
          ├── heldItem + heldHand (Đồ vật cầm trên tay & chọn tay cầm)
          └── motion (Chuyển động di chuyển từ Điểm A -> Điểm B)
```

### 5.1. 6 Khung Thân Thể Nhân Vật (Character Bases)
- `"male_adult"`: Nam thanh niên (dáng người gầy, bước đi hoang mang, người lữ khách).
- `"female_adult"`: Nữ thanh niên (tà áo buông, mái tóc đen dài rủ bóng).
- `"ghost_wraith"`: Bóng ma oan hồn (không chân, đuôi áo rách dập dềnh bồng bềnh, quầng hào quang ma mị).
- `"creepy_child"`: Đứa trẻ ma (vóc dáng nhỏ bé 0.65x, yếm hoa, vẻ u uất bí hiểm).
- `"jiangshi_corpse"`: Cương thi áo quan (xác chết nhảy búp, mũ quan phong kiến, tay duỗi thẳng phía trước).
- `"demon_shadow"`: Quỷ bóng đen dị hình (vóc dáng to lớn 1.25x, sừng cong nhọn hoắt, móng vuốt, hào quang khói đen).

### 5.2. 11 Bộ Sưu Tập Trang Phục (Costumes)
- `"outfit_tattered_tunic"`: Áo tơi / Áo nông phu nâu đất sờn rách, thắt lưng dây gai.
- `"outfit_flowing_ao_dai"`: Áo dài cổ truyền tà rách ma mị phất phơ trong gió.
- `"outfit_shrouded_cloak"`: Áo choàng trùm đầu tăm tối (Reaper / Kẻ hành hương tà giáo).
- `"outfit_mandarin_court"`: Quan phục triều đình phong kiến, bổ tử trước ngực, chuỗi triều châu.
- `"outfit_monk_cassock"`: Áo cà sa pháp sư / Đạo bào vàng nâu trừ tà, dải lụa chu sa.
- `"outfit_shredded_burial"`: Vải liệm oan hồn / Áo niệm tử thi rách tua tủa vương vệt máu.
- `"outfit_ancient_armor"`: Giáp tướng cổ vỡ nát / Chiến bào tử sĩ trỗi dậy từ chiến trường xưa.
- `"outfit_child_pajamas"`: Yếm hoa đỏ / Đồ trẻ thơ vương vết ố sẫm màu.
- `"outfit_doctor_coat"`: Áo blouse bác sĩ phẫu thuật vạt dài loang lổ vết máu, ống nghe stethoscope và quần scrub tối màu.
- `"outfit_patient_gown"`: Bộ quần áo bệnh nhân sọc xanh nhạt rộng thùng thình, buộc dây sau gáy, vạt áo lấm lem rách rưới.
- `"outfit_modern_casual"`: Áo khoác hoodie hiện đại màu xám đen có khóa kéo, dây rút, quần jean ôm và giày thể thao đế trắng.

### 5.3. 7 Biểu Cảm Khuôn Mặt (Faces - Gắn tại Head Socket -250px)
- `"face_calm"`: Mặt bình thường, mắt đen nhỏ vô hồn, lạnh lẽo.
- `"face_scared"`: Kinh hãi tột cùng, tròng mắt trợn trắng, miệng há hốc run rẩy.
- `"face_creepy_smile"`: Nụ cười ma quái xé toạc dài tới mang tai với hàm răng nhọn.
- `"face_bleeding_eyes"`: Mắt trắng dã chảy hai vệt máu đen rỉ xuống cằm.
- `"face_faceless"`: Mặt trắng trơn vô diện (No-Face), không ngũ quan, cực kỳ bất an.
- `"face_glowing_hollow"`: Hốc mắt và miệng rỗng tuếch rực cháy lửa xanh lân tinh ma trơi.
- `"face_talisman_covered"`: Lá bùa vàng chu sa che kín từ trán xuống miệng, bay phấp phới.

### 5.4. 8 Tư Thế Động Tác (Poses) & Quy Định Vùng Đứng Bắt Buộc

| Pose ID | Tên Tư Thế | Loại Vùng | Quy Định Vị Trí Slot Bắt Buộc |
| :--- | :--- | :--- | :--- |
| `pose_standing` | Đứng quan sát | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) |
| `pose_holding` | Cầm / Giơ đồ vật soi đường | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) |
| `pose_shivering` | Run rẩy co ro sợ hãi | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) |
| `pose_walking` | Bước đi chậm rãi | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) |
| `pose_crawling` | Bò trườn sát mặt đất | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) |
| `pose_reaching` | Vươn móng vuốt bắt hồn | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) |
| `pose_floating` | Bay lơ lửng dập dềnh | Air | **BẮT BUỘC** đặt ở 3 Air Slots (`air_left`, `air_center`, `air_right`) |
| `pose_hanging` | Bị treo cổ lơ lửng rũ đầu | Air | **BẮT BUỘC** đặt ở 3 Air Slots (`air_left`, `air_center`, `air_right`) |

---

## 6. KHO ĐỒ VẬT CẦM TAY & HAND SOCKET (HANDHELD PROPS)

Nhân vật có thể cầm đồ vật trên tay thông qua Hand Socket. Vật phẩm tự động chuyển động đồng bộ theo nhịp bước đi, thở, run rẩy và tự lật hướng khi nhân vật quay trái/phải.

### 6.1. Thuộc tính trên nhân vật:
- `heldItem`: ID đồ vật (chọn từ danh sách bên dưới, hoặc `"none"`).
- `heldHand`: Tay cầm đồ vật:
  - `"right"`: Tay trước (mặc định - tay chính quay về phía người xem).
  - `"left"`: Tay sau.

### 6.2. Danh Mục 12 Đồ Vật Cầm Tay Thuần SVG:
1. `"none"`: Hai tay trống không.
2. `"item_storm_lantern"`: Đèn bão sắt cổ phát sáng vàng ấm soi rọi màn sương (tỏa quầng sáng ấm xung quanh).
3. `"item_paper_lantern"`: Đèn lồng giấy đỏ cầm tay cán trúc, tỏa ánh đỏ ma mị kèm tua rua.
4. `"item_soul_candle"`: Nến cầu hồn sáp chảy đặt trên đĩa đồng, ngọn lửa xanh vàng lập lòe.
5. `"item_peach_wood_sword"`: Kiếm gỗ đào trừ tà của đạo sĩ, khắc ấn chú chu sa và tua chỉ đỏ.
6. `"item_yellow_talisman"`: Lá bùa vàng trấn yểm giơ thẳng tay phía trước xua đuổi tà ma.
7. `"item_rusty_sickle"`: Lưỡi liềm rỉ sét cong vút, mũi liềm vương vệt máu tươi.
8. `"item_ritual_bell"`: Chuông đồng triệu hồn Tam Thanh dùng trong pháp sự gọi vong.
9. `"item_tattered_doll"`: Búp bê vải bố mất đầu khâu chỉ đen, cổ vương vệt máu rùng rợn.
10. `"item_tattered_umbrella"`: Cây dù giấy dầu cổ rách tơi tả, lộ nan tre đen đúa che mưa sương.
11. `"item_flashlight"`: Đèn pin chiến thuật hiện đại phát luồng sáng nón hình học xuyên thủng bóng đêm.
12. `"item_scalpel"`: Dao mổ phẫu thuật kim loại sáng loáng sắc lạnh, mũi dao vương vệt máu tươi.

---

## 7. CƠ CHẾ CHUYỂN ĐỘNG KEYFRAME ĐIỂM A → ĐIỂM B (MOTION TWEENING)

Bất kỳ nhân vật nào cũng có thể di chuyển mượt mà từ vị trí xuất phát (Điểm A: `slot`, `offsetX`, `offsetY`) sang vị trí đích (Điểm B: `targetSlot`, `targetOffsetX`, `targetOffsetY`) theo thời gian cảnh.

### Cấu trúc khối `motion`:
```json
"motion": {
  "targetSlot": "center",
  "targetOffsetX": -50,
  "targetOffsetY": 0,
  "startTimeSec": 0.5,
  "endTimeSec": 5.0,
  "easing": "ease_in_out",
  "autoFaceTarget": true,
  "movingPose": "pose_walking"
}
```

### Giải thích các trường của `motion`:
- `targetSlot` *(bắt buộc)*: Slot đích đến (phải tuân thủ cùng quy tắc Ground hoặc Air với nhân vật).
- `targetOffsetX` *(tùy chọn)*: Tinh chỉnh tọa độ X đích đến (cho phép đến bất kỳ vị trí X nào trên Ground Line).
- `targetOffsetY` *(tùy chọn)*: Tinh chỉnh tọa độ Y đích đến (chỉ dùng cho pose bay `pose_floating`; nhân vật tiếp đất luôn là 0).
- `startTimeSec` *(mặc định 0)*: Số giây bắt đầu rời Điểm A.
- `endTimeSec` *(mặc định duration_sec)*: Số giây chạm tới Điểm B.
- `easing`: Nhịp độ gia tốc:
  - `"ease_in_out"`: Mượt mà ở hai đầu (khuyên dùng).
  - `"linear"`: Đều đặn tăm tắp từ đầu đến cuối.
  - `"ease_in"`: Xuất phát chậm, tăng tốc nhanh về đích.
  - `"ease_out"`: Bứt tốc ngay từ đầu, giảm tốc chậm dần khi tới đích.
- `autoFaceTarget`: `true` (mặc định) -> Nhân vật tự động quay mặt (`facing: "right"` hoặc `"left"`) theo hướng đang đi tới Điểm B.
- `movingPose`: Tư thế tạm thời trong lúc đang di chuyển (ví dụ: bình thường đứng `pose_standing`, khi di chuyển tự đổi thành `pose_walking`, khi tới đích tự dừng lại đứng thẳng quan sát).

---

## 8. HỢP ĐỒNG DỮ LIỆU ĐIỀU KHIỂN (DIRECTOR SCENE SCRIPT JSON SCHEMA)

Mọi kịch bản do LLM sinh ra **BẮT BUỘC PHẢI LÀ MỘT JSON OBJECT HỢP LỆ DUY NHẤT** theo TypeScript Interface sau:

```typescript
export interface DirectorSceneScript {
  scene_id: string;               // Mã định danh cảnh, ví dụ: "scene_01_graveyard"
  title: string;                  // Tiêu đề cảnh tiếng Việt
  duration_sec: number;           // Thời lượng cảnh (1 đến 60 giây, khuyến nghị 5-8s)
  theme: "rural_graveyard" | "abandoned_village" | "cursed_swamp" | "modern_indoor";
  lighting: {
    sky_preset: "blood_moon" | "foggy_night" | "stormy_dark" | "eclipse_abyss" | "flickering_fluorescent" | "dim_indoor_night";
    fog_density: number;          // Độ dày sương mù từ 0.0 đến 1.0
    thunder_flash?: boolean;      // Bật chớp giật sấm sét (true/false)
  };
  environment_items: Array<{
    asset_id: "creepy_banyan_tree" | "ancient_tomb" | "dilapidated_hut" | "abandoned_shrine" | "broken_wooden_bridge" | "scarecrow_of_the_damned" | "creepy_well" | "haunted_gallows_tree" | "hospital_operating_bed" | "hotel_reception_desk" | "supermarket_shelf_aisle" | "creepy_elevator_doors" | "dining_table_chairs";
    slot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right";
    offsetX?: number;
    offsetY?: number;
    scale?: number;
  }>;
  actors: Array<{
    id: string;
    base: "male_adult" | "female_adult" | "ghost_wraith" | "creepy_child" | "jiangshi_corpse" | "demon_shadow";
    costume?: "outfit_tattered_tunic" | "outfit_flowing_ao_dai" | "outfit_shrouded_cloak" | "outfit_mandarin_court" | "outfit_monk_cassock" | "outfit_shredded_burial" | "outfit_ancient_armor" | "outfit_child_pajamas" | "outfit_doctor_coat" | "outfit_patient_gown" | "outfit_modern_casual";
    face: "face_calm" | "face_scared" | "face_creepy_smile" | "face_bleeding_eyes" | "face_faceless" | "face_glowing_hollow" | "face_talisman_covered";
    pose: "pose_standing" | "pose_holding" | "pose_shivering" | "pose_walking" | "pose_floating" | "pose_crawling" | "pose_reaching" | "pose_hanging";
    facing: "left" | "right";
    slot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right" | "air_left" | "air_center" | "air_right";
    offsetX?: number;
    offsetY?: number;
    scale?: number;
    opacity?: number;
    heldItem?: "none" | "item_storm_lantern" | "item_paper_lantern" | "item_soul_candle" | "item_peach_wood_sword" | "item_yellow_talisman" | "item_rusty_sickle" | "item_ritual_bell" | "item_tattered_doll" | "item_tattered_umbrella" | "item_flashlight" | "item_scalpel";
    heldHand?: "right" | "left";
    motion?: {
      targetSlot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right" | "air_left" | "air_center" | "air_right";
      targetOffsetX?: number;
      targetOffsetY?: number;
      startTimeSec?: number;
      endTimeSec?: number;
      easing?: "linear" | "ease_in_out" | "ease_in" | "ease_out";
      autoFaceTarget?: boolean;
      movingPose?: "pose_standing" | "pose_holding" | "pose_shivering" | "pose_walking" | "pose_floating" | "pose_crawling" | "pose_reaching" | "pose_hanging";
    };
  }>;
  details?: Array<{
    id: string;
    asset_id: "detail_black_crow" | "detail_will_o_wisp" | "detail_blood_lantern" | "detail_incense_bowl" | "detail_skull_pile" | "detail_hanging_talisman" | "detail_iv_drip_stand" | "detail_shopping_cart" | "detail_surveillance_camera" | "detail_flickering_ceiling_lamp";
    slot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right" | "air_left" | "air_center" | "air_right";
    offsetX?: number;
    offsetY?: number;
    scale?: number;
  }>;
  dialogue?: string;              // Lời thoại / Phụ đề điện ảnh hiển thị đáy màn hình
  narrative_note?: string;        // Ghi chú tâm lý & chỉ đạo nghệ thuật của đạo diễn
}
```

---

## 9. VÍ DỤ MẪU HOÀN CHỈNH CHO LLM THAM KHẢO

### Ví dụ 1: Người lữ khách cầm đèn bão tiến vào ngôi mộ cổ có bóng ma trơi
```json
{
  "scene_id": "scene_01_traveler_crossing",
  "title": "Cảnh 1: Lạc Bước Bãi Tha Ma",
  "duration_sec": 6,
  "theme": "rural_graveyard",
  "lighting": {
    "sky_preset": "foggy_night",
    "fog_density": 0.7,
    "thunder_flash": false
  },
  "environment_items": [
    { "asset_id": "creepy_banyan_tree", "slot": "far_left", "scale": 1.05 },
    { "asset_id": "ancient_tomb", "slot": "mid_right", "scale": 1.0 }
  ],
  "actors": [
    {
      "id": "actor_traveler",
      "base": "male_adult",
      "costume": "outfit_tattered_tunic",
      "face": "face_scared",
      "pose": "pose_holding",
      "facing": "right",
      "slot": "far_left",
      "offsetX": 90,
      "scale": 1.0,
      "heldItem": "item_storm_lantern",
      "heldHand": "right",
      "motion": {
        "targetSlot": "center",
        "targetOffsetX": -70,
        "startTimeSec": 0.5,
        "endTimeSec": 5.2,
        "easing": "ease_in_out",
        "autoFaceTarget": true,
        "movingPose": "pose_walking"
      }
    }
  ],
  "details": [
    { "id": "detail_incense_1", "asset_id": "detail_incense_bowl", "slot": "mid_right", "offsetX": -75 },
    { "id": "detail_crow_1", "asset_id": "detail_black_crow", "slot": "air_left" }
  ],
  "dialogue": "Đêm ba mươi lạnh buốt... Khói hương nghi ngút từ ngôi mộ vô chủ phía trước...",
  "narrative_note": "Chàng trai cầm đèn bão run rẩy bước đi trong sương mù dày đặc, ánh đèn le lói rọi sáng bát hương đỏ lửa."
}
```

### Ví dụ 2: Pháp sư cầm kiếm gỗ đào đối đầu Cương thi quan phục
```json
{
  "scene_id": "scene_04_shrine_confrontation",
  "title": "Cảnh 4: Trấn Yểm Cương Thi Bên Miếu Cổ",
  "duration_sec": 7,
  "theme": "abandoned_village",
  "lighting": {
    "sky_preset": "blood_moon",
    "fog_density": 0.75,
    "thunder_flash": false
  },
  "environment_items": [
    { "asset_id": "abandoned_shrine", "slot": "center", "scale": 1.05 },
    { "asset_id": "scarecrow_of_the_damned", "slot": "far_right", "scale": 0.9 }
  ],
  "actors": [
    {
      "id": "actor_exorcist",
      "base": "male_adult",
      "costume": "outfit_monk_cassock",
      "face": "face_calm",
      "pose": "pose_holding",
      "facing": "right",
      "slot": "far_left",
      "scale": 0.95,
      "heldItem": "item_peach_wood_sword",
      "heldHand": "right"
    },
    {
      "id": "actor_jiangshi",
      "base": "jiangshi_corpse",
      "costume": "outfit_mandarin_court",
      "face": "face_talisman_covered",
      "pose": "pose_standing",
      "facing": "left",
      "slot": "mid_right",
      "offsetX": 90,
      "scale": 1.05,
      "motion": {
        "targetSlot": "center",
        "targetOffsetX": -40,
        "startTimeSec": 1.0,
        "endTimeSec": 6.2,
        "easing": "linear",
        "autoFaceTarget": true,
        "movingPose": "pose_reaching"
      }
    }
  ],
  "details": [
    { "id": "talisman_wire", "asset_id": "detail_hanging_talisman", "slot": "air_center" },
    { "id": "incense_pot", "asset_id": "detail_incense_bowl", "slot": "center", "offsetX": 90 }
  ],
  "dialogue": "Lá bùa vàng phất phơ trước trán tử thi quan chức... Tiếng bước chân nhảy cứng đờ tiến lại gần...",
  "narrative_note": "Pháp sư áo cà sa thủ kiếm gỗ đào sẵn sàng nghênh chiến cương thi đang áp sát dưới ánh trăng máu."
}
```

### Ví dụ 3: Hành lang bệnh viện bỏ hoang, bác sĩ quỷ truy đuổi người cầm đèn pin
```json
{
  "scene_id": "scene_07_hospital_corridor",
  "title": "Cảnh 7: Ác Mộng Hành Lang Bệnh Viện",
  "duration_sec": 6,
  "theme": "modern_indoor",
  "lighting": {
    "sky_preset": "flickering_fluorescent",
    "fog_density": 0.55,
    "thunder_flash": false
  },
  "environment_items": [
    { "asset_id": "hospital_operating_bed", "slot": "center", "scale": 1.0 },
    { "asset_id": "creepy_elevator_doors", "slot": "far_right", "scale": 0.95 }
  ],
  "actors": [
    {
      "id": "actor_survivor",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_scared",
      "pose": "pose_holding",
      "facing": "right",
      "slot": "far_left",
      "offsetX": 60,
      "scale": 1.0,
      "heldItem": "item_flashlight",
      "heldHand": "right",
      "motion": {
        "targetSlot": "mid_left",
        "targetOffsetX": 40,
        "startTimeSec": 0.5,
        "endTimeSec": 4.8,
        "easing": "ease_in_out",
        "autoFaceTarget": true,
        "movingPose": "pose_walking"
      }
    },
    {
      "id": "actor_doctor_ghost",
      "base": "male_adult",
      "costume": "outfit_doctor_coat",
      "face": "face_creepy_smile",
      "pose": "pose_holding",
      "facing": "left",
      "slot": "mid_right",
      "scale": 1.05,
      "heldItem": "item_scalpel",
      "heldHand": "right",
      "motion": {
        "targetSlot": "center",
        "targetOffsetX": 60,
        "startTimeSec": 1.2,
        "endTimeSec": 5.5,
        "easing": "ease_in",
        "autoFaceTarget": true,
        "movingPose": "pose_walking"
      }
    }
  ],
  "details": [
    { "id": "detail_iv_1", "asset_id": "detail_iv_drip_stand", "slot": "mid_left", "offsetX": -60 },
    { "id": "detail_cam_1", "asset_id": "detail_surveillance_camera", "slot": "air_right" },
    { "id": "detail_lamp_1", "asset_id": "detail_flickering_ceiling_lamp", "slot": "air_left" }
  ],
  "dialogue": "Ánh đèn huỳnh quang chập chờn rọi bóng chiếc giường mổ hoen rỉ... Tiếng bước chân bác sĩ lê bước với con dao mổ sắc lạnh...",
  "narrative_note": "Người thanh niên rọi đèn pin tháo chạy khi bóng bác sĩ quỷ vấy máu cầm dao mổ lao tới từ thang máy."
}
```

