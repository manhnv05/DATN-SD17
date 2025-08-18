package com.example.datn.util;

import com.example.datn.enums.LoaiNguoiDung;

public class LoaiNguoiDungUtil {
    public static LoaiNguoiDung fromString(String input) {
        if (input == null) return null;
        String s = input.trim().toLowerCase().replace(" ", "_");
        if (s.equals("nhanvien")) s = "nhan_vien";
        if (s.equals("khachhang")) s = "khach_hang";
        return LoaiNguoiDung.valueOf(s);
    }
}
