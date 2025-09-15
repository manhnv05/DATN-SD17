package com.example.datn.controller;

import com.example.datn.dto.ChiTietSanPhamDTO;
import com.example.datn.dto.SanPhamDTO;
import com.example.datn.entity.DanhMuc;
import com.example.datn.entity.KichThuoc;
import com.example.datn.entity.MauSac;
import com.example.datn.entity.ThuongHieu;
import com.example.datn.repository.*;
import com.example.datn.service.ChiTietSanPhamService;
import com.example.datn.service.GeminiService;
import com.example.datn.service.SanPhamService;
import com.example.datn.service.ShopInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.text.Normalizer;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private SanPhamService sanPhamService;

    @Autowired
    private ShopInfoService shopInfoService;

    @Autowired
    private ChiTietSanPhamService chiTietSanPhamService;

    @Autowired
    private MauSacRepository mauSacRepository;

    @Autowired
    private KichThuocRepository kichThuocRepository;

    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    @Autowired
    private DanhMucRepository danhMucRepository;

    @Autowired
    private ChatLieuRepository chatLieuRepository;

    @Autowired
    private CoAoRepository coAoRepository;

    @Autowired
    private TayAoRepository tayAoRepository;

    @PostMapping("/message")
    public Mono<Map<String, Object>> chat(@RequestBody Map<String, String> payload) {
        String userMessage = Optional.ofNullable(payload.get("message")).orElse("").trim();

        String shopInfo = shopInfoService.getShopInfo();

        // 1. Xác định intent có phải tìm/gợi ý sản phẩm không
        boolean wantsSuggestion = isProductIntent(userMessage);

        // 2. Xác định intent so sánh biến thể sản phẩm
        boolean wantsCompareVariant = isCompareVariantIntent(userMessage);

        List<SanPhamDTO> products = new ArrayList<>();
        String productInfo = "";
        String compareInfo = "";

        // 3. Nếu là intent so sánh biến thể, lấy thông tin các điểm giống nhau giữa các biến thể
        if (wantsCompareVariant) {
            FilterParams fp = parseFilters(userMessage);
            List<SanPhamDTO> productsToCompare = new ArrayList<>();
            if (fp.keyword != null && !fp.keyword.isBlank()) {
                productsToCompare = sanPhamService.searchByMaSanPhamOrTenSanPham(fp.keyword);
            }
            if (!productsToCompare.isEmpty()) {
                SanPhamDTO sp = productsToCompare.get(0);
                List<ChiTietSanPhamDTO> cts = chiTietSanPhamService.findBySanPhamId(sp.getId());
                compareInfo = getCommonVariantInfo(sp, cts);
            } else {
                compareInfo = "Không tìm thấy sản phẩm để so sánh biến thể.";
            }

            // Đồng thời, tìm sản phẩm theo các biến thể/yêu cầu để hiển thị thông tin (KHÔNG tạo gợi ý)
            products = sanPhamService.searchWithFilter(
                    fp.keyword,
                    fp.color,
                    fp.size,
                    fp.brand,
                    fp.category,
                    fp.material,
                    fp.collar,
                    fp.sleeve,
                    fp.priceMin,
                    fp.priceMax,
                    5
            );
            if (products.isEmpty() && fp.keyword != null && !fp.keyword.isBlank()) {
                products = sanPhamService.searchByMaSanPhamOrTenSanPham(fp.keyword);
            }
            if (!products.isEmpty()) {
                productInfo = products.stream()
                        .map(p -> String.format("Tên: %s, Giá: %s, Danh mục: %s", p.getTenSanPham(), p.getGiaBan(), p.getTenDanhMuc()))
                        .collect(Collectors.joining("\n"));
            }
        }

        // 4. Nếu là intent gợi ý/tư vấn/tìm sản phẩm, lấy danh sách sản phẩm phù hợp
        if (wantsSuggestion) {
            FilterParams fp = parseFilters(userMessage);

            products = sanPhamService.searchWithFilter(
                    fp.keyword,
                    fp.color,
                    fp.size,
                    fp.brand,
                    fp.category,
                    fp.material,
                    fp.collar,
                    fp.sleeve,
                    fp.priceMin,
                    fp.priceMax,
                    5
            );

            if (products.isEmpty() && fp.keyword != null && !fp.keyword.isBlank()) {
                products = sanPhamService.searchByMaSanPhamOrTenSanPham(fp.keyword);
            }

            boolean hasStrongFilter = fp.brand != null || fp.category != null || fp.material != null || fp.collar != null
                    || fp.sleeve != null || fp.color != null || fp.size != null;

            // CHỈ fallback lấy sản phẩm mới nhất nếu KHÔNG có filter mạnh
            if (products.isEmpty() && !hasStrongFilter) {
                products = sanPhamService.getLatestActive(5);
            }

            if (!products.isEmpty()) {
                productInfo = products.stream()
                        .map(p -> String.format("Tên: %s, Giá: %s, Danh mục: %s", p.getTenSanPham(), p.getGiaBan(), p.getTenDanhMuc()))
                        .collect(Collectors.joining("\n"));
            }
        }

        // 5. Ghép prompt gửi lên Gemini
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Bạn là trợ lý của cửa hàng thời trang. Chỉ dựa vào thông tin dưới đây để trả lời. Nếu câu hỏi nằm ngoài phạm vi hoặc thông tin không có trong dữ liệu thì hãy trả lời lịch sự rằng hiện chưa có thông tin.\n\n");
        promptBuilder.append("Thông tin về shop:\n").append(shopInfo).append("\n\n");
        if (!compareInfo.isEmpty()) {
            promptBuilder.append("Thông tin so sánh biến thể:\n").append(compareInfo).append("\n\n");
        }
        if (!productInfo.isEmpty()) {
            promptBuilder.append("Các sản phẩm liên quan (nếu phù hợp):\n").append(productInfo).append("\n\n");
        }
        promptBuilder.append("Câu hỏi của khách: ").append(userMessage);

        String prompt = promptBuilder.toString();

        // 6. CHỈ tạo suggestions nếu intent là tìm/gợi ý/tư vấn sản phẩm
        List<Map<String, Object>> suggestions = new ArrayList<>();
        if (wantsSuggestion && products != null && !products.isEmpty()) {
            for (SanPhamDTO sp : products.stream().limit(5).collect(Collectors.toList())) {
                String imageUrl = null;
                try {
                    List<ChiTietSanPhamDTO> ctList = chiTietSanPhamService.findBySanPhamId(sp.getId());
                    if (ctList != null && !ctList.isEmpty()) {
                        // Lấy ảnh đầu tiên của biến thể đầu tiên
                        ChiTietSanPhamDTO ct = ctList.get(0);
                        if (ct.getHinhAnhs() != null && !ct.getHinhAnhs().isEmpty()) {
                            imageUrl = ct.getHinhAnhs().get(0).getDuongDanAnh();
                        }
                    }
                } catch (Exception ignored) {
                }
                Map<String, Object> sug = new HashMap<>();
                sug.put("id", sp.getId());
                sug.put("name", sp.getTenSanPham());
                sug.put("price", sp.getGiaBan());
                sug.put("imageUrl", imageUrl != null && !imageUrl.isBlank()
                        ? imageUrl
                        : "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80");
                sug.put("detailPath", "/shop/detail/" + sp.getId());
                suggestions.add(sug);
            }
        }

        // 7. Gọi Gemini với fallback (chỉ trả về suggestions khi intent là tìm/gợi ý/tư vấn sản phẩm)
        return geminiService.askGemini(prompt)
                .onErrorResume(ex -> Mono.just("Hiện tại tôi chưa kết nối được tới AI."))
                .map(reply -> {
                    Map<String, Object> res = new HashMap<>();
                    res.put("reply", reply);
                    // Chỉ gửi suggestions khi intent là tìm/gợi ý/tư vấn sản phẩm
                    if (wantsSuggestion && !suggestions.isEmpty()) res.put("suggestions", suggestions);
                    return res;
                });
    }

    // ===== Helpers: intent & parsing =====
    private boolean isProductIntent(String message) {
        if (message == null) return false;
        String m = message.toLowerCase().trim();
        String mn = normalizeVN(m);

        // Ưu tiên kiểm tra smallTalks trước, nếu đúng thì trả về false ngay lập tức
        String[] smallTalks = {"xin chào", "chào", "hello", "hi", "alo", "cảm ơn", "thanks", "xin chao", "cam on","shopinfo","tên", "thông tin shop", "giới thiệu shop", "shop ở đâu", "giờ mở cửa", "địa chỉ shop", "liên hệ shop", "hotline", "fanpage",
                "cửa hàng", "thông tin cửa hàng", "giờ mở cửa", "địa chỉ", "liên hệ", "info shop", "faq", "câu hỏi thường gặp", "chính sách", "chính sách bảo hành", "chính sách đổi trả", "bảng giá",
                "chính sách thành viên", "chính sách khuyến mãi", "chính sách thanh toán", "chính sách giao hàng", "chính sách sỉ"};
        for (String s : smallTalks) {
            if (m.contains(s) || mn.contains(normalizeVN(s))) return false;
        }

        // Nếu có các từ khoá liên quan đến gợi ý/tìm/tư vấn sản phẩm thì mới trả về true
        String[] buyWords = {"gợi ý", "tư vấn", "mua", "có mẫu", "có loại", "tìm", "cần", "áo", "sản phẩm",
                "goi y", "tu van", "co mau", "co loai", "tim", "can", "ao", "san pham"};
        for (String w : buyWords) {
            if (m.contains(w) || mn.contains(normalizeVN(w))) return true;
        }

        // Nếu có filter tìm sản phẩm thì trả về true
        FilterParams fp = parseFilters(message);
        return fp.hasAnyConstraint();
    }

    // intent so sánh biến thể sản phẩm
    private boolean isCompareVariantIntent(String message) {
        if (message == null) return false;
        String m = message.toLowerCase().trim();
        String mn = normalizeVN(m);
        String[] compareWords = {"điểm giống", "giống nhau", "điểm chung", "so sánh", "các biến thể", "các phiên bản",
                // Không dấu
                "diem giong", "giong nhau", "diem chung", "so sanh", "bien the", "cac bien the", "phien ban", "cac phien ban"};
        for (String w : compareWords) {
            if (m.contains(w) || mn.contains(normalizeVN(w))) return true;
        }
        return false;
    }

    // lấy điểm giống nhau và khác nhau giữa các biến thể (từ DB)
    private String getCommonVariantInfo(SanPhamDTO sp, List<ChiTietSanPhamDTO> variants) {
        if (sp == null || variants == null || variants.isEmpty()) return "Không tìm thấy biến thể phù hợp.";

        // Tập hợp điểm chung
        Set<String> materials = new HashSet<>();
        Set<String> categories = new HashSet<>();
        Set<String> brands = new HashSet<>();

        // Tập hợp điểm khác nhau/đa dạng để tư vấn (màu, size, giá)
        Set<String> colors = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        Set<String> sizes = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        Integer minPrice = null, maxPrice = null;
        int totalQty = 0;

        for (ChiTietSanPhamDTO ct : variants) {
            if (ct.getTenChatLieu() != null) materials.add(ct.getTenChatLieu().trim());
            if (sp.getTenDanhMuc() != null) categories.add(sp.getTenDanhMuc().trim());
            if (ct.getTenThuongHieu() != null) brands.add(ct.getTenThuongHieu().trim());

            if (ct.getTenMauSac() != null && !ct.getTenMauSac().isBlank()) colors.add(ct.getTenMauSac().trim());
            if (ct.getTenKichThuoc() != null && !ct.getTenKichThuoc().isBlank()) sizes.add(ct.getTenKichThuoc().trim());
            if (ct.getGia() != null) {
                minPrice = (minPrice == null) ? ct.getGia() : Math.min(minPrice, ct.getGia());
                maxPrice = (maxPrice == null) ? ct.getGia() : Math.max(maxPrice, ct.getGia());
            }
            if (ct.getSoLuong() != null) totalQty += ct.getSoLuong();
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Các biến thể của sản phẩm ").append(sp.getTenSanPham()).append(":\n");
        // Điểm giống nhau
        List<String> commons = new ArrayList<>();
        if (materials.size() == 1) commons.add("Chất liệu: " + materials.iterator().next());
        if (categories.size() == 1) commons.add("Danh mục: " + categories.iterator().next());
        if (brands.size() == 1) commons.add("Thương hiệu: " + brands.iterator().next());
        if (!commons.isEmpty()) {
            sb.append("- Điểm giống nhau: ").append(String.join(", ", commons)).append(".\n");
        } else {
            sb.append("- Điểm giống nhau: Chưa xác định rõ hoặc dữ liệu chưa đồng nhất.\n");
        }
        // Điểm khác nhau/đa dạng để tư vấn
        if (!colors.isEmpty()) sb.append("- Màu sắc có: ").append(String.join(", ", colors)).append(".\n");
        if (!sizes.isEmpty()) sb.append("- Kích thước có: ").append(String.join(", ", sizes)).append(".\n");
        if (minPrice != null && maxPrice != null) {
            if (minPrice.equals(maxPrice)) sb.append("- Giá: ").append(String.format("%,d₫", minPrice)).append(".\n");
            else sb.append("- Khoảng giá: ").append(String.format("%,d₫", minPrice)).append(" - ").append(String.format("%,d₫", maxPrice)).append(".\n");
        }
        sb.append("- Số biến thể: ").append(variants.size());
        if (totalQty > 0) sb.append(", tổng tồn kho: ").append(totalQty);
        sb.append(".\n");
        return sb.toString();
    }

    private static class FilterParams {
        String keyword;
        String color;
        String size;
        String brand;
        String category;
        String material;
        String collar;
        String sleeve;
        Integer priceMin;
        Integer priceMax;
        boolean hasAnyConstraint() {
            return (keyword != null && !keyword.isBlank()) || color != null || size != null || brand != null || category != null || material != null || collar != null || sleeve != null || priceMin != null || priceMax != null;
        }
    }

    private FilterParams parseFilters(String message) {
        FilterParams fp = new FilterParams();
        if (message == null) return fp;
        String m = message.toLowerCase();
        String mn = normalizeVN(m);

        try {
            List<KichThuoc> sizes = kichThuocRepository.findAll();
            for (KichThuoc kt : sizes) {
                if (kt.getTenKichCo() == null && kt.getMa() == null) continue;
                String ten = kt.getTenKichCo() == null ? null : kt.getTenKichCo().toLowerCase();
                String tenN = ten == null ? null : normalizeVN(ten);
                String ma = kt.getMa() == null ? null : kt.getMa().toLowerCase();
                String maN = ma == null ? null : normalizeVN(ma);
                boolean matchTen = tenN != null && (mn.matches(".*(size|co|kich thuoc)\\s*" + Pattern.quote(tenN) + ".*") || mn.matches(".*\\b" + Pattern.quote(tenN) + "\\b.*"));
                boolean matchMa = maN != null && (mn.matches(".*(size|co|kich thuoc)\\s*" + Pattern.quote(maN) + ".*") || mn.matches(".*\\b" + Pattern.quote(maN) + "\\b.*"));
                if (matchTen || matchMa) {
                    fp.size = kt.getTenKichCo();
                    break;
                }
            }
        } catch (Exception ignored) {}

        try {
            List<MauSac> colors = mauSacRepository.findAll();
            for (MauSac ms : colors) {
                if (ms.getTenMauSac() == null && ms.getMaMau() == null) continue;
                String ten = ms.getTenMauSac() == null ? null : ms.getTenMauSac().toLowerCase();
                String tenN = ten == null ? null : normalizeVN(ten);
                String ma = ms.getMaMau() == null ? null : ms.getMaMau().toLowerCase();
                String maN = ma == null ? null : normalizeVN(ma);
                if ((tenN != null && (mn.contains(tenN) || mn.contains("mau " + tenN))) || (maN != null && mn.contains(maN))) {
                    fp.color = ten != null ? ten : ma;
                    break;
                }
            }
        } catch (Exception ignored) {}

        // Parse chất liệu (material)
        try {
            var list = chatLieuRepository.findAll();
            for (var cl : list) {
                String ten = cl.getTenChatLieu() == null ? null : cl.getTenChatLieu().toLowerCase();
                String tenN = ten == null ? null : normalizeVN(ten);
                String ma = cl.getMaChatLieu() == null ? null : cl.getMaChatLieu().toLowerCase();
                String maN = ma == null ? null : normalizeVN(ma);
                if ((tenN != null && (mn.contains(tenN) || mn.contains("chat lieu "+tenN))) || (maN != null && mn.contains(maN))) {
                    fp.material = ten != null ? ten : ma;
                    break;
                }
            }
        } catch (Exception ignored) {}

        // Parse cổ áo (collar)
        try {
            var list = coAoRepository.findAll();
            for (var ca : list) {
                String ten = ca.getTenCoAo() == null ? null : ca.getTenCoAo().toLowerCase();
                String tenN = ten == null ? null : normalizeVN(ten);
                String ma = ca.getMa() == null ? null : ca.getMa().toLowerCase();
                String maN = ma == null ? null : normalizeVN(ma);
                if ((tenN != null && (mn.contains(tenN) || mn.contains("co ao "+tenN))) || (maN != null && mn.contains(maN))) {
                    fp.collar = ten != null ? ten : ma;
                    break;
                }
            }
        } catch (Exception ignored) {}

        // Parse tay áo (sleeve)
        try {
            var list = tayAoRepository.findAll();
            for (var ta : list) {
                String ten = ta.getTenTayAo() == null ? null : ta.getTenTayAo().toLowerCase();
                String tenN = ten == null ? null : normalizeVN(ten);
                String ma = ta.getMa() == null ? null : ta.getMa().toLowerCase();
                String maN = ma == null ? null : normalizeVN(ma);
                if ((tenN != null && (mn.contains(tenN) || mn.contains("tay ao "+tenN))) || (maN != null && mn.contains(maN))) {
                    fp.sleeve = ten != null ? ten : ma;
                    break;
                }
            }
        } catch (Exception ignored) {}

        Integer[] priceRange = extractPriceRange(m);
        fp.priceMin = priceRange[0];
        fp.priceMax = priceRange[1];

        fp.keyword = extractKeyword(m);

        try {
            List<ThuongHieu> brands = thuongHieuRepository.findAll();
            for (ThuongHieu th : brands) {
                String ten = th.getTenThuongHieu() == null ? null : th.getTenThuongHieu().toLowerCase();
                String tenN = ten == null ? null : normalizeVN(ten);
                String ma = th.getMaThuongHieu() == null ? null : th.getMaThuongHieu().toLowerCase();
                String maN = ma == null ? null : normalizeVN(ma);
                if ((tenN != null && mn.contains(tenN)) || (maN != null && mn.contains(maN))) {
                    fp.brand = ten != null ? ten : ma;
                    break;
                }
            }
        } catch (Exception ignored) {}

        try {
            List<DanhMuc> cats = danhMucRepository.findAll();
            for (DanhMuc dm : cats) {
                if (dm.getTenDanhMuc() == null) continue;
                String ten = dm.getTenDanhMuc().toLowerCase();
                String tenN = normalizeVN(ten);
                if (mn.contains(tenN)) { fp.category = ten; break; }
            }
        } catch (Exception ignored) {}

        return fp;
    }

    private Integer[] extractPriceRange(String m) {
        Integer min = null, max = null;
        Function<String,Integer> toVnd = txt -> {
            String t = txt.replace(".", "").replace(",", "").trim();
            try {
                if (t.endsWith("k")) return Integer.parseInt(t.substring(0, t.length()-1)) * 1000;
                if (t.endsWith("nghìn")) return Integer.parseInt(t.replace("nghìn","" ).trim()) * 1000;
                if (t.endsWith("triệu")) return Integer.parseInt(t.replace("triệu","" ).trim()) * 1_000_000;
                return Integer.parseInt(t);
            } catch (Exception e) { return null; }
        };
        Matcher range = Pattern.compile("từ\\s+(\\d+)(k| nghìn| triệu)?\\s*(đến|-|tới)\\s*(\\d+)(k| nghìn| triệu)?").matcher(m);
        if (range.find()) {
            Integer a = toVnd.apply(range.group(1) + (range.group(2) == null ? "" : range.group(2).trim().substring(0,1)));
            Integer b = toVnd.apply(range.group(4) + (range.group(5) == null ? "" : range.group(5).trim().substring(0,1)));
            if (a != null && b != null) { min = Math.min(a,b); max = Math.max(a,b); return new Integer[]{min,max}; }
        }
        Matcher under = Pattern.compile("(dưới|<=|<)\\s*(\\d+)(k| nghìn| triệu)?").matcher(m);
        if (under.find()) {
            Integer v = toVnd.apply(under.group(2) + (under.group(3) == null ? "" : under.group(3).trim().substring(0,1)));
            if (v != null) { max = v; return new Integer[]{min,max}; }
        }
        Matcher over = Pattern.compile("(trên|>=|>)\\s*(\\d+)(k| nghìn| triệu)?").matcher(m);
        if (over.find()) {
            Integer v = toVnd.apply(over.group(2) + (over.group(3) == null ? "" : over.group(3).trim().substring(0,1)));
            if (v != null) { min = v; return new Integer[]{min,max}; }
        }
        return new Integer[]{min,max};
    }

    private String extractKeyword(String m) {
        if (m == null) return null;
        String original = m;
        String mn = normalizeVN(m);

        // 1) Thử nhận diện theo mã sản phẩm (maSanPham) xuất hiện trong câu hỏi
        try {
            List<String> allMa = sanPhamService.getAllMaSanPham();
            for (String ma : allMa) {
                if (ma == null) continue;
                String maLower = ma.toLowerCase();
                if (mn.contains(maLower) || original.contains(ma)) {
                    return ma; // ưu tiên trả về mã nếu có trong câu hỏi
                }
            }
        } catch (Exception ignored) {}

        // 2) Thử khớp gần đúng với tên sản phẩm trong DB
        String bestName = null;
        double bestScore = 0.0;
        try {
            List<String> allNames = sanPhamService.getAllTenSanPham();
            String[] msgTokens = Arrays.stream(mn.replaceAll("[\\p{Punct}]", " ")
                            .replaceAll("\\s+", " ")
                            .trim()
                            .split(" "))
                    .filter(t -> t != null && t.length() > 1)
                    .toArray(String[]::new);

            for (String name : allNames) {
                if (name == null || name.isBlank()) continue;
                String nameLower = name.toLowerCase();
                String nameN = normalizeVN(nameLower);

                // 2a) Nếu câu hỏi chứa nguyên cụm tên SP (không dấu), chọn luôn
                if (!nameN.isBlank() && mn.contains(nameN)) {
                    return name;
                }

                // 2b) Tính điểm giống nhau dựa trên giao/ hợp token (Jaccard-like)
                String[] nameTokens = Arrays.stream(nameN.split(" "))
                        .filter(t -> t != null && t.length() > 1)
                        .toArray(String[]::new);
                if (nameTokens.length == 0 || msgTokens.length == 0) continue;

                int intersect = 0;
                int union = 0;
                Set<String> msgSet = new HashSet<>(Arrays.asList(msgTokens));
                Set<String> nameSet = new HashSet<>(Arrays.asList(nameTokens));
                for (String t : msgSet) {
                    if (nameSet.contains(t)) intersect++;
                }
                // Nếu khớp được >= 2 token, coi như đủ mạnh để chọn luôn
                if (intersect >= 2) {
                    return name;
                }
                union = msgSet.size() + nameSet.size() - intersect;
                double score = union == 0 ? 0.0 : (double) intersect / union;

                // ưu tiên tên dài hơn nếu điểm bằng nhau (cụ thể hơn)
                if (score > bestScore || (Math.abs(score - bestScore) < 1e-6 && name.length() > (bestName == null ? 0 : bestName.length()))) {
                    bestScore = score;
                    bestName = name;
                }
            }
        } catch (Exception ignored) {}

        if (bestName != null && bestScore >= 0.2) { // giảm ngưỡng để dễ bắt tên SP hơn
            return bestName;
        }

        // 3) Fallback: loại bỏ stopwords để tạo từ khóa chung
        String cleaned = m.replaceAll("[\\p{Punct}]", " ").replaceAll("\\s+", " ").trim();
        String[] stop = {"xin", "chào", "hello", "hi", "giúp", "tư", "vấn", "cho", "mình", "tôi", "bạn", "cần", "mua", "tìm", "gợi", "ý", "sản", "phẩm", "có", "không", "loại", "mẫu", "nào", "với", "màu", "size", "kích", "thước", "dưới", "trên", "từ", "đến", "tới", "k", "nghìn", "triệu"};
        List<String> tokens = Arrays.stream(cleaned.split(" "))
                .filter(t -> t.length() >= 2 && Arrays.stream(stop).noneMatch(s -> s.equals(t)))
                .collect(Collectors.toList());
        if (tokens.isEmpty()) return null;
        String kw = String.join(" ", tokens);
        return kw.length() > 60 ? kw.substring(0, 60) : kw;
    }

    private String normalizeVN(String s) {
        if (s == null) return null;
        String tmp = Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        tmp = tmp.replace('đ', 'd').replace('Đ', 'D');
        return tmp;
    }
}