import { Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Navigate } from "react-router-dom";

export default function GuestLayout() {
    const {token} = useStateContext()

    if (token) {
        return <Navigate to='/' />
    }

    return ( 
        <div>
            <Outlet />
        </div>
     );
}