import Home from "layouts/client/home";
import SignIn from "layouts/admin/authentication/sign-in"; // chỉnh lại path cho đúng nếu cần
import SignUp from "layouts/admin/authentication/sign-up"; // chỉnh lại path cho đúng nếu cần

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