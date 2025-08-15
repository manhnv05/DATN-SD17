import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuth2RedirectHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const url = window.location.href;
        const search = window.location.search;
        console.log("[OAuth2RedirectHandler] window.location.href:", url);
        console.log("[OAuth2RedirectHandler] window.location.search:", search);

        const params = new URLSearchParams(search);
        const roleFromParam = params.get("role");
        let role = roleFromParam ? roleFromParam.toUpperCase() : localStorage.getItem("role");

        console.log("[OAuth2RedirectHandler] roleFromParam:", roleFromParam, "| final role:", role);

        if (roleFromParam) localStorage.setItem("role", role);

        if (["NHANVIEN", "QUANTRIVIEN", "QUANLY"].includes(role)) {
            navigate("/dashboard", { replace: true });
        } else {
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    return <div>Đang chuyển hướng...</div>;
}

export default OAuth2RedirectHandler;