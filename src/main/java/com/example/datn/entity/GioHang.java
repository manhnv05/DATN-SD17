package com.example.datn.entity;

import com.example.datn.enums.LoaiNguoiDung;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gio_hang",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id_nguoi_dung", "loai_nguoi_dung", "chi_tiet_san_pham_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GioHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_nguoi_dung", nullable = false)
    private Long idNguoiDung;

    @Column(name = "loai_nguoi_dung", nullable = false)
    @Enumerated(EnumType.STRING)
    private LoaiNguoiDung loaiNguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chi_tiet_san_pham_id", nullable = false)
    private ChiTietSanPham chiTietSanPham;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;
}
