import Home from "layouts/client/home";
import Shop from "layouts/client/shop";
import Blog from "layouts/client/blog";
import Contact from "layouts/client/contact";
import About from "layouts/client/about";
import ProductDetail from "layouts/client/shop/detail"; // chỉnh lại path cho đúng nếu cần
import SignIn from "layouts/admin/authentication/sign-in"; // chỉnh lại path cho đúng nếu cần
import SignUp from "layouts/admin/authentication/sign-up";
import CartPage from "layouts/client/card";
import Order from "layouts/client/order";
import CheckoutPage from "layouts/client/card/CheckoutPage"; // chỉnh lại path cho đúng nếu cần
import OutletSales from "layouts/client/outlet-sales"; // chỉnh lại path cho đúng nếu cần

const routesClient = [
    {
        name: "Trang chủ",
        key: "home",
        route: "/home",
        component: <Home />,
        noCollapse: true,
        hidden: false,
    },
     {
        name: "Giỏ hàng",
        key: "card",
        route: "/card",
        component: <CartPage/>,
        noCollapse: true,
        hidden: false,
    },
     {
        name: "Thanh toán",
        key: "pay",
        route: "/pay",
        component: <CheckoutPage/>,
        noCollapse: true,
        hidden: false,
    },
    {
        name: "Cửa hàng",
        key: "shop",
        route: "/shop",
        component: <Shop />,
        noCollapse: true,
        hidden: false,
    },
    {
        name: "Đơn hàng",
        key: "order",
        route: "/order",
        component: <Order />,
        noCollapse: true,
        hidden: true,
    },
    {
        name: "Blog",
        key: "blog",
        route: "/blog",
        component: <Blog />,
        noCollapse: true,
        hidden: false,
    },
    {
        name: "Contact",
        key: "contact",
        route: "/contact",
        component: <Contact />,
        noCollapse: true,
        hidden: false,
    },
    {
        name: "Giới thiệu",
        key: "about",
        route: "/about",
        component: <About />,
        noCollapse: true,
        hidden: false,
    },
    {
        name: "Outlet Sales",
        key: "outlet-sales",
        route: "/outlet-sales",
        component: <OutletSales />,
        noCollapse: true,
        hidden: false,
    },
    {
        name: "Chi tiết sản phẩm",
        key: "product-detail",
        route: "/shop/detail/:id",
        component: <ProductDetail />,
        noCollapse: true,
        hidden: true,
    },
    {
        name: "Đăng nhập",
        key: "sign-in",
        route: "/authentication/sign-in",
        component: <SignIn />,
        noCollapse: true,
        hidden: true,
    },
    {
      type: "collapse",
      name: "Sign Up",
      key: "sign-up",
      route: "/authentication/sign-up",
      component: <SignUp />,
      noCollapse: true,
        hidden: true,
    },
];

export default routesClient;