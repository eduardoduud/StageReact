import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
    const nomeRef = useRef();
    const emailRef = useRef();
    const senhaRef = useRef();
    const senhaConfirmarRef = useRef();
    const [erros, setErros] = useState(null);
    const {setUser, setToken} = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();
        const senha = senhaRef.current.value;
        const senhaConfirmar = senhaConfirmarRef.current.value;
        if (senha !== senhaConfirmar) {
            setErros({ senha: ["A confirmação da senha não corresponde à senha fornecida."] });
            return;
        }
        const payload = {
            name: nomeRef.current.value,
            email: emailRef.current.value,
            password: senhaRef.current.value,
            password_confirmation: senhaConfirmarRef.current.value,
        }
        axiosClient.post('/signup', payload).then(({data}) => {
            setUser(data.user);
            setToken(data.token);
        })
        .catch(error => {
            const response = error.response;
            if (response && response.status === 422) {
                console.log(response.data.errors);
                setErros(response.data.errors)
            }
        })
    };

    return ( 
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">
                        Registre-se
                    </h1>
                    {erros && <div className="alert">
                        {Object.keys(erros).map(key => (
                            <p key={key}>{erros[key][0]}</p>
                        ))}
                    </div>
                    }
                    <input ref={nomeRef} placeholder="Nome" />
                    <input ref={emailRef} type="email" placeholder="Email" />
                    <input ref={senhaRef} type="password" placeholder="Senha" />
                    <input ref={senhaConfirmarRef} type="password" placeholder="Confirme sua senha" />
                    <button className="btn btn-block">Criar conta</button>
                    <p className="message">
                        Já tem uma conta? <Link to='/login'>Entre na sua conta!</Link>
                    </p>
                </form>
            </div>
        </div>
     );
}