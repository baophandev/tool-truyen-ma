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
- `"vehicle_interior"`: Khoang xe bus & Tàu xe kinh dị (không gian bên trong xe buýt, xe khách hoặc toa tàu ma quái với trần uốn cong, khoang thoát hiểm, ô cửa sổ đêm nhìn ra đường vắng, hàng ghế hành khách, cột vịn tay màu vàng và sàn cao su chống trượt). BẮT BUỘC dùng cho các cảnh diễn ra bên trong xe buýt/tàu xe để tạo cảm giác ngột ngạt (claustrophobic), TUYỆT ĐỐI KHÔNG dùng modern_indoor.
- `"urban_night_market"`: Khu chợ đêm & Đường phố đô thị (con phố đô thị sầm uất u tối về đêm với dãy nhà cao tầng mờ ảo, đèn neon rực rỡ chớp nháy, dây điện chằng chịt, dãy lều bạt chợ đêm bày bán cổ vật, mặt đường nhựa ướt sũng bóng nước và hơi nước bốc lên từ nắp cống ngầm). BẮT BUỘC dùng cho các cảnh đô thị ngoài trời, phố xá hiện đại hoặc khu chợ đêm.
- `"thatched_house_interior"`: Không gian bên trong căn nhà lá (gian nhà lá ba gian vách nứa đơn sơ rách nát, mái tranh xơ xác rủ vì kèo tre, đòn dông buộc lạt mây, vách đan nan tre, cửa sổ liếp hé mở nhìn ra bóng chuối rặng tre trong đêm lạnh và nền đất nện cổ truyền với vết nứt rơm rạ). BẮT BUỘC dùng cho các phân cảnh diễn ra bên trong căn nhà lá, nhà tranh nông thôn hoặc gian thờ gia tiên.

### 3.2. Bầu Trời & Chiếu Sáng (Sky Presets)
- `"clear_day"`: Ngày Nắng Trong Tự Nhiên (Gradient xanh lam trong sáng `#1D4ED8` -> `#60A5FA` -> `#E0F2FE`, mặt trời rực rỡ với quầng hào quang ấm, mây trắng tơ xốp lững lờ trôi). **LƯU Ý:** Khi muốn diễn tả **ngày u ám, tang tóc hay ma mị**, dùng `"clear_day"` kết hợp `fog_density` cao ($0.6 - 0.9$) hoặc hiệu ứng thời tiết `"heavy_rain"`, `"haunted_mist"`.
- `"golden_sunset"`: Hoàng Hôn Nắng Vàng / Chiều Tà (Gradient ráng chiều tím lam `#312E81` -> `#7C2D12` -> `#EA580C` -> vàng cam `#FDE047`, vầng thái dương lặn thấp tỏa bóng ấm).
- `"morning_dawn"`: Bình Minh Rạng Đông / Nắng Sớm (Gradient hừng đông `#1E1B4B` -> tím hồng `#4F46E5` -> `#FB7185` -> vàng mơ `#FEF08A`, vầng dương non le lói).
- `"blood_moon"`: Trăng Máu U Uất (Gradient đỏ rực `#2B0808` -> `#0D0202`, trăng đỏ quạch khổng lồ).
- `"foggy_night"`: Đêm Sương Lạnh Buốt (Gradient đen tím `#06070B` -> `#141724`, trăng bạc nhợt nhạt).
- `"stormy_dark"`: Bão Đêm Sấm Chớp (Trời dông đen đặc `#030408` -> `#0B0E17`, có thể bật `thunder_flash: true`).
- `"eclipse_abyss"`: Nhật Thực Hắc Ám & Ma Trơi (Trời xanh đen `#021A12` -> `#04090E`, mặt trời đen viền lửa xanh lân tinh).
- `"flickering_fluorescent"`: Đèn Tuýp Huỳnh Quang Chập Chờn (Ánh sáng xanh ngọc lạnh lẽo trong nhà, bóng tuýp chập chờn, biển báo EXIT xanh lục phát sáng).
- `"dim_indoor_night"`: Ánh Vàng Đêm Mờ Ảo (Ánh đèn vàng hổ phách u tịch trong khách sạn / nhà hàng đêm muộn).

### 3.3. Hiệu Ứng Khí Quyển & Thời Tiết (Weather Effects)
Trường `"weather"` cho phép đạo diễn chủ động quyết định phân cảnh có thời tiết xấu hay trong trẻo yên tĩnh (thay vì mặc định ép sương mù vào mọi cảnh):
- `"none"`: Trời yên tĩnh, trong trẻo, không có hiện tượng thời tiết (mặc định không có sương mù `fog_density: 0`).
- `"heavy_rain"`: Mưa rào bão tối (vệt mưa xiên tốc độ cao, bắn giọt nước tung tóe khi tiếp đất Y=800px).
- `"storm_thunder"`: Cuồng phong dông bão sấm chớp (mưa to, gió giật chéo, chớp sáng màn hình `thunder_flash: true`).
- `"blood_rain"`: Mưa máu ma quái (vệt mưa đỏ thẫm rơi rùng rợn).
- `"floating_embers"`: Lửa ma trơi đầm lầy / Đốm than hồng bay lập lòe trong không trung.
- `"drifting_ash"`: Tàn tro tử khí / Bụi tro lạnh lẽo bay lờ lững qua màn hình.
- `"haunted_mist"`: Sương quái xoáy cuộn (khói sương ma mị chuyển động là là mặt đất).

### 3.4. 30 Công Trình Môi Trường (Structures) & Quy Tắc Vị Trí Bắt Buộc

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
| `bus_interior` | Buồng lái tài xế & Máy bán vé xe bus | Buồng lái tài xế xe bus với vô lăng thép, bảng đồng hồ LED đỏ, hộp thu vé tự động, ghế lái thủy lực | `["mid_left", "center", "mid_right"]` |
| `creepy_bathtub` | Bồn tắm rỉ sét ngập máu | Bồn tắm chân vuốt quái thú vintage, thành bồn vấy máu rỉ sét, nước đục ngầu lập lòe vệt tóc trôi dạt và vòi đồng nhỏ giọt máu | `["mid_left", "center", "mid_right"]` |
| `market_stall_tent` | Quầy hàng / Lều bạt chợ đêm | Khung lều bạt chữ A rách mép, bóng đèn tròn vàng ấm đung đưa, quầy gỗ phủ khăn nỉ đỏ bày đồ cổ, bình gốm nứt và hộp gỗ quỷ ám | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `abandoned_subway_station` | Cổng vào & ga tàu điện ngầm bỏ hoang | Lối xuống hầm ga metro hoang phế, bậc thang bê tông nứt nẻ dẫn vào vực thẳm đen ngòm, lan can sắt gỉ, đèn quả cầu chập chờn và biển hiệu SUBWAY vỡ nát | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `rusty_train_tracks_tunnel` | Đường ray tàu & Đường hầm rỉ sét ẩm mốc | Vòm hầm đường sắt ngầm bê tông sâu hun hút, hai thanh ray thép rỉ sét ánh kim, tà vẹt gỗ mục nát, cáp điện lòng thòng, ống nước rỉ giọt và đèn tín hiệu đỏ ma quái | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_old_apartment_gate` | Cổng sắt chung cư cũ | Cổng sắt hoen gỉ khóa xích của khu chung cư cũ nát, khối nhà tập thể u ám phía sau với chuồng cọp lồng sắt, đèn tường chập chờn, nơi nhân vật kiệt sức gục ngã | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_wooden_sampan` | Xuồng ba lá / Ghe nước miền Tây | Chiếc xuồng ba lá gỗ miền Tây đậu trên con kênh nước nổi âm u, chất đầy bông súng, bông điên điển, gác mái dầm và buộc cọc tre mé kênh, gợi ký ức người mẹ Hai Lụa bơi xuồng trên con kênh mùa nước nổi | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_monkey_bridge` | Cầu khỉ miền Tây | Cây cầu khỉ tre miền Tây chênh vênh với chân tre cắm chữ X buộc dây lạt, thân cầu uốn cong và tay vịn tre một bên bắc ngang con kênh tối giữa bụi dừa nước và lục bình | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_wooden_coffin` | Cỗ quan tài gỗ đặt trong nhà | Tâm điểm đám tang truyền thống bà ngoại; cỗ áo quan gỗ hình lục giác nắp vát cạnh chạm khắc chữ "Thọ" mờ, kê trên hai đôn gỗ cao, ánh nến vàng hắt nhẹ lên nắp hòm và dải băng tang trắng rủ mép | `["mid_left", "center", "mid_right"]` |
| `structure_bamboo_bed_net` | Giường tre nông thôn giăng mùng ngủ | Giường tre nông thôn 4 cọc tre vươn cao treo mùng vải trắng mỏng bán trong suốt rủ quanh giường, bên trong có chiếu cói và gối mây; mặt giường tại Y=-80px vừa khít với tư thế nằm `pose_lying_down` (offsetY: -80) | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_wooden_latch_door` | Cánh cửa gỗ cũ cài then ngang có khe hở chân cửa | Khung cửa gỗ ghép từ nhiều tấm ván dọc nứt nẻ lọt ánh sáng đêm lạnh, thanh then cài gỗ ngang tại tầm cao Y=580px (offsetY=-220px từ Ground Y=800px), chừa khe hở 15px sát đất cho vệt nước bùn tràn qua. **Hỗ trợ cờ `"isShaking": true` để tạo hiệu ứng cánh cửa rung bần bật khi có ma quỷ đập cửa hoặc cảnh căng thẳng (mặc định cửa đứng yên tĩnh hoàn toàn)** | `["mid_left", "center", "mid_right"]` |
| `structure_rural_passenger_bus` | Xe đò khách cũ vùng quê | Xe khách cổ điển thập niên 90-2000 dạng hộp bo tròn góc, giá chở hàng chằng bạt trên nóc, các ô cửa sổ kính tối màu, đèn pha trước chiếu luồng sáng vàng mờ nhạt | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_coconut_banana_grove` | Rặng dừa nước và bụi chuối rậm rạp | Thân dừa cao vươn nghiêng duyên dáng với tán lá xòe hình lược răng cưa sắc nhọn, bên dưới là bụi chuối xiêm rậm rạp với các tàu lá bản to rách gió và bắp chuối tím sẫm, khung viền đặc trưng Nam Bộ | `["far_left", "far_right"]` |
| `structure_wooden_chair` | Ghế gỗ tựa | Chiếc ghế gỗ tựa gia đình mộc mạc trang nhã, lưng tựa nan cao vút từ Y=-72px lên Y=-198px tại X=-20px, tay vịn gỗ thanh lịch; **tương tác vừa khít 100% với tư thế ngồi `pose_sitting` và `pose_sitting_twisted_legs`** (đùi gập ngang trên mặt ghế Y=-72px, cẳng chân buông xuống sàn, bàn chân tiếp đất tại Y=0px). Hỗ trợ `facing: "left" | "right"` để xoay ghế đón nhân vật ngồi từ mọi hướng | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_wooden_bed` | Giường ngủ gỗ | Chiếc giường đôi gỗ gia đình ấm áp, vách đầu giường gỗ thanh lịch cao Y=-195px có gối nằm kê đầu tại X=-65px, mặt nệm chiếu phẳng phiu tại Y=-80px và chăn gấp gọn gàng; **tương tác hoàn hảo với tư thế nằm `pose_lying_down` (kèm `offsetY: -80`) hoặc tư thế ngồi `pose_sitting` ở mép giường** | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_small_wooden_table` | Bàn gỗ nhỏ nông thôn | Bàn gỗ nhỏ mộc mạc đặt đèn dầu hột vịt và radio cassette cổ, gốc neo `[bottom-center]` tiếp đất Y=800px, mặt bàn cao Y=-75px (**tương thích hoàn hảo với đạo cụ `detail_oil_lamp`, `detail_vintage_radio` đặt trên bàn kèm `offsetY: -75`**) | `["mid_left", "center", "mid_right"]` |
| `structure_wooden_window` | Cửa sổ gỗ ván lùa/chống nông thôn | Khung cửa sổ ván gỗ hai cánh khép hờ chừa khe dọc ở giữa hắt ánh sương lạnh mờ ảo ra ngoài màn đêm, có các thanh song cửa dọc; neo theo trục sàn Y=800px nhưng khung cửa sổ treo ở tầm cao Y=-260px đến Y=-120px (**tương ứng tầm mắt người nằm trên giường tre nhìn ra**) | `["far_left", "mid_left", "mid_right", "far_right"]` |
| `structure_ancestor_altar` | Bàn thờ tổ tiên vách lá (Án gian cổ) | Án gian gỗ ba tầng chạm khắc cổ kính đặt sát vách nứa căn nhà lá, có yếm đỏ rách mép tua rua, khung di ảnh tổ tiên cổ kính phủ gương mờ, bài vị chữ Nho, bát hương gốm men rạn nghi ngút ba làn khói hương u uất và đôi chân nến đồng le lói ánh vàng ma mị | `["mid_left", "center", "mid_right"]` |
| `structure_hammock` | Võng dù / võng lưới miền quê đung đưa | Chiếc võng dù truyền thống mắc giữa hai cột nhà gỗ, đung đưa kẽo kẹt chậm rãi giữa đêm tối tĩnh mịch; **tương tác hoàn hảo với tư thế nằm võng `pose_lying_hammock` (kèm `offsetY: -60`) hoặc tư thế ngồi** (đùi gập trên mép võng, cẳng chân đung đưa). Thiết kế lọt lòng bao bọc trọn vẹn thân người nhân vật | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_wooden_stairs` | Cầu thang gỗ cũ kỹ rùng rợn | Cầu thang ván gỗ cũ kỹ dẫn lên gác lửng / tầng trên căn nhà, các bậc thang ván gỗ nâng cao từ Y=0 đến chiếu nghỉ gác lửng Y=-180px, lan can tay vịn gỗ và chấn song cổ quái, gầm cầu thang tối om có màng nhện; **tương tác hoàn hảo với bước leo thang `pose_climbing_stairs` (motion lên gác lửng `targetOffsetY: -180`) hoặc đứng trên gác lửng (`offsetY: -180`)** | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_overgrown_ruins` | Nền nhà hoang um tùm cỏ dại | Phế tích nền đất cũ của căn nhà lá đã sụp đổ hoàn toàn bên mé kênh, chỉ còn vài cột gỗ mục gãy đổ, xà tre sập, gạch vụn rêu phong và những bụi cỏ dại, lau sậy mọc um tùm cao ngang gối đung đưa trong gió đêm | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |
| `structure_thatched_tile_house` | Căn nhà lá lợp ngói máng cũ miền Tây | Ngôi nhà cấp bốn nông thôn Nam Bộ kết hợp vách lá dừa nước và phần mái lợp ngói máng âm dương cũ kỹ rêu phong, có hàng hiên thấp và bậu cửa gỗ, neo mặt đất `Y=800px` | `["far_left", "mid_left", "center", "mid_right", "far_right"]` |

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
| `detail_broken_mirror` | Gương nhà tắm vỡ nứt vấy máu | Gương nhà tắm treo tường nứt mạng nhện chằng chịt, dấu bàn tay đẫm máu cào xước | Cả 5 Ground Slots và 3 Air Slots |
| `detail_muddy_water_puddle` | Vũng nước ướt sũng lẫn bùn non loang trên nền đất | Vệt nước bùn non đục ngầu tràn qua khe cửa bò lan trên sàn đất, ánh phản quang xám bạc và đốm bùn rải rác | Cả 5 Ground Slots (Ground only Y=800px) |
| `detail_oil_lamp` | Đèn dầu hột vịt / Đèn dầu cổ để bàn | Bầu đèn thủy tinh tròn nhỏ, ống khói thon eo, ngọn lửa bấc vàng cam leo lét với quầng sáng ấm tỏa tròn xung quanh (Ground hoặc bàn với offsetY âm) | Cả 5 Ground Slots |
| `detail_vintage_radio` | Đài radio cassette cổ chạy pin | Máy radio chữ nhật nhỏ gọn có ăng-ten kim loại chéo cao, hai màng loa tròn và dải đèn tần số xanh lục mờ | `["mid_left", "center", "mid_right"]` (Ground hoặc bàn) |
| `detail_water_hyacinth` | Bụi lục bình dày đặc trôi nổi | Cụm lá tròn phình cuống xốp bồng bềnh trên mặt nước kênh rạch, chùm hoa tím nhạt u ám và rễ ngầm đen dưới nước | Cả 5 Ground Slots (Ground/Mặt nước Y=800px) |
| `detail_child_sandals` | Đôi dép trẻ con bỏ lại trên mặt đất | Đôi dép nhựa / dép tổ ong nhỏ xíu nằm chỏng chơ lệch nhau sát mép đất đầu cầu khỉ vương bùn ướt lạnh đêm sương, gợi nhắc đứa trẻ mất tích bí ẩn | Cả 5 Ground Slots (Ground only Y=800px) |
| `detail_offering_tray_toys` | Mẹt đồ cúng cô hồn trên đất (Nải chuối, nhang & đồ chơi đất nung) | Mẹt tre lót lá chuối đựng nải chuối chín, bộ đồ chơi con nít bằng đất nung nhỏ (nồi đất, chén con, con giống) và nén nhang cháy đỏ khói trắng mỏng cuộn bay | Cả 5 Ground Slots (Ground only Y=800px) |
| `detail_matchbox` | Hộp quẹt diêm cổ để bàn | Bao diêm giấy nhỏ màu vàng nâu cũ kỹ kéo hé lộ que diêm đầu đỏ đặt trên mặt bàn gỗ cạnh đèn dầu hột vịt (hỗ trợ `offsetY` âm để đặt trên bàn) | Cả 5 Ground Slots |
| `detail_water_droplets` | Giọt nước nhỏ tí tách bên ngoài cửa sổ | Chuỗi giọt nước đọng và rơi tí tách tạo vòng gợn sóng nhỏ ngay bên ngoài bệ cửa sổ gỗ trong đêm khuya, gợi dấu vết thực thể ướt sũng đứng rình rập | Cả 5 Ground Slots và 3 Air Slots |
| `detail_porridge_bowl` | Bát cháo trắng & muỗng sứ | Tô/bát cháo trắng bốc làn khói ấm mỏng cùng chiếc muỗng sứ đặt trên mặt bàn gỗ nông thôn (hỗ trợ `offsetY` âm như `-75` để đặt khớp mặt bàn `structure_small_wooden_table`) hoặc tiếp đất Y=800px | Cả 5 Ground Slots |
| `detail_npc_silhouette_standing` | Bóng người NPC đứng (Cơ thể thuần) | Bóng đen cơ thể người đơn giản không gương mặt, không quần áo, dùng để xếp thêm người đứng trong các cảnh đông đúc (hỗ trợ chỉnh `scale`, `offsetX`, `zIndex`) | Cả 5 Ground Slots (Ground only Y=800px) |
| `detail_npc_silhouette_walking` | Bóng người NPC bước đi (Cơ thể thuần) | Bóng đen cơ thể người đang sải bước (không gương mặt, không quần áo), dùng để mô tả người qua đường hoặc dòng người đi lại | Cả 5 Ground Slots (Ground only Y=800px) |
| `detail_npc_crowd_group` | Nhóm đông người NPC đứng tụ tập (4 người) | Cụm 4 bóng người cơ thể thuần không gương mặt, không quần áo đứng tụ tập với chiều cao và tư thế khác nhau để tạo nhanh cảnh đám đông | Cả 5 Ground Slots (Ground only Y=800px) |
| `detail_npc_crowd_walking` | Đoàn người NPC di chuyển (4 người) | Cụm 4 bóng người cơ thể thuần không gương mặt, không quần áo đang bước đi cùng chiều cho cảnh chợ đêm đông đúc hoặc đoàn người di chuyển | Cả 5 Ground Slots (Ground only Y=800px) |
| `detail_fish_splash` | Cá lóc quẫy nước dưới kênh đêm | Bóng đen thân cá lóc uốn cong vọt nhẹ trên mặt nước kênh tối kèm các vòng sóng lan tỏa và giọt nước bắn tung tóe trắng bạc, neo mặt nước `Y=800px` | Cả 5 Ground Slots (Ground/Mặt nước Y=800px) |
| `detail_falling_coconut` | Trái dừa khô rụng bịch xuống đất | Trái dừa khô vỏ sẫm màu nằm lăn trên nền đất ven gốc dừa kèm vệt chuyển động rơi thẳng đứng từ trên cao xuống và bụi đất nhẹ bắn lên ở `Y=800px` | Cả 5 Ground Slots (Ground only Y=800px) |
| `detail_rooster_crowing` | Bóng gà trống gáy sáng phía xa | Bóng đen con gà trống vươn cổ cất tiếng gáy sáng đầu tiên trên bờ rào/mái rơm với sóng âm thanh mờ nhạt lan tỏa trong sương sớm | Cả 5 Ground Slots và 3 Air Slots |

