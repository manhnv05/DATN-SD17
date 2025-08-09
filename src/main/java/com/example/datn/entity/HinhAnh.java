package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hinh_anh")
public class HinhAnh implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "ma_anh")
    private String maAnh;

    @Column(name = "duong_dan_anh")
    private String duongDanAnh;

    @Column(name = "anh_mac_dinh")
    private Integer anhMacDinh;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @OneToMany(mappedBy = "hinhAnh", fetch = FetchType.LAZY)
    private List<SpctHinhAnh> spctHinhAnhs;
}