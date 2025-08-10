import SanPham from "../admin/SanPham/sanphan";
import ThuongHieu from "../admin/SanPham/thuonghieu";
import ChatLieu from "../admin/SanPham/chatlieu";
import DanhMuc from "../admin/SanPham/danhmuc";
import KichThuoc from "../admin/SanPham/kichthuoc";
import MauSac from "../admin/SanPham/mausac";
import TayAo from "../admin/SanPham/tayao";
import CoAo from "../admin/SanPham/coao";
import HinhAnh from "../admin/SanPham/hinhanh";
import ProductForm from "../admin/SanPham/themsp";
import ProductDetailForm from "../admin/SanPham/chitiet"; // <-- Thêm import này
import GiamGia from "../admin/GiamGia";
import OrderManagementPage from "../admin/HoaDon/pages/OrderManagementPage";
import OrderDetailPage from "../admin/HoaDon/pages/OrderDetailPage";
import PhieuGiamPage from "../admin/phieugiamgia/phieugiam";
import AddPhieuGiam from "../admin/phieugiamgia/addPhieuGiam";
import UpdatePhieuGiam from "../admin/phieugiamgia/updatePhieuGiamGia";
import KhachHang from "../admin/khachhang";
import AddKhachHang from "../admin/khachhang/add";
import DetailKhachHang from "../admin/khachhang/detail";
import UpdateKhachHang from "../admin/khachhang/update";
import NhanVien from "../admin/nhanvien";
import AddNhanVien from "../admin/nhanvien/add";
import DetailNhanVien from "../admin/nhanvien/detail";
import UpdateNhanVien from "../admin/nhanvien/update";
import SalesDashboardPage from "../admin/BanHangTaiQuay/pages/SalesDashboardPage";
import DashboardStats from "../admin/thongke/thongke";
import AddDiscountEventPage from "../admin/GiamGia/AddDiscountEventPage";
import ViewDiscountEventPage from "../admin/GiamGia/ViewDiscountEventPage";
import OAuth2RedirectHandler from "../admin/authentication/OAuth2RedirectHandler";


import Shop from "../../examples/Icons/Shop";
import Office from "../../examples/Icons/Office";
import Settings from "../../examples/Icons/Settings";
import CreditCard from "../../examples/Icons/CreditCard";
import Cube from "../../examples/Icons/Cube";


const routesAdmin = [
  {
    type: "collapse",
    name: "Thống Kê",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <DashboardStats />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Bán Hàng Tại Quầy",
    key: "sales",
    route: "/sales",
    icon: <Office size="12px" />,
    component: <SalesDashboardPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản Lý Hóa Đơn",
    key: "billing",
    route: "/OrderManagementPage",
    icon: <CreditCard size="12px" />,
    component: <OrderManagementPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản Lý Sản Phẩm",
    key: "virtual-reality",
    icon: <Cube size="12px" />,
    collapse: [
      {
        type: "item",
        name: "Sản Phẩm",
        key: "product-list",
        route: "/SanPham",
        component: <SanPham />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Thương Hiệu",
        key: "product-category",
        route: "/Brand",
        component: <ThuongHieu />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Chất Liệu",
        key: "material",
        route: "/material",
        component: <ChatLieu />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Danh Mục",
        key: "category",
        route: "/category",
        component: <DanhMuc />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Kích Thước",
        key: "size",
        route: "/size",
        component: <KichThuoc />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Màu Sắc",
        key: "color",
        route: "/color",
        component: <MauSac />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Tay Áo",
        key: "sleeve",
        route: "/sleeve",
        component: <TayAo />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Cổ Áo",
        key: "colar",
        route: "/colar",
        component: <CoAo />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Hình Ảnh",
        key: "image",
        route: "/image",
        component: <HinhAnh />,
        noCollapse: true,
      },
    ],
  },
  {
    type: "collapse",
    name: "Giảm Giá",
    key: "rtl",
    icon: <Settings size="12px" />,
    collapse: [
      {
        type: "item",
        name: "Phiếu Giảm Giá",
        key: "discount-list",
        route: "/discount",
        component: <PhieuGiamPage />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Đợt Giảm Giá",
        key: "discount-event",
        route: "/discount-event",
        component: <GiamGia />,
        noCollapse: true,
      },
    ],
  },
  {
    type: "collapse",
    name: "Quản lý Nhân Viên",
    key: "staff-management",
    route: "/staff-management",
    icon: <Office size="12px" />,
    component: <NhanVien />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý Khách Hàng",
    key: "customer-management",
    route: "/customer-management",
    icon: <Office size="12px" />,
    component: <KhachHang />,
    noCollapse: true,
  },
  {
    type: "item",
    name: "Thêm Sản Phẩm",
    key: "add-product",
    route: "/SanPham/ThemMoi",
    component: <ProductForm />,
    noCollapse: true,
    hidden: true,
  },
  {
    type: "item",
    name: "Chi Tiết Sản Phẩm",
    key: "product-detail",
    route: "/SanPham/ChiTietSanPham/:id",
    component: <ProductDetailForm />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "discount-event-add",
    name: "Thêm đợt giảm giá",
    route: "/discount-event/add",
    component: <AddDiscountEventPage />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "discount-event-view",
    name: "Xem đợt giảm giá",
    route: "/discount-event/view",
    component: <ViewDiscountEventPage />,
    noCollapse: true,
    hidden: true,
  },
  {
    type: "item",
    name: "Thêm Phiếu giảm giá",
    key: "add-voucher",
    route: "/PhieuGiam/ThemMoi",
    component: <AddPhieuGiam />,
    noCollapse: true,
    hidden: true, // ẩn khỏi menu nếu muốn
  },
  {
    type: "item",
    name: "Update Phiếu giảm giá",
    key: "update-voucher",
    route: "/PhieuGiam/update/:id",
    component: <UpdatePhieuGiam />,
    noCollapse: true,
    hidden: true, // ẩn khỏi menu nếu muốn
  },
  {
    key: "add-customer",
    name: "Thêm khách hàng",
    route: "/khachhang/add",
    component: <AddKhachHang />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "detail-customer",
    name: "chi tiết khách hàng",
    route: "/khachhang/detail/:id",
    component: <DetailKhachHang />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "update-customer",
    name: "Cập nhật khách hàng",
    route: "/khachhang/update/:id",
    component: <UpdateKhachHang />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "add-staff",
    name: "Thêm nhân viên",
    route: "/nhanvien/add",
    component: <AddNhanVien />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "detail-staff",
    name: "chi tiêt nhân viên",
    route: "/nhanvien/detail/:id",
    component: <DetailNhanVien />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "update-staff",
    name: "cập nhật nhân viên",
    route: "/nhanvien/update/:id",
    component: <UpdateNhanVien />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "order-detail",
    name: "Hóa đơn chi tiết",
    route: "/QuanLyHoaDon/:orderId",
    component: <OrderDetailPage />,
    noCollapse: true,
    hidden: true, // ẩn khỏi menu nếu muốn
  },
  {
    key: "oauth2-redirect",
    name: "OAuth2 Redirect Handler",
    route: "/oauth2/redirect",
    component: <OAuth2RedirectHandler />,
    noCollapse: true,
    hidden: true,
  },

];

export default routesAdmin;