#### Cấu trúc JSON mẫu cho cụm bối cảnh miền Tây đêm & rạng sáng:
```json
{
  "environment_items": [
    { "asset_id": "structure_thatched_tile_house", "slot": "mid_left", "facing": "right", "scale": 1 }
  ],
  "details": [
    { "asset_id": "detail_fish_splash", "slot": "far_right", "scale": 1 },
    { "asset_id": "detail_falling_coconut", "slot": "far_left", "scale": 1 },
    { "asset_id": "detail_rooster_crowing", "slot": "air_right", "offsetY": 110, "scale": 0.75 }
  ]
}
```

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

### 5.1. 9 Khung Thân Thể Nhân Vật (Character Bases)
- `"male_adult"`: Nam thanh niên (dáng người gầy, bước đi hoang mang, người lữ khách).
- `"female_adult"`: Nữ thanh niên (tà áo buông, mái tóc đen dài rủ bóng).
- `"elder_hunched"`: Bà lão / Cụ già lưng còng (vai gù gập về trước, cổ chúc xuống, bước đi khòm, tóc hoa râm búi củ tỏi gài trâm tre, vóc người thấp bé 0.85x).
- `"brute_hulking"`: Đồ tể / Hộ pháp lực lưỡng (vóc dáng đồ sộ 1.2x, vai u thịt bắp bè ngang, quai hàm bạnh vuông thô ráp, sẹo trên má, tóc húi cua sát đầu).
- `"skeletal_emaciated"`: Kẻ gầy trơ xương / Ngạ quỷ (vóc người cao 1.05x khẳng khiu dài ngoằng, ngực hóp lộ khung sườn, khớp gối lồi, tóc xơ xác rũ rượi).
- `"ghost_wraith"`: Bóng ma oan hồn (không chân, đuôi áo rách dập dềnh bồng bềnh, quầng hào quang ma mị).
- `"creepy_child"`: Đứa trẻ ma (vóc dáng nhỏ bé 0.65x, yếm hoa, vẻ u uất bí hiểm).
- `"jiangshi_corpse"`: Cương thi áo quan (xác chết nhảy búp, mũ quan phong kiến, tay duỗi thẳng phía trước).
- `"demon_shadow"`: Quỷ bóng đen dị hình (vóc dáng to lớn 1.25x, sừng cong nhọn hoắt, móng vuốt, hào quang khói đen).

### 5.2. 13 Bộ Sưu Tập Trang Phục (Costumes)
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
- `"outfit_traditional_ba_ba"`: Áo bà ba trắng truyền thống Nam Bộ cổ tròn không bâu, hàng nút dọc giữa ngực, hai túi vuông nhỏ, vạt xẻ tà hông phối quần lụa đen ống rộng. Rất phù hợp cho tạo hình bóng người phụ nữ mặc áo bà ba trắng, tóc xõa dài đứng nhìn theo xe đò ở mé kênh.
- `"outfit_funeral_white"`: Trang phục tang lễ trắng xô gai truyền thống & dải khăn tang trắng quấn ngang trán có hai vạt rủ sau gáy, quần lụa đen. Dành riêng cho các cảnh đám tang thôn quê, chịu tang gia đình hoặc nhân vật thức dậy đối diện cái chết (Cảnh 7).

