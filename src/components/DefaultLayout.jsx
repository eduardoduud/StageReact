import { Link, Outlet } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function DefaultLayout() {
    const {user, token, notification, setUser, setToken} = useStateContext()

    if (!token) {
        return <Navigate to="/login" />
    }

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post('/logout').then(() => {
            setUser({})
            setToken(null)
        })
    }

    useEffect(() => {
        axiosClient.get('/user').then(({data}) => {
            setUser(data)
        })
    }, [setUser]);

    return ( 
        <div id="defaultLayout">
            <aside>
                <Link to="/workflows">Workflows</Link>
                <Link to="/departments">Setores</Link>
                <Link to="/users">Usuários</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        <p></p>
                    </div>
                    <div>
                        <a style={{padding: '25px'}}>{user.name}</a>
                        <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet/>
                </main>
            </div>
            {notification &&
                <div className="notification">
                    {notification}
                </div>
            }
        </div>
     );
}