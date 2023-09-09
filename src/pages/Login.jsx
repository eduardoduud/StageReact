import { Link } from "react-router-dom";
import axiosClient from "../axios-client.js";
import {createRef} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import { useState } from "react";

export default function Login() {
    const emailRef = createRef();
    const passwordRef = createRef();
    const [errors, setErrors] = useState();
    const { setUser, setToken } = useStateContext();
    const [message, setMessage] = useState(null);

    const onSubmit = ev => {
        ev.preventDefault()
    
        const payload = {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        }
        setErrors(null)
        axiosClient.post('/login', payload)
          .then(({data}) => {
            setUser(data.user)
            setToken(data.token);
          })
          .catch((err) => {
            const response = err.response;
            if (response && response.status === 422) {
              if (response.data.errors) {
                setErrors(response.data.errors)
              } else {
                setErrors({
                    email: [response.data.message]
                })
              }
            }
          })
      }
    

    return ( 
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">
                        Entre na sua conta
                    </h1>
                    {errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                    }
                    <input ref={emailRef} type="email" placeholder="Email" />
                    <input ref={passwordRef} type="password" placeholder="Senha" />
                    <button className="btn btn-block">Entrar</button>
                    <p className="message">
                        Não é registrado? <Link to='/signup'>Crie a sua conta!</Link>
                    </p>
                </form>
            </div>
        </div>
     );
}