### 5.3. 15 Biểu Cảm Khuôn Mặt & Đặc Điểm Phần Đầu (Faces - Gắn tại Head Socket)
- `"face_calm"`: Mặt bình thường, mắt đen nhỏ vô hồn, lạnh lẽo.
- `"face_scared"`: **Kinh hãi tột cùng (Scared Trembling Face)**: Chân mày nhíu xếch hoảng loạn (`/  \`), nếp nhăn trán lo lắng, tròng mắt trợn trừng trắng dã, đồng tử co rút, giọt mồ hôi lạnh thái dương, khóe miệng trễ xuống há hốc méo mó rên siết với viền răng trên mảnh tự nhiên và họng sâu đen kịt (tuyệt đối không giống cười hay răng nanh quái vật).
- `"face_screaming_gasp"`: **Há hốc kinh hoàng (Screaming Gasp Face)**: Chân mày co rút hoảng loạn, hai mắt mở to tròn trừng trừng, đồng tử đen nhỏ co rút hoảng loạn, miệng há toác dọc hình vực thẳm đen ngòm đớp lấy từng ngụm khí lộ hàng răng trên rung giật. Rất hợp cho các cảnh nhân vật chứng kiến thực thể ma quái đột ngột hiện hình hoặc hoảng loạn cùng cực.
- `"face_creepy_smile"`: Nụ cười ma quái xé toạc dài tới mang tai với hàm răng nhọn.
- `"face_bleeding_eyes"`: Mắt trắng dã chảy hai vệt máu đen rỉ xuống cằm.
- `"face_old_wrinkled"`: Mặt già nua nếp nhăn, trán nhăn sâu, đuôi mắt chân chim chùng xuống, khóe rãnh miệng móm tém.
- `"face_rage_furious"`: Mặt phẫn nộ trừng mắt, chân mày xếch ngược dữ dội, mắt đỏ ngầu căm phẫn, nhe răng nanh gầm thét đe dọa.
- `"face_pale_corpse"`: Mặt tử thi lạnh lẽo, da tím tái, tròng mắt trợn trắng dã không có đồng tử, môi thâm sì cứng đờ.
- `"face_weeping_ghost"`: Mặt oán phụ khóc than, mắt nhắm nghiền đẫm lệ, hai dòng lệ đen kịt rỉ dài từ khóe mắt xuống cằm thê lương.
- `"face_sewn_mouth"`: Mặt miệng khâu chỉ đen, mắt mở to kinh hoàng hoảng loạn, miệng bị khâu kín chéo chữ X bằng những mũi chỉ đen rỉ máu.
- `"face_haggard_gaunt"`: Mặt hốc hác đói khát, hốc mắt trũng sâu quầng thâm kịt, gò má nhô cao hóp lại, vẻ mặt kiệt quệ rùng rợn của kẻ bị ma ám.
- `"face_faceless"`: Mặt trắng trơn vô diện (No-Face), không ngũ quan, cực kỳ bất an.
- `"face_glowing_hollow"`: Hốc mắt và miệng rỗng tuếch rực cháy lửa xanh lân tinh ma trơi.
- `"face_talisman_covered"`: Lá bùa vàng chu sa che kín từ trán xuống miệng, bay phấp phới.
- `"face_headless"`: Không đầu / Cổ đứt lìa (Headless Severed Neck). BẮT BUỘC dùng cho cốt truyện nhân vật không đầu (người đàn ông không đầu, tử sĩ cụt đầu, oan hồn mất đầu). Engine sẽ loại bỏ hoàn toàn đầu, tóc, mũ và nón, thay bằng cuống cổ chém đứt nham nhở, lộ đốt sống cổ trắng xám, máu tươi và máu đông rỉ rách nhỏ giọt xuống vạt áo kèm làn khói oán khí bốc lên nghi ngút.

### 5.4. Cử Động Gương Mặt & Vi Chuyển Động (Facial Actions / Micro-Animations)

Giúp nhân vật sống động, không bị đơ cứng như ảnh tĩnh mà liên tục có phản xạ sinh lý và biểu cảm chân thực:

| Facial Action ID | Tên Cử Động | Hiệu Ứng Thị Giác & Ngữ Nghĩa |
| :--- | :--- | :--- |
| `"none"` | Tĩnh lặng | Giữ nguyên ngũ quan tĩnh không chuyển động. |
| `"blink_natural"` | Chớp mắt tự nhiên | Nháy mắt đều đặn chu kỳ 3.6s, tạo cảm giác nhân vật còn sống và đang chăm chú nhìn. |
| `"blink_nervous"` | Chớp mắt lia lịa hoảng sợ | Nháy mắt liên tục tần số cao (0.8s) kèm giật nhẹ, biểu lộ tâm trạng căng thẳng tột độ. |
| `"darting_eyes"` | Liếc mắt dáo dác | Con ngươi đảo lia lịa từ trái sang phải rồi nhìn thẳng, lùng sục bóng tối xung quanh tìm đường thoát. |
| `"crying_tears"` | Rơi lệ khóc ròng | Hai dòng lệ trắng bạc trong suốt từ khóe mắt chảy dài xuống cằm theo chu kỳ tuần hoàn. |
| `"bleeding_tears"` | Khóc rỉ máu | Hai dòng huyết lệ đỏ thẫm rỉ từ hốc mắt tuôn dài xuống ngực, tăng mạnh tử khí và oan hồn. |
| `"creepy_laugh"` | Cười ma quái giật rung | Khung miệng/hàm co giật lên xuống liên tục nhịp nhanh, tạo cảm giác đang cười khúc khích điên loạn. |
| `"terrified_scream"` | Há to đớp khí gào thét | Xương hàm mở rộng tối đa, run rẩy bần bật như đang thét lên không ra tiếng trong ác mộng. |
| `"talking_jaw"` | Cử động môi nói / thì thào | Môi khép mở tự nhiên chu kỳ 0.6s, mô phỏng nhân vật đang đọc lời thoại hoặc niệm chú. |

### 5.5. 11 Tư Thế Động Tác (Poses) & Quy Định Vùng Đứng Bắt Buộc

| Pose ID | Tên Tư Thế | Loại Vùng | Quy Định Vị Trí Slot Bắt Buộc | Mô Tả Ngữ Nghĩa & Đặc Điểm Hình Học |
| :--- | :--- | :--- | :--- | :--- |
| `pose_standing` | Đứng quan sát | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) | Đứng thẳng quan sát, hai chân trụ tiếp đất vững chãi. |
| `pose_sitting` | Ngồi ghế / sàn xe | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) | Ngồi ngay ngắn trên ghế xe buýt (`bus_interior`), ghế bàn ăn (`dining_table_chairs`), đùi gập ngang ra trước, cẳng chân buông xuống sàn, bàn chân tiếp đất phẳng phiu. Hai tay đặt trên đùi hoặc cầm điện thoại/đèn soi sáng. |
| `pose_sitting_twisted_legs` | Ngồi chân xoay ngược lơ lửng | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) | **Tư thế dị dạng kinh dị rùng rợn:** Thân trên ngồi trên ghế, nhưng khớp hông và đầu gối bị vặn xoắn 180° ngược ra sau lưng. Hai cẳng chân chìa ra phía sau, bàn chân bẻ ngược và **lơ lửng cách mặt sàn vài phân** (không chạm đất), bên dưới có bóng tà khí hư ảo. Dành riêng cho hành khách quỷ quyệt trên xe buýt đêm. |
| `pose_holding` | Cầm / Giơ đồ vật soi đường | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) | Tay giơ cao đèn bão, kiếm gỗ đào hoặc bùa vàng soi rọi về phía trước. |
| `pose_shivering` | Run rẩy co ro sợ hãi | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) | Đầu gối run rẩy lập cập, hai tay ôm ngực co ro trước tà khí. |
| `pose_walking` | Bước đi chậm rãi | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) | Chân sải bước luân phiên, tay đánh nhịp chậm rãi trong sương mù. |
| `pose_crawling` | Bò trườn sát mặt đất (Góc nhìn ngang) | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) | **Góc nhìn ngang 2D chân thực:** Toàn bộ thân mình hạ rạp sát mặt đất (chiều cao chỉ ~60-70px), sống lưng uốn cong nằm ngang, một tay chống đất chịu lực, một tay vươn dài móng vuốt cào trên mặt sàn về phía trước, chân sau duỗi lê lết trên mặt đất, đầu hơi ngẩng nhìn trừng trừng về phía trước. Rất ấn tượng khi bò trườn dọc lối đi xe buýt (`bus_interior`) hoặc mặt cỏ bãi tha ma. |
| `pose_reaching` | Vươn móng vuốt bắt hồn | Ground | Chỉ được đặt ở 5 Ground Slots (Y=800) | Cánh tay dị dạng vươn dài về phía trước chụp bắt con mồi. |
| `pose_floating` | Bay lơ lửng dập dềnh | Air | **BẮT BUỘC** đặt ở 3 Air Slots (`air_left`, `air_center`, `air_right`) | Oan hồn bay lơ lửng dập dềnh trên không trung. |
| `pose_hanging` | Bị treo cổ lơ lửng rũ đầu | Air | **BẮT BUỘC** đặt ở 3 Air Slots (`air_left`, `air_center`, `air_right`) | Tử thi bị treo cổ trên cành cây hoặc xà nhà, đầu rũ xuống đung đưa. |
| `pose_lying_down` | Nằm ngửa / Co ro trên giường | Ground | Cả 5 Ground Slots (Hỗ trợ `offsetY` âm, ví dụ `offsetY: -80` để nằm khớp mặt phẳng giường tre `structure_bamboo_bed_net`) | Toàn bộ cơ thể xoay ngang song song với mặt đất, đầu kê trên gối, hai tay xếp trên ngực/bụng (hoặc cầm quạt mo, đèn, lát gừng), lồng ngực phập phồng nhẹ hoặc run rẩy cứng đờ vì sợ hãi. Rất phù hợp cảnh trốn trong mùng, nằm ngủ nghe tiếng gọi hoặc tử thi bất động bên quan tài. |
| `pose_sitting_bed` | Ngồi xếp bằng / khoanh chân trên giường | Ground | Cả 5 Ground Slots (Hỗ trợ `offsetY: -80` để ngồi vững trên giường `structure_wooden_bed` / `structure_bamboo_bed_net`, hoặc `offsetY: 0` trên chiếu sàn) | **Tư thế ngồi xếp bằng truyền thống:** Hai đùi mở sang hai bên, hai cẳng chân đan chéo gấp ngang lòng đùi, bàn chân giấu gọn dưới đầu gối phẳng phiu trên mặt nệm, thân trên thẳng hoặc hơi chúi về trước, hai tay đặt trên đầu gối hoặc cầm bùa/đèn. Hoàn hảo cho cảnh ngồi niệm kinh trừ tà, ngồi canh xác hoặc ngồi co ro sợ hãi trên giường tre. |
| `pose_lying_hammock` | Nằm võng đung đưa miền quê | Ground | Cả 5 Ground Slots (Hỗ trợ `offsetY: -60` để lọt vừa khít lòng võng `structure_hammock`) | **Tư thế nằm võng thư thái nhưng rùng rợn:** Toàn bộ sống lưng uốn lượn cong tự nhiên theo độ võng hình lòng chảo, đầu kê cao trên gối võng, chân co gối nhẹ duỗi theo đuôi võng, hai tay xếp nhẹ trên bụng hoặc buông lơi. Khi gắn vào cảnh quay, nhân vật đung đưa đồng bộ theo nhịp võng kẽo kẹt. |
| `pose_climbing_stairs` | Bước leo cầu thang / bậc dốc cao | Ground | Cả 5 Ground Slots (Hỗ trợ `offsetY` và `targetOffsetY: -180` khi leo lên chiếu nghỉ gác lửng `structure_wooden_stairs`) | **Tư thế bước leo cầu thang dốc:** Chân trước co gối nhấc cao bước lên bậc trên (Y=-34), chân sau duỗi dài chạm bậc dưới/sàn, thân người đổ nhẹ về trước, một tay vươn bám lan can gỗ hoặc cầm đèn soi rọi lên gác xép u tối. Kết hợp hoàn hảo với khối `motion` để diễn xuất cảnh leo từ sàn nhà lên gác lửng. |
| `pose_balancing_bridge` | Đi thăng bằng trên cầu khỉ / cầu tre | Ground | Cả 5 Ground Slots (Hỗ trợ `offsetY: -115` trên cầu khỉ `structure_monkey_bridge` hoặc `offsetY: -110` trên cầu gỗ gãy `broken_wooden_bridge`) | **Tư thế đi chênh vênh thăng bằng:** Hai bàn chân đặt so le thẳng hàng dọc theo thân tre hẹp, hai đầu gối chùng xuống hạ thấp trọng tâm, hai cánh tay dang rộng sang hai bên giữ thăng bằng (hoặc một tay giơ đèn soi đường, một tay dang ngang), cơ thể rung nhẹ trước những cơn gió lạnh thổi thốc qua lòng kênh tối. |
| `pose_kneeling` | Quỳ gối lạy / khấn vái / xin tha mạng | Ground | Cả 5 Ground Slots (Hỗ trợ `offsetY: 0` trên mặt sàn hoặc `offsetY: -80` trên phản/giường) | **Tư thế quỳ gối kính cẩn hoặc kinh hãi:** Hai đầu gối chạm đất, hai cẳng chân và mu bàn chân xếp phẳng phía sau, thân mình thẳng hoặc hơi cúi lạy, hai tay chắp trước ngực cầu xin/khấn vái (hoặc hai tay dâng bùa/nến/hương). Hoàn hảo cho cảnh cúng bái trước bàn thờ `structure_ancestor_altar` hoặc quỳ xin tha mạng trước quỷ dữ. |
| `pose_squatting` | Ngồi xổm / chồm hổm góc tối | Ground | Cả 5 Ground Slots (Hỗ trợ `offsetY: 0` trên mặt đất/sàn nhà) | **Dáng ngồi chồm hổm rùng rợn đặc trưng Á Đông:** Hai bàn chân đạp đất, hai đầu gối co gập nhô cao sát ngực tạo tam giác góc cạnh, hai tay khoác qua đầu gối hoặc buông thõng thủ thế giữa hai chân. Dùng cho cảnh kẻ ăn mày, đứa trẻ ma lẩn trốn trong góc tối hoặc ngạ quỷ rình rập con mồi. |
| `pose_lying_ground` | Nằm sõng soài / gục ngã trên đất | Ground | Cả 5 Ground Slots (Y=800, `offsetY: 0`) | **Nằm bẹp trên mặt đất không có gối:** Toàn bộ thân thể nằm ngang song song mặt sàn đất (cao ~20px), má và thái dương áp sát nền đất lạnh, tóc xõa phẳng ra nền đất, hai cánh tay buông xuôi rũ rượi hoặc một tay vươn yếu ớt chạm đất, hai chân duỗi thẳng mềm oặt, có bóng đổ tiếp xúc và vệt đất ẩm loang dưới thân. Tuyệt đối phù hợp cho cảnh ngất xỉu, bị đánh bất tỉnh, kiệt sức gục ngã hoặc xác chết nằm bẹp trên đường lộ/sàn gạch. |
| `pose_swimming` | Bơi lội / rẽ nước trên sông đầm | Ground | Cả 5 Ground Slots (Y=800 mặt nước, hỗ trợ `offsetY`) | **Tư thế bơi lội rẽ sóng nước:** Nửa thân dưới ngập trong bóng nước tối bí ẩn, thân trên nhô lên rẽ sóng, đầu ngẩng cao thở hoặc nghiêng mắt nhìn, hai cánh tay chèo sải rẽ nước nhịp nhàng (`anim-swimming-arm`). Xung quanh có các gợn sóng elip lan tỏa (`anim-water-ripple`) và bọt nước trắng đục dập dềnh (`anim-water-bob`). Hoàn hảo cho cảnh bơi qua đầm lầy `cursed_swamp`, bơi bám mạn xuồng `structure_wooden_sampan`, hoặc di chuyển bơi qua sông bằng khối `motion` (`movingPose: "pose_swimming"`). |
| `pose_drowning` | Chết đuối / ngoi ngóp chới với | Ground | Cả 5 Ground Slots (Y=800 mặt nước, hỗ trợ `offsetY`) | **Vùng vẫy tuyệt vọng trong cơn ngạt nước:** Thân mình chìm sâu ngập đến cổ/cằm trong làn nước tối, đầu ngửa ra sau há hốc kinh hoàng đớp khí (`anim-drowning-body`), hai cánh tay giơ cao vung vẫy chới với lên khỏi mặt nước với các ngón tay co quắp run rẩy cầu cứu (`anim-drowning-arms`). Xung quanh có vòng xoáy nước ma quái hút xoáy và bọt khí sủi tăm sùng sục vỡ tung tóe (`anim-bubble-rise`). Rất đắt giá cho cảnh rơi xuống sông sâu, bị ma da túm chân lôi xuống nước. |
| `pose_floating_corpse` | Xác chết trôi sông / trôi lờ đờ | Ground | Cả 5 Ground Slots (Y=800 mặt nước, hỗ trợ `offsetY`) | **Xác chết đuối nổi lờ đờ trên mặt sông rạch:** Toàn thân mềm oặt nằm ngang dập dềnh bập bềnh theo nhịp sóng nước trôi (`anim-corpse-drift`), mặt ngửa trắng bệch vô hồn, tóc xõa dài lơ lửng bồng bềnh trong làn nước như rong rêu ma quái, tay chân buông thõng chìm dưới dòng nước lạnh, có các vệt sóng nước và rêu rác phù sa dạt quanh. Yếu tố kinh dị kinh điển trong truyện ma sông nước, vớt xác lúc nửa đêm. |

---

## 6. KHO ĐỒ VẬT CẦM TAY & HAND SOCKET (HANDHELD PROPS)

Nhân vật có thể cầm đồ vật trên tay thông qua Hand Socket. Vật phẩm tự động chuyển động đồng bộ theo nhịp bước đi, thở, run rẩy và tự lật hướng khi nhân vật quay trái/phải.

### 6.1. Thuộc tính trên nhân vật:
- `heldItem`: ID đồ vật (chọn từ danh sách bên dưới, hoặc `"none"`).
- `heldHand`: Tay cầm đồ vật:
  - `"right"`: Tay trước (mặc định - tay chính quay về phía người xem).
  - `"left"`: Tay sau.

### 6.2. Danh Mục 19 Đồ Vật Cầm Tay Thuần SVG:
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
13. `"item_smartphone"`: Điện thoại di động thông minh hiện đại, màn hình phát ánh sáng xanh lạnh ma mị soi tỏ bóng đêm và quầng sáng hình nón.
14. `"item_severed_head"`: Thủ cấp đứt lìa vương máu rỉ giọt. Bàn tay túm chặt lọn tóc xách lủng lẳng đầu người bị chém đứt, mắt trợn trừng vô hồn, vệt máu đen rỉ từ hốc mắt và cuống cổ rỉ giọt máu rơi xuống đất. Rất phù hợp kết hợp cùng `face_headless` (ma không đầu tự xách đầu mình) hoặc kẻ sát nhân/chiến tướng xách thủ cấp kẻ thù.
15. `"item_mysterious_note"`: Mẩu giấy / Lá thư bí ẩn gấp mép vương vệt máu mang thông điệp rùng rợn. Tờ giấy ố vàng nhăn nhúm, các nếp gấp 3D, mép rách răng cưa, vệt máu ngón tay cào xước, dòng chữ viết tay nghuệch ngoạc bằng máu và con dấu sáp đỏ niêm phong. Rất phù hợp cho nhân vật tìm thấy manh mối, di thư tuyệt mệnh hoặc bản đồ chỉ dẫn tới ga ngầm.
16. `"item_offering_toys"`: Nải chuối và bộ đồ chơi đất nung cúng cô hồn. Mẹt tre lót tàu lá chuối đựng nải chuối chín vàng xanh, nồi đất - chén đất - con giống đất nung nhỏ cùng nén nhang cháy đỏ lập lòe tỏa khói mỏng. Phù hợp cảnh bà ngoại mang đồ cúng ra nền đất hoang cho oan hồn cô Hai Lụa.
17. `"item_areca_palm_fan"`: Quạt mo cau miền quê. Chiếc quạt bẹ mo cau khô sạm gân dọc đặc trưng, tự đung đưa phe phẩy nhẹ theo chuyển động tay. Phù hợp cảnh nhân vật cầm quạt mo phe phẩy trằn trọc trong đêm hè oi bức.
18. `"item_fresh_ginger"`: Lát gừng tươi giữ khí. Nhánh và lát gừng vàng tươi tỏa quầng sáng ấm áp nhẹ nhàng, biểu trưng cho mẹo dân gian ngậm hoặc cầm lát gừng tươi để "giữ khí" chống lại tà khí ban đêm.
19. `"item_oil_lamp"`: Đèn dầu hột vịt cầm tay. Đèn dầu thủy tinh hột vịt thon eo nhỏ gọn cầm tại Hand Socket [0, 0] (bàn tay cầm vào đế/cổ đèn), ngọn lửa bấc vàng cam leo lét với quầng sáng ấm tỏa tròn soi tỏ bóng đêm. Rất phù hợp khi nhân vật vùng dậy soi quanh giường tre hoặc cầm đèn dầu rọi tìm dấu vết trong đêm tối.
20. `"item_incense_sticks"`: Nén / Bó nhang đang cháy cầm tay khấn vái. Ba nén nhang mảnh cầm thẳng đứng tại Hand Socket [0, 0], đầu nhang có đốm lửa đỏ hồng lập lòe kèm làn khói trắng mỏng uốn lượn bay lên, dùng cho cảnh bà ngoại khấn vái cầu siêu.
21. `"item_book"`: Cuốn sách giấy bìa cũ. Cuốn sách mở đôi cầm trên tay nhân vật khi nằm võng đọc sách ban chiều, trang giấy trắng ngà đổ bóng tối giản phong cách 2D silhouette.
22. `"item_betel_quid"`: Miếng trầu têm cánh phượng. Miếng trầu xanh têm vôi trắng nhỏ gọn cầm trên tay cụ bà nông thôn Nam Bộ khi ngồi trò chuyện bên bậu cửa.

### 6.3. Hệ Thống Trang Bị Body Sockets (Vai, Đầu, Chân)

Bên cạnh Hand Socket cầm tay, nhân vật được trang bị thêm 3 Body Sockets chuyên biệt chuẩn điện ảnh văn hóa Á Đông / Việt Nam:

#### A. Shoulder Socket (Đồ vật vác / gánh trên vai - `shoulderItem`):
Neo tại trục vai `[0, -188px]`, đung đưa tự nhiên khi bước đi:
1. `"none"`: Hai vai trống không (mặc định).
2. `"shoulder_carrying_pole"`: **Đòn gánh tre hai thúng quang dầu**. Cây đòn gánh tre uốn cong đặt ngang vai, hai đầu mấu sừng móc dây quang thừng treo hai thúng nan tre đung đưa nhịp nhàng theo bước đi `pose_walking`. Hình ảnh kinh điển của người mẹ, người phụ nữ tần tảo hoặc hồn ma gánh hàng rong đêm khuya.
3. `"shoulder_coffin_pole"`: **Đòn khiêng áo quan / đòn sóc**. Thanh đòn gỗ vuông vức vác ngang bờ vai quấn nhiều vòng dây thừng gai chắc nịch dùng trong các đám tang cổ truyền.
4. `"shoulder_hoe"`: **Cuốc cày rỉ sét vác vai**. Cán tre vác chéo qua vai, lưỡi cuốc sắt đen gỉ xám vương bùn đất chạng vạng của nông dân đi làm đồng về lúc nhá nhem.
5. `"shoulder_sack"`: **Bao tải gai cũ kỹ vác trĩu vai**. Bao tải vải thô phồng tròn vác trĩu đè lên một bên vai sau lưng (kẻ cướp mộ, người trốn chạy hoặc người khuân vác).
6. `"shoulder_firewood_bundle"`: **Bó củi khô buộc lạt mây**. Chùm cành cây khô khẳng khiu buộc chặt bằng hai vòng lạt tre vàng vác trên vai người tiều phu.

#### B. Head Socket (Đồ vật đội / quấn trên đầu - `headItem`):
Neo tại đỉnh đầu theo chuyển động đầu nhân vật:
1. `"none"`: Đầu trần (mặc định).
2. `"head_conical_hat"`: **Nón lá cổ truyền chóp nhọn**. Nón lá chóp nhọn đan nan tre, quai vải mềm che nghiêng nửa khuôn mặt tạo nét bí ẩn ma mị.
3. `"head_funeral_band"`: **Dải khăn tang trắng xô gai**. Khăn tang trắng quấn quanh trán thắt nút sau gáy, hai dải khăn dài rủ xơ xác qua vai (dành cho người nhà có tang, như nhân vật Minh thức dậy trong nhà tang).
4. `"head_straw_hat"`: **Mũ cói / mũ rơm rách vành**. Mũ cói nông dân tròn vành tua rua rách mép tả tơi che nắng gió.
5. `"head_talisman_mask"`: **Lá bùa vàng trấn yểm dán trán**. Lá bùa giấy vàng viết chu sa dán từ giữa trán rủ xuống che kín mắt mũi trừ tà hoặc niêm phong cương thi/oan hồn.
6. `"head_basket"`: **Thúng / Mẹt tre đội đầu**. Mẹt tre đan mộc mạc đội thăng bằng trên đỉnh đầu có khăn đệm vải đen của người buôn thúng bán mẹt.

#### C. Leg / Feet Socket (Cùm xích / thương tích ở chân - `legItem`):
Neo tại cổ chân và mắt cá chân `[0, -20px đến 0px]`:
1. `"none"`: Chân tự do (mặc định).
2. `"leg_iron_chains"`: **Cùm xích sắt hoen rỉ cổ chân**. Hai vòng cùm sắt đen rỉ ôm hai cổ chân, xích sắt lê loẹt quẹt sát mặt đất khi bước đi (tù nhân, oan hồn bị xiềng xích dưới địa phủ).
3. `"leg_wooden_shackles"`: **Gông cùm gỗ kẹp mắt cá chân**. Gông cùm gỗ kẹp chặt hai mắt cá chân có then chốt sắt tử tù thời xưa.
4. `"leg_bloody_bandage"`: **Băng vải trắng vấy máu quấn chân**. Dải băng vải xô quấn quanh cẳng chân rỉ vệt máu đỏ tươi do chấn thương hoặc dẫm phải bẫy chông.
5. `"leg_muddy_splatter"`: **Vệt bùn sình lầy đầm lầy bám chân**. Bùn đen nâu ngập từ bàn chân lên cẳng chân sau khi lội kênh rạch hay sình lầy mùa nước nổi.

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
  theme: "rural_graveyard" | "abandoned_village" | "cursed_swamp" | "modern_indoor" | "vehicle_interior" | "urban_night_market" | "thatched_house_interior";
  lighting: {
    sky_preset: "blood_moon" | "foggy_night" | "stormy_dark" | "eclipse_abyss" | "flickering_fluorescent" | "dim_indoor_night";
    fog_density: number;          // Độ dày sương mù từ 0.0 đến 1.0
    thunder_flash?: boolean;      // Bật chớp giật sấm sét (true/false)
    weather?: "none" | "heavy_rain" | "storm_thunder" | "blood_rain" | "floating_embers" | "drifting_ash" | "haunted_mist"; // Hiệu ứng thời tiết & hạt khí quyển thuần code
  };
  environment_items: Array<{
    asset_id: "creepy_banyan_tree" | "ancient_tomb" | "dilapidated_hut" | "abandoned_shrine" | "broken_wooden_bridge" | "scarecrow_of_the_damned" | "creepy_well" | "haunted_gallows_tree" | "hospital_operating_bed" | "hotel_reception_desk" | "supermarket_shelf_aisle" | "creepy_elevator_doors" | "dining_table_chairs" | "bus_interior" | "creepy_bathtub" | "market_stall_tent" | "abandoned_subway_station" | "rusty_train_tracks_tunnel" | "structure_old_apartment_gate" | "structure_wooden_sampan" | "structure_monkey_bridge" | "structure_wooden_coffin" | "structure_bamboo_bed_net" | "structure_wooden_latch_door" | "structure_rural_passenger_bus" | "structure_coconut_banana_grove" | "structure_wooden_chair" | "structure_wooden_bed" | "structure_small_wooden_table" | "structure_wooden_window" | "structure_ancestor_altar" | "structure_hammock" | "structure_wooden_stairs" | "structure_overgrown_ruins";
    slot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right";
    offsetX?: number;
    offsetY?: number;
    scale?: number;
    facing?: "left" | "right";
    isShaking?: boolean;          // Tùy chọn rung lắc (đặc biệt cho structure_wooden_latch_door khi có ma quỷ đập cửa, chấn động kịch tính)
    zIndex?: number;             // Thứ tự lớp hiển thị (số càng lớn càng nằm trên, mặc định 10)
  }>;
  actors: Array<{
    id: string;
    base: "male_adult" | "female_adult" | "elder_hunched" | "brute_hulking" | "skeletal_emaciated" | "ghost_wraith" | "creepy_child" | "jiangshi_corpse" | "demon_shadow";
    costume?: "outfit_tattered_tunic" | "outfit_flowing_ao_dai" | "outfit_shrouded_cloak" | "outfit_mandarin_court" | "outfit_monk_cassock" | "outfit_shredded_burial" | "outfit_ancient_armor" | "outfit_child_pajamas" | "outfit_doctor_coat" | "outfit_patient_gown" | "outfit_modern_casual" | "outfit_traditional_ba_ba" | "outfit_funeral_white";
    face: "face_calm" | "face_scared" | "face_screaming_gasp" | "face_creepy_smile" | "face_bleeding_eyes" | "face_old_wrinkled" | "face_rage_furious" | "face_pale_corpse" | "face_weeping_ghost" | "face_sewn_mouth" | "face_haggard_gaunt" | "face_faceless" | "face_glowing_hollow" | "face_talisman_covered" | "face_headless";
    facialAction?: "none" | "blink_natural" | "blink_nervous" | "darting_eyes" | "crying_tears" | "bleeding_tears" | "creepy_laugh" | "terrified_scream" | "talking_jaw";
    pose: "pose_standing" | "pose_sitting" | "pose_sitting_twisted_legs" | "pose_holding" | "pose_shivering" | "pose_walking" | "pose_floating" | "pose_crawling" | "pose_reaching" | "pose_hanging" | "pose_lying_down" | "pose_lying_hammock" | "pose_sitting_bed" | "pose_climbing_stairs" | "pose_balancing_bridge" | "pose_kneeling" | "pose_squatting" | "pose_lying_ground" | "pose_swimming" | "pose_drowning" | "pose_floating_corpse";
    facing: "left" | "right";
    slot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right" | "air_left" | "air_center" | "air_right";
    offsetX?: number;
    offsetY?: number;
    scale?: number;
    opacity?: number;
    zIndex?: number;             // Thứ tự lớp hiển thị (số càng lớn càng nằm trên, mặc định 20)
    heldItem?: "none" | "item_storm_lantern" | "item_paper_lantern" | "item_soul_candle" | "item_peach_wood_sword" | "item_yellow_talisman" | "item_rusty_sickle" | "item_ritual_bell" | "item_tattered_doll" | "item_tattered_umbrella" | "item_flashlight" | "item_scalpel" | "item_smartphone" | "item_severed_head" | "item_mysterious_note" | "item_offering_toys" | "item_areca_palm_fan" | "item_fresh_ginger" | "item_oil_lamp" | "item_incense_sticks" | "item_book" | "item_betel_quid";
    heldHand?: "right" | "left";
    shoulderItem?: "none" | "shoulder_carrying_pole" | "shoulder_coffin_pole" | "shoulder_hoe" | "shoulder_sack" | "shoulder_firewood_bundle";
    headItem?: "none" | "head_conical_hat" | "head_funeral_band" | "head_straw_hat" | "head_talisman_mask" | "head_basket";
    legItem?: "none" | "leg_iron_chains" | "leg_wooden_shackles" | "leg_bloody_bandage" | "leg_muddy_splatter";
    motion?: {
      targetSlot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right" | "air_left" | "air_center" | "air_right";
      targetOffsetX?: number;
      targetOffsetY?: number;
      startTimeSec?: number;
      endTimeSec?: number;
      easing?: "linear" | "ease_in_out" | "ease_in" | "ease_out";
      autoFaceTarget?: boolean;
      movingPose?: "pose_standing" | "pose_sitting" | "pose_sitting_twisted_legs" | "pose_holding" | "pose_shivering" | "pose_walking" | "pose_floating" | "pose_crawling" | "pose_reaching" | "pose_hanging" | "pose_lying_down" | "pose_lying_hammock" | "pose_sitting_bed" | "pose_climbing_stairs" | "pose_balancing_bridge" | "pose_kneeling" | "pose_squatting" | "pose_lying_ground" | "pose_swimming" | "pose_drowning" | "pose_floating_corpse";
    };
  }>;
  details?: Array<{
    id: string;
    asset_id: "detail_black_crow" | "detail_will_o_wisp" | "detail_blood_lantern" | "detail_incense_bowl" | "detail_skull_pile" | "detail_hanging_talisman" | "detail_iv_drip_stand" | "detail_shopping_cart" | "detail_surveillance_camera" | "detail_flickering_ceiling_lamp" | "detail_broken_mirror" | "detail_muddy_water_puddle" | "detail_oil_lamp" | "detail_vintage_radio" | "detail_water_hyacinth" | "detail_child_sandals" | "detail_offering_tray_toys" | "detail_matchbox" | "detail_water_droplets" | "detail_porridge_bowl" | "detail_npc_silhouette_standing" | "detail_npc_silhouette_walking" | "detail_npc_crowd_group" | "detail_npc_crowd_walking";
    slot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right" | "air_left" | "air_center" | "air_right";
    offsetX?: number;
    offsetY?: number;
    scale?: number;
  }>;
  space_divider?: {               // Tùy chọn cột/vách ngăn phân chia 2 không gian kiến trúc độc lập (vd: Ngoài hiên/sông vs Trong buồng nhà)
    slot: "far_left" | "mid_left" | "center" | "mid_right" | "far_right";
    style?: "wooden_pillar" | "bamboo_partition" | "brick_wall" | "black_silhouette";
    offsetX?: number;
    width?: number;
    label_left?: string;
    label_right?: string;
  };
  dialogue?: string;              // Lời thoại / Phụ đề điện ảnh hiển thị đáy màn hình
  subtitle_style?: "blood_red" | "smoky_grey" | "emerald_phantom" | "candle_amber" | "cyan_fluorescent"; // Font & theme chữ phụ đề cổ điển/kinh dị
  subtitle_anim?: "typewriter" | "word_fade" | "classic_fade"; // Hiệu ứng chữ xuất hiện theo nhịp diễn biến câu chuyện
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

### Ví dụ 4: Chuyến xe bus đêm nửa đêm, hành khách cầm điện thoại di động phát sáng đối mặt oan hồn
```json
{
  "scene_id": "scene_08_midnight_bus",
  "title": "Cảnh 8: Chuyến Xe Bus Nửa Đêm",
  "duration_sec": 6,
  "theme": "vehicle_interior",
  "lighting": {
    "sky_preset": "flickering_fluorescent",
    "fog_density": 0.35,
    "thunder_flash": false
  },
  "environment_items": [
    { "asset_id": "bus_interior", "slot": "mid_left", "scale": 1.0 }
  ],
  "actors": [
    {
      "id": "actor_passenger",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_scared",
      "pose": "pose_holding",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": 20,
      "scale": 1.0,
      "heldItem": "item_smartphone",
      "heldHand": "right",
      "motion": {
        "targetSlot": "center",
        "targetOffsetX": -30,
        "startTimeSec": 0.5,
        "endTimeSec": 5.0,
        "easing": "ease_in_out",
        "autoFaceTarget": true,
        "movingPose": "pose_walking"
      }
    },
    {
      "id": "actor_bus_ghost",
      "base": "ghost_wraith",
      "costume": "outfit_shredded_burial",
      "face": "face_haggard_gaunt",
      "pose": "pose_floating",
      "facing": "left",
      "slot": "air_right",
      "offsetX": -50,
      "offsetY": 30,
      "scale": 1.05
    }
  ],
  "details": [
    { "id": "detail_cam_bus", "asset_id": "detail_surveillance_camera", "slot": "air_left" },
    { "id": "detail_lamp_bus", "asset_id": "detail_flickering_ceiling_lamp", "slot": "air_center" }
  ],
  "dialogue": "Màn hình điện thoại chớp nháy cuộc gọi từ số lạ lúc 03:33 sáng... Quai nắm xe bus đu đưa trong khoang xe vắng lặng không một bóng người...",
  "narrative_note": "Hành khách trẻ bước đi dọc lối đi khoang xe bus đêm, soi sáng bằng màn hình smartphone xanh lạnh, bất giác phát hiện bóng ma áo liệm lơ lửng ở hàng ghế cuối."
}
```

### Ví dụ 5: Phòng tắm ma ám nửa đêm, bồn tắm rỉ máu và gương vỡ
```json
{
  "scene_id": "scene_09_creepy_bathroom",
  "title": "Cảnh 9: Ác Mộng Phòng Tắm Nửa Đêm",
  "duration_sec": 6,
  "theme": "modern_indoor",
  "lighting": {
    "sky_preset": "flickering_fluorescent",
    "fog_density": 0.6,
    "thunder_flash": false
  },
  "environment_items": [
    { "asset_id": "creepy_bathtub", "slot": "center", "scale": 1.0 }
  ],
  "actors": [
    {
      "id": "actor_victim",
      "base": "female_adult",
      "costume": "outfit_modern_casual",
      "face": "face_scared",
      "pose": "pose_shivering",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": 30,
      "scale": 1.0,
      "heldItem": "item_smartphone",
      "heldHand": "right",
      "motion": {
        "targetSlot": "center",
        "targetOffsetX": -80,
        "startTimeSec": 0.5,
        "endTimeSec": 4.5,
        "easing": "ease_in_out",
        "autoFaceTarget": true,
        "movingPose": "pose_walking"
      }
    },
    {
      "id": "actor_tub_ghost",
      "base": "ghost_wraith",
      "costume": "outfit_shredded_burial",
      "face": "face_weeping_ghost",
      "pose": "pose_floating",
      "facing": "left",
      "slot": "air_center",
      "offsetX": 40,
      "offsetY": 80,
      "scale": 1.1
    }
  ],
  "details": [
    { "id": "detail_mirror_1", "asset_id": "detail_broken_mirror", "slot": "mid_left", "offsetX": -60 },
    { "id": "detail_lamp_bath", "asset_id": "detail_flickering_ceiling_lamp", "slot": "air_left" }
  ],
  "dialogue": "Vòi nước đồng rỉ từng giọt máu tươi xuống đáy bồn tắm rỉ sét... Trên gương soi vỡ nát, dấu bàn tay đỏ ngầu bất ngờ hiện rõ...",
  "narrative_note": "Cô gái run rẩy cầm điện thoại tiến lại gần bồn tắm ngập nước đục, kinh hoàng nhìn thấy bóng ma trỗi dậy từ làn sương."
}
```

### Kịch Bản Mẫu 10: Oan Hồn Không Đầu Đêm Trăng Máu (Headless Specter Apparition)
```json
{
  "scene_id": "scene_10_headless_specter",
  "title": "Cảnh 10: Oan Hồn Không Đầu Đêm Trăng Máu",
  "duration_sec": 7,
  "theme": "rural_graveyard",
  "lighting": {
    "sky_preset": "blood_moon",
    "fog_density": 0.85,
    "thunder_flash": true
  },
  "environment_items": [
    { "asset_id": "haunted_gallows_tree", "slot": "far_left", "scale": 1.1 },
    { "asset_id": "ancient_tomb", "slot": "center", "offsetX": 20 }
  ],
  "actors": [
    {
      "id": "actor_headless_man",
      "base": "male_adult",
      "costume": "outfit_tattered_tunic",
      "face": "face_headless",
      "pose": "pose_walking",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": -40,
      "heldItem": "item_severed_head",
      "heldHand": "right",
      "motion": {
        "targetSlot": "center",
        "targetOffsetX": -60,
        "startTimeSec": 0.5,
        "endTimeSec": 5.5,
        "easing": "ease_in_out",
        "autoFaceTarget": true,
        "movingPose": "pose_walking"
      }
    },
    {
      "id": "actor_terrified_villager",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_scared",
      "pose": "pose_shivering",
      "facing": "left",
      "slot": "far_right",
      "offsetX": -30,
      "heldItem": "item_storm_lantern",
      "heldHand": "left"
    }
  ],
  "details": [
    { "id": "detail_skull_1", "asset_id": "detail_skull_pile", "slot": "mid_right", "offsetX": -20 },
    { "id": "detail_wisp_1", "asset_id": "detail_will_o_wisp", "slot": "air_center" }
  ],
  "dialogue": "Người đàn ông không có đầu lảo đảo bước ra từ bãi tha ma... Bàn tay vấy máu của hắn túm chặt tóc chiếc thủ cấp đang trừng mắt nhìn thẳng vào kẻ đối diện...",
  "narrative_note": "Chi tiết kinh dị trung tâm: thực thể không đầu lừng lững bước đi trong đêm trăng máu với cuống cổ đứt lìa, tay xách chiếc đầu lâu rỉ máu."
}
```

### Cảnh Mẫu 8: Chuyến Xe Buýt Đêm & Người Đàn Ông Chân Xoay Ngược Lơ Lửng

```json
{
  "scene_id": "scene_bus_night_horror",
  "title": "Chuyến Xe Buýt Đêm Kỳ Dị",
  "duration_sec": 7,
  "theme": "vehicle_interior",
  "lighting": {
    "sky_preset": "dim_indoor_night",
    "fog_density": 0.45,
    "flicker_speed": "flicker_slow"
  },
  "environment_items": [
    { "asset_id": "bus_interior", "slot": "center" }
  ],
  "actors": [
    {
      "id": "actor_lan",
      "base": "female_adult",
      "costume": "outfit_modern_casual",
      "face": "face_scared",
      "pose": "pose_sitting",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": -30,
      "offsetY": 0,
      "scale": 1,
      "heldItem": "item_smartphone",
      "heldHand": "right"
    },
    {
      "id": "actor_creepy_man",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_creepy_smile",
      "pose": "pose_sitting_twisted_legs",
      "facing": "left",
      "slot": "mid_right",
      "offsetX": 40,
      "offsetY": 0,
      "scale": 1,
      "heldItem": "none"
    }
  ],
  "details": [
    { "id": "detail_flicker_lamp", "asset_id": "detail_flickering_ceiling_lamp", "slot": "air_center" },
    { "id": "detail_cam", "asset_id": "detail_surveillance_camera", "slot": "air_right" }
  ],
  "dialogue": "Lan ngồi co ro trên ghế xe buýt, ánh sáng màn hình điện thoại rọi tỏ nét mặt bàng hoàng của cô khi nhìn xuống phía đối diện: đôi chân của người đàn ông kỳ lạ đó đang xoay ngược hẳn ra sau lưng, hai bàn chân lơ lửng cách mặt sàn vài phân không hề chạm đất...",
  "narrative_note": "Chi tiết dị dạng kinh dị: hai nhân vật đều đang ngồi trên xe buýt, nhưng người đàn ông mang tư thế pose_sitting_twisted_legs với đôi chân vặn ngược 180 độ lơ lửng trên sàn xe."
}
```

---

## 9. HỆ THỐNG GÓC MÁY ĐIỆN ẢNH (CINEMATIC CAMERA SYSTEM)

Hệ thống cho phép đạo diễn chuyển đổi linh hoạt giữa các cỡ cảnh và hiệu ứng ống kính để tăng tối đa cảm xúc rùng rợn, khai thác triệt để độ phân giải vector vô hạn của SVG (không bao giờ vỡ hạt khi zoom).

### 9.1. 7 Cỡ Cảnh Chuẩn (`camera.shot`)
| Shot ID | Tên Tiếng Việt | Zoom Mặc Định | Mô Tả & Tác Dụng Ngữ Nghĩa |
| :--- | :--- | :--- | :--- |
| `extreme_wide` | Đại cảnh | `0.88x` | Bao quát mênh mông, nhân vật lọt thỏm cô độc giữa không gian hiểm ác |
| `wide` | Toàn cảnh | `1.0x` | *(Mặc định)* Toàn bộ sân khấu 1920x1080, thấy đầy đủ 5 vị trí đất |
| `medium_wide` | Trung toàn cảnh | `1.45x` | Đóng khung từ đầu gối lên, thấy rõ nhân vật tương tác với công trình |
| `medium` | Trung cảnh | `1.9x` | Từ thắt lưng lên đầu, nhấn mạnh vào hành động tay, bùa chú, vũ khí |
| `close_up` | Cận cảnh | `2.85x` | Từ ngực lên đầu, thấy rõ biểu cảm kinh hãi, mắt chớp, miệng há hốc |
| `extreme_close_up` | Đặc tả | `4.3x` | Phóng đại tối đa vào tròng mắt rỉ máu, nụ cười quái đản, mũi dao găm |
| `dutch_tilt` | Góc nghiêng ma mị | `1.6x` (Góc: `-7.5°`) | Camera nghiêng tạo cảm giác điên loạn, bất an, tà khí bóp méo thực tại |

### 9.2. Khóa Tiêu Điểm Thông Minh (`target_actor_id` & `target_slot`)
- `target_actor_id`: Điền ID của nhân vật (ví dụ `"actor_lan"`). Camera tự động căn góc tầm mặt nhân vật. Nếu nhân vật đang di chuyển A → B, camera sẽ **tự động bám theo nhân vật theo thời gian thực (Tracking Shot)**!
- `target_slot`: Khóa khung nhìn vào một mốc neo slot (ví dụ `"center"` hoặc `"mid_left"`).

### 9.3. Rung Lắc Ống Kính (`camera.shake`)
- `"none"` (Mặc định bắt buộc): Khung hình ổn định, sắc nét, không rung lắc.
- `"subtle_handheld"`: Dao động nhẹ tự nhiên mô phỏng máy quay cầm tay trong đêm (chỉ dùng khi người dùng yêu cầu góc nhìn máy quay cầm tay).
- `"creepy_tremor"`: Run rẩy rùng mình khi có tà khí lạnh hoặc chấn động nhẹ.
- `"heavy_jumpscare"`: Giật nảy dữ dội khi có sấm sét, động đất, nổ tung, quỷ dữ vồ hoặc cú hù dọa kinh hoàng (jumpscare).

> [!IMPORTANT]
> **QUY TẮC RUNG LẮC:** Mặc định của camera luôn là `"none"`! TUYỆT ĐỐI KHÔNG tự tiện thêm hiệu ứng rung lắc vào tất cả các phân cảnh nếu người dùng không yêu cầu hoặc không có tình tiết động đất, chấn động, nổ tung hay quỷ vồ thình lình.

### 9.4. Chuyển Động Máy Quay Theo Thời Gian (`camera.motion`)
- `type`:
  - `"push_in"`: Zoom từ từ tiến sát vào mặt đối tượng (Dolly In - tăng hồi hộp).
  - `"pull_out"`: Zoom từ từ lùi ra xa (Dolly Out - làm lộ bóng đen sau lưng).
  - `"pan_left"` / `"pan_right"`: Lia máy sang trái/phải.
  - `"tilt_up"` / `"tilt_down"`: Lia máy lên trời/xuống đất.
  - `"follow_actor"`: Camera bám theo bước chân nhân vật di chuyển.
- `endZoom`: Hệ số zoom đích.
- `startTimeSec`, `endTimeSec`: Thời điểm bắt đầu và kết thúc chuyển động.
- `easing`: `"ease_in_out"` | `"linear"` | `"ease_in"` | `"ease_out"`.

### 9.5. Đa Góc Máy Trong Cùng 1 Phân Cảnh (`camera.keyframes` - Multi-Shot Timeline)
Thay vì giữ nguyên 1 góc máy cố định suốt cả phân cảnh dài, AI Director tự suy luận và đạo diễn **chuỗi 2–4 góc máy nối tiếp** ngay trong cùng 1 cảnh qua mảng `camera.keyframes`:
- `startTimeSec`: Mốc bắt đầu góc máy (giây, phần tử đầu tiên luôn bắt đầu từ `0`).
- `transition`:
  - `"cut"` (mặc định): Cắt máy dứt khoát giữa các cỡ cảnh (rất hợp phim kinh dị: toàn cảnh → cắt cận mặt, hoặc shot/reverse-shot giữa nạn nhân và bóng ma).
  - `"smooth"`: Nội suy lia/zoom mượt mà từ góc trước sang góc này (kèm `transitionDurationSec`: `0.8–1.5`, `easing`: `"ease_in_out"`).
- `shot`, `target_actor_id`, `target_slot`, `zoom`, `pan_x`, `pan_y`, `dutch_angle`, `shake`, `motion`: Độc lập cho từng nhịp góc máy.

```json
"camera": {
  "shot": "wide",
  "shake": "none",
  "keyframes": [
    { "startTimeSec": 0, "transition": "cut", "shot": "wide", "shake": "none" },
    { "startTimeSec": 3.5, "transition": "cut", "shot": "medium", "target_actor_id": "actor_1", "shake": "none" },
    { "startTimeSec": 7.0, "transition": "smooth", "transitionDurationSec": 1.0, "shot": "close_up", "target_actor_id": "actor_1", "shake": "none", "motion": { "type": "push_in", "endZoom": 3.3 } }
  ]
}
```

### 9.6. Kịch Bản JSON Mẫu Có Góc Máy Cận Cảnh & Rung Chấn
```json
{
  "scene_id": "scene_close_up_ghost_reveal",
  "title": "Khuôn Mặt Oan Hồn Xuất Hiện",
  "duration_sec": 5,
  "theme": "rural_graveyard",
  "lighting": {
    "sky_preset": "blood_moon",
    "fog_density": 0.6
  },
  "camera": {
    "shot": "close_up",
    "target_actor_id": "ghost_oan_hon",
    "dutch_angle": -6,
    "shake": "none",
    "motion": {
      "type": "push_in",
      "endZoom": 3.6,
      "startTimeSec": 1.0,
      "endTimeSec": 4.5,
      "easing": "ease_in_out"
    }
  },
  "actors": [
    {
      "id": "ghost_oan_hon",
      "base": "female_adult",
      "costume": "outfit_shredded_burial",
      "face": "face_screaming_gasp",
      "facialAction": "bleeding_tears",
      "pose": "pose_floating",
      "facing": "left",
      "slot": "center"
    }
  ],
  "dialogue": "Oan hồn chầm chậm ngẩng đầu lên, từ hai hốc mắt đen ngòm, những giọt máu tươi đặc quánh bắt đầu tuôn trào ròng ròng xuống gò má trắng bệch...",
  "narrative_note": "Cận cảnh khuôn mặt ma nữ khóc ra máu bleeding_tears kết hợp cú push_in ống kính và góc nghiêng ma mị dutch_angle để tạo cảm giác ngột ngạt."
}
```

### 9.6. Kịch Bản JSON Mẫu: Chợ Đêm Mưa Neon & Lối Vào Ga Tàu Điện Ngầm Bỏ Hoang
```json
{
  "scene_id": "scene_urban_night_subway_reveal",
  "title": "Mẩu Giấy Bí Ẩn Dẫn Vào Cổng Ga Tàu Ngầm",
  "duration_sec": 7,
  "theme": "urban_night_market",
  "lighting": {
    "sky_preset": "foggy_night",
    "fog_density": 0.75,
    "thunder_flash": false,
    "weather": "heavy_rain"
  },
  "camera": {
    "shot": "medium_wide",
    "target_slot": "center",
    "shake": "none",
    "motion": {
      "type": "pan_right",
      "startTimeSec": 0.5,
      "endTimeSec": 6.0,
      "easing": "ease_in_out"
    }
  },
  "environment_items": [
    { "asset_id": "market_stall_tent", "slot": "far_left", "scale": 1.0 },
    { "asset_id": "abandoned_subway_station", "slot": "center", "scale": 1.05 }
  ],
  "actors": [
    {
      "id": "actor_hai",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_scared",
      "facialAction": "darting_eyes",
      "pose": "pose_holding",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": 20,
      "scale": 1.0,
      "heldItem": "item_mysterious_note",
      "heldHand": "right",
      "motion": {
        "targetSlot": "center",
        "targetOffsetX": -80,
        "startTimeSec": 0.8,
        "endTimeSec": 5.8,
        "easing": "ease_in_out",
        "autoFaceTarget": true,
        "movingPose": "pose_walking"
      }
    }
  ],
  "details": [
    { "id": "detail_lantern_stall", "asset_id": "detail_blood_lantern", "slot": "far_left", "offsetX": 60 },
    { "id": "detail_subway_camera", "asset_id": "detail_surveillance_camera", "slot": "air_center" }
  ],
  "dialogue": "Dưới cơn mưa tầm tã bên dãy lều bạt chợ đêm, mẩu giấy bí ẩn trên tay Hải chỉ dẫn thẳng vào cửa hầm trạm tàu điện ngầm bỏ hoang...",
  "narrative_note": "Cốt truyện đô thị kinh dị: Hải cầm mẩu giấy ố máu che mưa bước dọc vỉa hè tiến về lối vào trạm ga tàu ngầm bị niêm phong."
}
```

### 9.7. Kịch Bản JSON Mẫu: Hải Kiệt Sức Gục Ngã Trước Cổng Sắt Chung Cư Cũ
```json
{
  "scene_id": "scene_ending_old_apartment_gate",
  "title": "Hải Kiệt Sức Trước Cổng Chung Cư Cũ",
  "duration_sec": 6,
  "theme": "urban_night_market",
  "lighting": {
    "sky_preset": "dim_indoor_night",
    "fog_density": 0.7,
    "weather": "haunted_mist"
  },
  "camera": {
    "shot": "medium_wide",
    "target_slot": "center",
    "shake": "subtle_handheld",
    "motion": {
      "type": "push_in",
      "endZoom": 1.45,
      "startTimeSec": 0.5,
      "endTimeSec": 5.5,
      "easing": "ease_in_out"
    }
  },
  "environment_items": [
    {
      "asset_id": "structure_old_apartment_gate",
      "slot": "center",
      "offsetX": 0,
      "offsetY": 0,
      "scale": 1.0
    }
  ],
  "actors": [
    {
      "id": "actor_hai",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_haggard_gaunt",
      "facialAction": "heavy_panting",
      "pose": "pose_kneeling",
      "facing": "right",
      "slot": "center",
      "offsetX": -50,
      "offsetY": 0,
      "scale": 1.0
    }
  ],
  "details": [
    {
      "id": "detail_crow_gate",
      "asset_id": "detail_black_crow",
      "slot": "air_right",
      "offsetX": -80,
      "offsetY": 40
    }
  ],
  "dialogue": "Sau chuỗi ngày chạy trốn trong vô vọng, Hải lê bước kiệt sức rồi gục ngã trước cánh cổng sắt lạnh lẽo khóa chặt của khu chung cư cũ kỹ nơi cậu từng sống...",
  "narrative_note": "Cảnh kết thúc bi thảm: Hải gục ngã (pose_kneeling, face_haggard_gaunt, heavy_panting) ngay trước cổng sắt chung cư cũ (structure_old_apartment_gate) tại slot center."
}
```

### 9.8. Kịch Bản JSON Mẫu: Đêm Cúng Cô Hồn Bên Mé Kênh Nước Nổi Miền Tây (Áo Bà Ba Trắng, Xuồng Ba Lá, Đồ Cúng Đất Nung, Quạt Mo & Gừng Tươi)
```json
{
  "scene_id": "scene_mekong_canal_offering",
  "title": "Đêm Cúng Cô Hồn Mé Kênh Cô Hai Lụa",
  "duration_sec": 7,
  "theme": "cursed_swamp",
  "lighting": {
    "sky_preset": "foggy_night",
    "fog_density": 0.72,
    "thunder_flash": false,
    "weather": "haunted_mist"
  },
  "camera": {
    "shot": "wide",
    "shake": "none",
    "keyframes": [
      { "startTimeSec": 0, "transition": "cut", "shot": "wide", "shake": "none" },
      { "startTimeSec": 3.0, "transition": "cut", "shot": "medium", "target_actor_id": "actor_grandma", "shake": "none" },
      { "startTimeSec": 5.0, "transition": "smooth", "transitionDurationSec": 1.0, "shot": "close_up", "target_actor_id": "actor_hai_lua", "shake": "none" }
    ]
  },
  "environment_items": [
    { "asset_id": "creepy_banyan_tree", "slot": "far_left", "scale": 1.0 },
    { "asset_id": "structure_monkey_bridge", "slot": "center", "scale": 0.95 },
    { "asset_id": "structure_wooden_sampan", "slot": "far_right", "offsetX": -40, "scale": 1.0 }
  ],
  "actors": [
    {
      "id": "actor_grandma",
      "base": "elder_hunched",
      "costume": "outfit_tattered_tunic",
      "face": "face_old_wrinkled",
      "facialAction": "talking_jaw",
      "pose": "pose_holding",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": -40,
      "offsetY": 0,
      "scale": 1.0,
      "heldItem": "item_offering_toys",
      "heldHand": "right"
    },
    {
      "id": "actor_minh",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_scared",
      "facialAction": "darting_eyes",
      "pose": "pose_standing",
      "facing": "right",
      "slot": "far_left",
      "offsetX": 95,
      "offsetY": 0,
      "scale": 0.95,
      "heldItem": "item_areca_palm_fan",
      "heldHand": "right"
    },
    {
      "id": "actor_hai_lua",
      "base": "female_adult",
      "costume": "outfit_traditional_ba_ba",
      "face": "face_weeping_ghost",
      "facialAction": "crying_tears",
      "pose": "pose_standing",
      "facing": "left",
      "slot": "far_right",
      "offsetX": -40,
      "offsetY": 0,
      "scale": 1.0,
      "opacity": 0.78,
      "heldItem": "none"
    }
  ],
  "details": [
    { "id": "detail_sandals_bridge", "asset_id": "detail_child_sandals", "slot": "center", "offsetX": -120, "offsetY": 0, "scale": 1.0 },
    { "id": "detail_tray_ground", "asset_id": "detail_offering_tray_toys", "slot": "mid_left", "offsetX": 20, "offsetY": 0, "scale": 1.0 },
    { "id": "detail_wisp_canal", "asset_id": "detail_will_o_wisp", "slot": "air_right" }
  ],
  "dialogue": "Bà ngoại khom lưng đặt mẹt nải chuối cùng bộ đồ chơi đất nung xuống nền đất hoang, nén nhang đỏ tỏa làn khói trắng cuộn trong sương... Cạnh chân cầu khỉ, đôi dép tổ ong nhỏ xíu của đứa trẻ bỏ lại vương bùn non lạnh ngắt. Ngoài mé kênh, bóng người phụ nữ mặc áo bà ba trắng tóc xõa dài vẫn đứng lặng lẽ nhìn theo...",
  "narrative_note": "Tổ hợp asset văn hóa kinh dị Nam Bộ: mẹt cúng cô hồn tiếp đất detail_offering_tray_toys tỏa làn khói nhang mỏng, đôi dép trẻ con bỏ lại đầu cầu khỉ detail_child_sandals lấm lem bùn non, cầu khỉ tre miền Tây structure_monkey_bridge bắc ngang kênh, bóng cô Hai Lụa mặc outfit_traditional_ba_ba đứng cạnh xuồng ba lá structure_wooden_sampan."
}
```

### 9.8. Ví Dụ 8: Minh Nằm Trốn Trong Mùng Tre & Vệt Bùn Tràn Qua Khe Then Cửa Gỗ (Tái Hiện Cảnh Đêm Kinh Hoàng)
```json
{
  "scene_id": "scene_08_bed_net_latch_door_mud",
  "title": "Nằm Co Ro Trong Mùng Nghe Tiếng Gõ Cửa",
  "duration_sec": 7.0,
  "theme": "abandoned_village",
  "lighting": {
    "sky_preset": "foggy_night",
    "fog_density": 0.65,
    "weather": "haunted_mist"
  },
  "camera": {
    "shot": "medium",
    "target_slot": "center",
    "keyframes": [
      { "startTimeSec": 0.0, "transition": "cut", "shot": "medium_wide", "target_slot": "center" },
      { "startTimeSec": 3.5, "transition": "smooth", "transitionDurationSec": 1.2, "shot": "close_up", "target_slot": "mid_right", "shake": "creepy_tremor" }
    ]
  },
  "environment_items": [
    { "asset_id": "structure_bamboo_bed_net", "slot": "mid_left", "scale": 1.0 },
    { "asset_id": "structure_wooden_latch_door", "slot": "mid_right", "offsetX": 20, "scale": 1.0, "isShaking": true }
  ],
  "actors": [
    {
      "id": "actor_minh_sleeping",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_screaming_gasp",
      "facialAction": "darting_eyes",
      "pose": "pose_lying_down",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": 0,
      "offsetY": -80,
      "scale": 1.0,
      "heldItem": "item_fresh_ginger",
      "heldHand": "right"
    }
  ],
  "details": [
    { "id": "detail_lamp_side", "asset_id": "detail_oil_lamp", "slot": "mid_left", "offsetX": 135, "offsetY": -75, "scale": 0.9 },
    { "id": "detail_radio_desk", "asset_id": "detail_vintage_radio", "slot": "mid_left", "offsetX": 165, "offsetY": -75, "scale": 0.85 },
    { "id": "detail_mud_door", "asset_id": "detail_muddy_water_puddle", "slot": "mid_right", "offsetX": 20, "offsetY": 0, "scale": 1.1 }
  ],
  "dialogue": "Minh nằm cứng đờ bên trong tấm mùng tre, hai tay bóp chặt lát gừng tươi, tim đập thình thịch khi nghe tiếng then cài gỗ rung lên bần bật... Phía dưới khe hở chân cửa, một vệt nước đen ngòm lẫn bùn non lạnh ngắt đang từ từ tràn qua nền đất...",
  "narrative_note": "Tổ hợp asset đắt giá: Minh nằm tư thế pose_lying_down với offsetY: -80 đặt vừa khít mặt giường tre structure_bamboo_bed_net, nhìn xuyên thấu qua lớp mùng mỏng; cánh cửa gỗ cài then structure_wooden_latch_door rung rinh và vệt bùn tràn qua chân cửa detail_muddy_water_puddle; đài radio cassette detail_vintage_radio và đèn dầu detail_oil_lamp."
}
```

### 9.9. Ví Dụ 9: Đám Tang Bà Ngoại Bên Cỗ Quan Tài Gỗ & Chuyến Xe Đò Vùng Quê
```json
{
  "scene_id": "scene_09_funeral_coffin_and_bus",
  "title": "Cỗ Quan Tài Gỗ & Chuyến Xe Đò Rời Bến",
  "duration_sec": 8.0,
  "theme": "rural_graveyard",
  "lighting": {
    "sky_preset": "stormy_dark",
    "fog_density": 0.5,
    "weather": "haunted_mist"
  },
  "camera": {
    "shot": "wide",
    "target_slot": "center"
  },
  "environment_items": [
    { "asset_id": "structure_rural_passenger_bus", "slot": "far_left", "offsetX": 40, "scale": 0.95 },
    { "asset_id": "structure_wooden_coffin", "slot": "center", "scale": 1.0 },
    { "asset_id": "structure_coconut_banana_grove", "slot": "far_right", "scale": 1.0 }
  ],
  "actors": [
    {
      "id": "actor_minh_mourning",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_scared",
      "facialAction": "crying_tears",
      "pose": "pose_standing",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": 20,
      "scale": 1.0,
      "heldItem": "item_soul_candle",
      "heldHand": "right"
    }
  ],
  "details": [
    { "id": "detail_coffin_lamp", "asset_id": "detail_oil_lamp", "slot": "center", "offsetX": -120, "offsetY": 0, "scale": 1.0 },
    { "id": "detail_coffin_incense", "asset_id": "detail_incense_bowl", "slot": "center", "offsetX": 120, "offsetY": 0, "scale": 1.0 },
    { "id": "detail_water_hyacinth_ditch", "asset_id": "detail_water_hyacinth", "slot": "far_right", "offsetX": -80, "offsetY": 0, "scale": 1.0 }
  ],
  "dialogue": "Giữa gian nhà quạnh quẽ, cỗ quan tài gỗ khắc chữ Thọ trầm mặc dưới ánh đèn dầu leo lét. Phía ngoài đường lộ ven rặng dừa nước, chiếc xe đò cũ kỹ đã rồ ga chuẩn bị lăn bánh...",
  "narrative_note": "Tổ hợp asset: cỗ quan tài gỗ structure_wooden_coffin kê trên đôn gỗ có dải băng tang trắng, rặng dừa và bụi chuối structure_coconut_banana_grove, xe đò structure_rural_passenger_bus và bụi lục bình detail_water_hyacinth."
}
```

### Cấu Trúc JSON Mẫu 10: Gian Phòng Ngủ Cổ U Ám - Ghế Gỗ & Giường Gỗ Tương Tác Khung Nhân Vật (Ngồi & Nằm Khớp Khít)

```json
{
  "scene_id": "scene_10_creepy_bedroom_chair_bed",
  "theme": "abandoned_village",
  "duration_sec": 7.0,
  "lighting": {
    "sky_preset": "dim_indoor_night",
    "fog_density": 0.45,
    "ambient_tint": "#1E1B18",
    "thunder_flash": false,
    "weather": "haunted_mist"
  },
  "camera": {
    "shot": "medium_wide",
    "target_slot": "center",
    "shake": "subtle_handheld",
    "motion": {
      "type": "push_in",
      "endShot": "medium",
      "startTimeSec": 0,
      "endTimeSec": 7.0,
      "easing": "ease_in_out"
    }
  },
  "environment_items": [
    { "asset_id": "structure_wooden_bed", "slot": "mid_left", "scale": 1.0 },
    { "asset_id": "structure_wooden_chair", "slot": "mid_right", "scale": 1.0, "facing": "left" }
  ],
  "actors": [
    {
      "id": "actor_sleeping_corpse",
      "base": "female_adult",
      "costume": "outfit_shredded_burial",
      "face": "face_pale_corpse",
      "pose": "pose_lying_down",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": 0,
      "offsetY": -80,
      "scale": 1.0,
      "opacity": 0.95,
      "heldItem": "item_fresh_ginger",
      "heldHand": "right"
    },
    {
      "id": "actor_seated_watcher",
      "base": "elder_hunched",
      "costume": "outfit_traditional_ba_ba",
      "face": "face_creepy_smile",
      "facialAction": "talking_jaw",
      "pose": "pose_sitting",
      "facing": "left",
      "slot": "mid_right",
      "offsetX": 0,
      "offsetY": 0,
      "scale": 1.0,
      "opacity": 1.0,
      "heldItem": "item_soul_candle",
      "heldHand": "right"
    }
  ],
  "details": [
    { "id": "detail_oil_lamp_bedside", "asset_id": "detail_oil_lamp", "slot": "mid_left", "offsetX": 130, "offsetY": 0, "scale": 1.0 },
    { "id": "detail_incense_chair", "asset_id": "detail_incense_bowl", "slot": "mid_right", "offsetX": -60, "offsetY": 0, "scale": 0.9 },
    { "id": "detail_hanging_talisman_room", "asset_id": "detail_hanging_talisman", "slot": "air_center", "offsetX": 0, "offsetY": 0, "scale": 1.0 }
  ],
  "dialogue": "Người phụ nữ nằm nghỉ ngơi trên chiếc giường gỗ quen thuộc trong gian phòng yên tĩnh. Ở góc đối diện, người thân ngồi trò chuyện trên chiếc ghế tựa gỗ bên ánh đèn leo lét...",
  "narrative_note": "Tổ hợp tương tác hoàn hảo: structure_wooden_bed kết hợp nhân vật nằm pose_lying_down (offsetY: -80 đặt vừa khít mặt nệm giường) và structure_wooden_chair quay mặt sang trái (facing: 'left') kết hợp nhân vật ngồi pose_sitting (đùi gập trên mặt ghế Y=-72px, chân chạm đất phẳng phiu)."
}
```

### 10.6. Mẫu Kịch Bản 6: Đêm Kinh Hoàng Gian Nhà Lá - Cửa Sổ Gỗ Khép Hờ, Bàn Nhỏ & Đèn Dầu Hột Vịt (Scene 2, 4 & 7)

```json
{
  "scene_id": "scene_rural_night_mystery",
  "title": "Bóng Đen Ngoài Cửa Sổ & Ánh Đèn Dầu Giữa Đêm",
  "duration_sec": 7,
  "theme": "abandoned_village",
  "camera": {
    "shot": "medium_shot",
    "angle": "eye_level",
    "movement": "pan_right",
    "shake": false,
    "flash": false
  },
  "lighting": {
    "sky_preset": "dim_indoor_night",
    "ambient_tint": "rgba(10, 8, 14, 0.45)",
    "fog_density": 0.28,
    "weather": "haunted_mist"
  },
  "environment_items": [
    {
      "asset_id": "structure_bamboo_bed_net",
      "slot": "mid_left",
      "offsetX": 0,
      "offsetY": 0,
      "scale": 1.0
    },
    {
      "asset_id": "structure_wooden_window",
      "slot": "far_left",
      "offsetX": -30,
      "offsetY": 0,
      "scale": 1.0
    },
    {
      "asset_id": "structure_small_wooden_table",
      "slot": "center",
      "offsetX": 40,
      "offsetY": 0,
      "scale": 1.0
    }
  ],
  "actors": [
    {
      "id": "actor_minh",
      "base": "male_adult",
      "costume": "outfit_funeral_white",
      "face": "face_scared",
      "facialAction": "darting_eyes",
      "pose": "pose_holding",
      "facing": "left",
      "slot": "mid_left",
      "offsetX": 70,
      "offsetY": 0,
      "scale": 1.0,
      "opacity": 1.0,
      "heldItem": "item_oil_lamp",
      "heldHand": "right"
    },
    {
      "id": "actor_ghost_outside",
      "base": "ghost_wraith",
      "costume": "outfit_flowing_ao_dai",
      "face": "face_faceless",
      "facialAction": "none",
      "pose": "pose_floating",
      "facing": "right",
      "slot": "air_left",
      "offsetX": -120,
      "offsetY": 40,
      "scale": 0.85,
      "opacity": 0.65,
      "heldItem": "none",
      "heldHand": "right"
    }
  ],
  "details": [
    {
      "id": "detail_lamp_on_table",
      "asset_id": "detail_oil_lamp",
      "slot": "center",
      "offsetX": 10,
      "offsetY": -75,
      "scale": 0.95
    },
    {
      "id": "detail_radio_on_table",
      "asset_id": "detail_vintage_radio",
      "slot": "center",
      "offsetX": 65,
      "offsetY": -75,
      "scale": 0.9
    }
  ],
  "dialogue": "Minh cầm chặt cây đèn dầu hột vịt nhỏ trong tay, run rẩy nhìn về phía khe cửa sổ gỗ khép hờ. Bên ngoài màn sương lạnh buốt, một bóng hình ma quái đang lặng lẽ dòm vào...",
  "narrative_note": "Tổ hợp visual chuẩn xác: structure_wooden_window tại vách trái với ánh sương lạnh lọt qua khe cửa; structure_small_wooden_table tại center làm bệ đỡ cho detail_oil_lamp và detail_vintage_radio ở tọa độ offsetY: -75 vừa khít mặt bàn; diễn viên Minh cầm item_oil_lamp tỏa quầng sáng vàng ấm soi rọi đối diện bóng ma ghost_wraith."
}
```

### 9.13. Kịch Bản JSON Mẫu: Gian Nhà Lá Ba Gian Ban Đêm Bên Bàn Thờ Tổ Tiên
```json
{
  "scene_id": "scene_thatched_house_altar_ritual",
  "title": "Bên Trong Gian Nhà Lá U Tịch",
  "duration_sec": 7,
  "theme": "thatched_house_interior",
  "lighting": {
    "sky_preset": "dim_indoor_night",
    "fog_density": 0.5,
    "weather": "haunted_mist"
  },
  "camera": {
    "shot": "medium_wide",
    "target_slot": "center",
    "shake": "subtle_handheld",
    "motion": {
      "type": "push_in",
      "endZoom": 1.35,
      "startTimeSec": 0.5,
      "endTimeSec": 6.5,
      "easing": "ease_in_out"
    }
  },
  "environment_items": [
    {
      "asset_id": "structure_ancestor_altar",
      "slot": "center",
      "scale": 1.0
    },
    {
      "asset_id": "structure_bamboo_bed_net",
      "slot": "far_left",
      "scale": 0.95
    },
    {
      "asset_id": "structure_wooden_latch_door",
      "slot": "far_right",
      "scale": 1.0
    },
    {
      "asset_id": "structure_small_wooden_table",
      "slot": "mid_right",
      "scale": 0.9,
      "offsetX": -30
    }
  ],
  "actors": [
    {
      "id": "actor_elder_grandmother",
      "base": "elder_hunched",
      "costume": "outfit_traditional_ba_ba",
      "face": "face_old_wrinkled",
      "facialAction": "darting_eyes",
      "pose": "pose_shivering",
      "facing": "right",
      "slot": "mid_left",
      "scale": 0.95,
      "opacity": 1.0,
      "heldItem": "item_soul_candle",
      "heldHand": "right"
    }
  ],
  "details": [
    {
      "id": "detail_lamp_on_table",
      "asset_id": "detail_oil_lamp",
      "slot": "mid_right",
      "offsetX": -30,
      "offsetY": -75,
      "scale": 0.95
    },
    {
      "id": "detail_talisman_ceiling",
      "asset_id": "detail_hanging_talisman",
      "slot": "air_center"
    }
  ],
  "dialogue": "Ánh đèn dầu leo lét trên bàn thờ tổ tiên hắt bóng bà Hai chập chờn lên bức vách nứa. Ngoài sân, tiếng gió rít qua rui mè tre lạnh buốt xương sống...",
  "narrative_note": "Không gian thuần chất kinh dị Nam Bộ: theme thatched_house_interior với vách nứa đan nan tre, vì kèo tre rủ mái tranh; structure_ancestor_altar ở trung tâm nghi ngút khói nhang đỏ rực; giường tre giăng mùng ở far_left và cửa gỗ cài then ở far_right."
}
```

---

## 9. QUY CHUẨN TƯƠNG TÁC ASSETS ĐẶC BIỆT TRÊN CAO & NỘI THẤT (FURNITURE & ELEVATED STRUCTURES)

Khi phân cảnh xuất hiện các công trình đặc biệt (Cầu thang gỗ, Cầu khỉ tre, Cầu gỗ gãy, Giường, Ghế, Võng), đạo diễn LLM BẮT BUỘC thiết lập tương tác thực tế thông qua các trường:
- `interact_with`: ID công trình tương tác.
- `offsetY`: Tọa độ bù trục Y để nhân vật tiếp xúc chuẩn xác với mặt phẳng vật lý.
- `motion`: Di chuyển có cao độ (`targetOffsetY`, `movingPose`).

### Bảng tra cứu tương tác chuẩn:

| Công trình (`interact_with`) | Tư thế nhân vật (`pose` / `movingPose`) | `offsetY` / `targetOffsetY` | Hành vi & Diễn xuất trực quan |
| :--- | :--- | :--- | :--- |
| **`structure_wooden_stairs`** | `pose_climbing_stairs`<br>(kèm khối motion) | `offsetY: 0` -> `targetOffsetY: -180` | **Leo cầu thang lên gác lửng:** Chân trước co gối bước lên từng bậc, thân nghiêng về trước, tay vịn lan can leo từ sàn lên đỉnh gác Y=-180px. |
| **`structure_wooden_stairs`** | `pose_standing`<br>hoặc `pose_shivering` | `offsetY: -180` | **Đứng quan sát trên đỉnh gác lửng:** Đứng vững chãi trên chiếu nghỉ sàn gác nhìn xuống tầng trệt. |
| **`structure_monkey_bridge`** | `pose_balancing_bridge` | `offsetY: -115` | **Đi thăng bằng qua cầu khỉ:** Hai chân so le thẳng hàng trên thân tre, đầu gối chùng, hai tay dang ngang giữ thăng bằng soi đèn qua kênh tối. |
| **`broken_wooden_bridge`** | `pose_balancing_bridge`<br>hoặc `pose_walking` | `offsetY: -110` | **Bước lên nhịp cầu gãy:** Đứng chênh vênh ở độ cao Y=-110px sát mép gãy của cầu gỗ nhìn xuống vực. |
| **`structure_wooden_bed`**<br>hoặc **`structure_bamboo_bed_net`** | `pose_lying_down` | `offsetY: -80` | **Nằm ngủ / co ro trên giường:** Toàn thân nằm phẳng phiu trên mặt nệm, đầu kê gối, nằm lọt trong mùng. |
| **`structure_wooden_bed`**<br>hoặc **`structure_bamboo_bed_net`** | `pose_sitting_bed` | `offsetY: -80` | **Ngồi xếp bằng trên giường:** Hai chân khoanh đan chéo phẳng phiu, hai tay đặt trên gối hoặc giơ bùa/đèn niệm chú. |
| **`structure_hammock`** | `pose_lying_hammock` | `offsetY: -60` | **Nằm võng đung đưa:** Thân người uốn cong lọt lòng võng, đầu kê gối võng, đung đưa kẽo kẹt theo nhịp võng. |
| **`structure_wooden_chair`** | `pose_sitting`<br>hoặc `pose_sitting_twisted_legs` | `offsetY: 0` | **Ngồi ghế tựa:** Đùi gập ngang mặt ghế Y=-72px, cẳng chân buông xuống sàn Y=0px phẳng phiu. |
| **`structure_ancestor_altar`**<br>(hoặc mặt sàn) | `pose_kneeling` | `offsetY: 0` | **Quỳ lạy khấn vái:** Đầu gối tiếp đất, hai tay chắp trước ngực khấn vái linh thiêng trước bàn thờ tổ tiên hoặc quỳ van xin. |
| **(Mọi bối cảnh sàn/đất)** | `pose_squatting` | `offsetY: 0` | **Ngồi xổm / chồm hổm:** Đầu gối nhô cao sát ngực, ngồi nép góc tối hoặc rình rập trong bóng đêm. |
| **(Mọi bối cảnh sàn/đất/đường lộ)** | `pose_lying_ground` | `offsetY: 0` | **Nằm sõng soài / gục ngã trên đất:** Toàn thân nằm phẳng rạp sát sàn đất, không có gối, má áp sát nền đất, hai tay buông rũ, bất tỉnh hoặc xác chết nằm bẹp. |
| **`cursed_swamp`**<br>hoặc **`structure_wooden_sampan`** | `pose_swimming`<br>(hỗ trợ motion) | `offsetY: 0` (mặt nước Y=800) | **Bơi lội rẽ sóng nước sông đầm:** Nửa thân dưới ngập trong nước, hai tay vung sải chèo quạt nước rẽ sóng, gợn sóng và bọt nước dập dềnh bơi qua đầm lầy. |
| **`cursed_swamp`**<br>hoặc bờ kênh sông | `pose_drowning` | `offsetY: 0` (mặt nước Y=800) | **Chết đuối ngoi ngóp chới với:** Ngập sâu đến cằm, đầu ngửa há hốc đớp khí kinh hãi, hai tay vươn cao khỏi mặt nước run rẩy vẫy vùng cầu cứu, bọt khí sủi tăm sùng sục và xoáy nước ma quái. |
| **`cursed_swamp`**<br>hoặc bờ kênh sông | `pose_floating_corpse` | `offsetY: 0` (mặt nước Y=800) | **Xác chết trôi sông nổi lờ đờ:** Xác chết đuối nằm ngang dập dềnh theo nhịp sóng nước, tóc xõa dài bồng bềnh như rong rêu, tay chân buông thõng chìm dưới dòng nước lạnh. |

### JSON mẫu phân cảnh tương tác leo cầu thang & vượt cầu khỉ:

```json
{
  "scene_id": "scene_02_elevated",
  "title": "Leo Lên Gác Lửng Tối & Bóng Đen Cầu Khỉ",
  "duration_sec": 12,
  "theme": "thatched_house_interior",
  "lighting": {
    "sky_preset": "foggy_night",
    "fog_density": 0.65
  },
  "camera": {
    "shot": "medium_wide",
    "shake": "subtle"
  },
  "environment_items": [
    {
      "asset_id": "structure_wooden_stairs",
      "slot": "mid_left",
      "scale": 1.0
    },
    {
      "asset_id": "structure_monkey_bridge",
      "slot": "mid_right",
      "scale": 1.0
    }
  ],
  "actors": [
    {
      "id": "char_climber",
      "base": "male_adult",
      "costume": "outfit_modern_casual",
      "face": "face_scared",
      "facialAction": "darting_eyes",
      "pose": "pose_climbing_stairs",
      "heldItem": "item_flashlight",
      "heldHand": "right",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": -45,
      "offsetY": 0,
      "interact_with": "structure_wooden_stairs",
      "motion": {
        "targetSlot": "mid_left",
        "targetOffsetX": 65,
        "targetOffsetY": -180,
        "startTimeSec": 0.5,
        "endTimeSec": 6.0,
        "easing": "ease_in_out",
        "autoFaceTarget": true,
        "movingPose": "pose_climbing_stairs"
      }
    },
    {
      "id": "char_ghost_bridge",
      "base": "ghost_wraith",
      "costume": "outfit_shredded_burial",
      "face": "face_pale_corpse",
      "facialAction": "none",
      "pose": "pose_balancing_bridge",
      "heldItem": "item_oil_lamp",
      "heldHand": "right",
      "facing": "left",
      "slot": "mid_right",
      "offsetY": -115,
      "interact_with": "structure_monkey_bridge"
    }
  ],
  "dialogue": "Từng bậc gỗ cầu thang kẽo kẹt dưới chân người đàn ông khi leo lên gác xép. Phía ngoài, bóng trắng lơ lửng bước chênh vênh qua cây cầu khỉ sương mờ...",
  "narrative_note": "Nhân vật nam leo cầu thang gỗ structure_wooden_stairs từ sàn lên gác lửng Y=-180px với motion.movingPose='pose_climbing_stairs'. Oan hồn đứng thăng bằng giữa thân cầu khỉ structure_monkey_bridge với pose_balancing_bridge tại cao độ Y=-115px."
}
```

### JSON mẫu phân cảnh kinh dị sông nước & chết đuối (Water Horror & Drowning / Swimming / Ground Collapse):

```json
{
  "scene_id": "scene_water_horror_drowning_and_corpse",
  "title": "Bóng Ma Da Dưới Đầm Lầy & Tiếng Kêu Cứu Trong Vọng Nước",
  "duration_sec": 10,
  "theme": "cursed_swamp",
  "lighting": {
    "sky_preset": "stormy_dark",
    "fog_density": 0.6,
    "weather": "haunted_mist"
  },
  "camera": {
    "shot": "medium_wide",
    "target_slot": "center",
    "shake": "subtle_handheld"
  },
  "environment_items": [
    {
      "asset_id": "structure_wooden_sampan",
      "slot": "far_left",
      "offsetX": 20,
      "scale": 1.0
    },
    {
      "asset_id": "structure_monkey_bridge",
      "slot": "far_right",
      "offsetX": -30,
      "scale": 1.0
    }
  ],
  "actors": [
    {
      "id": "actor_drowning_victim",
      "base": "male_adult",
      "costume": "outfit_tattered_tunic",
      "face": "face_screaming_gasp",
      "facialAction": "terrified_scream",
      "pose": "pose_drowning",
      "facing": "right",
      "slot": "center",
      "offsetX": -50,
      "offsetY": 0,
      "scale": 1.0,
      "opacity": 1.0
    },
    {
      "id": "actor_swimming_rescuer",
      "base": "male_adult",
      "costume": "outfit_traditional_ba_ba",
      "face": "face_scared",
      "facialAction": "darting_eyes",
      "pose": "pose_swimming",
      "facing": "right",
      "slot": "mid_left",
      "offsetX": 40,
      "offsetY": 0,
      "scale": 1.0,
      "opacity": 1.0,
      "motion": {
        "targetSlot": "center",
        "targetOffsetX": -120,
        "targetOffsetY": 0,
        "startTimeSec": 1.0,
        "endTimeSec": 7.0,
        "easing": "ease_in_out",
        "movingPose": "pose_swimming"
      }
    },
    {
      "id": "actor_floating_corpse_swamp",
      "base": "female_adult",
      "costume": "outfit_flowing_ao_dai",
      "face": "face_pale_corpse",
      "facialAction": "none",
      "pose": "pose_floating_corpse",
      "facing": "left",
      "slot": "mid_right",
      "offsetX": 30,
      "offsetY": 0,
      "scale": 1.0,
      "opacity": 0.9
    }
  ],
  "details": [
    { "id": "detail_water_hyacinth_left", "asset_id": "detail_water_hyacinth", "slot": "mid_left", "offsetX": -20, "offsetY": 0, "scale": 1.0 },
    { "id": "detail_water_hyacinth_right", "asset_id": "detail_water_hyacinth", "slot": "mid_right", "offsetX": 70, "offsetY": 0, "scale": 1.1 },
    { "id": "detail_wisp_swamp", "asset_id": "detail_will_o_wisp", "slot": "air_center", "offsetX": 10, "offsetY": 0, "scale": 1.0 }
  ],
  "dialogue": "Dòng nước xoáy đen ngòm cuộn trào bọt khí khi nạn nhân ngoi ngóp giơ hai tay cầu cứu tuyệt vọng. Phía bên kia chiếc xuồng, một xác áo dài trắng đang trôi nổi lờ đờ theo nhịp sóng...",
  "narrative_note": "Tổ hợp kinh dị sông nước hoàn hảo: actor_drowning_victim ở pose_drowning chìm sâu ngập cằm vùng vẫy bọt khí; actor_swimming_rescuer ở pose_swimming đang rẽ sóng bơi tới cứu; actor_floating_corpse_swamp ở pose_floating_corpse dập dềnh bập bềnh trôi sông giữa các bụi lục bình detail_water_hyacinth và xuồng ba lá structure_wooden_sampan."
}
```





