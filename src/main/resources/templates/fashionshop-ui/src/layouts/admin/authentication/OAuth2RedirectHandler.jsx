import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuth2RedirectHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roleFromParam = params.get("role");
        let role = roleFromParam ? roleFromParam.toUpperCase() : localStorage.getItem("role");

        if (roleFromParam) {
            localStorage.setItem("role", role);
        }

        if (role === "NHANVIEN" || role === "QUANTRIVIEN" || role === "QUANLY") {
            navigate("/dashboard", { replace: true });
        } else {
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    return null;
}

export default OAuth2RedirectHandler;