import Home from "layouts/client/home";
import SignIn from "layouts/admin/authentication/sign-in"; // chỉnh lại path cho đúng nếu cần

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
        name: "Đăng nhập",
        key: "sign-in",
        route: "/authentication/sign-in",
        component: <SignIn />,
        noCollapse: true,
        hidden: true, // Bạn có thể ẩn menu này nếu không muốn lộ ra ở client menu
    },
];

export default routesClient;