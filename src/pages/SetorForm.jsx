import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function SetorForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [department, setDepartment] = useState({
    id: null,
    name: '',
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  if (id) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/departments/${id}`)
        .then(({data}) => {
          setLoading(false)
          console.log(data);
          setDepartment(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [id])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (department.id) {
      axiosClient.put(`/departments/${department.id}`, department)
        .then(() => {
          setNotification('Setor atualizado com sucesso')
          navigate('/departments')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/departments', department)
        .then(() => {
          setNotification('Setor criado com sucesso')
          navigate('/departments')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <>
      {department.id && <h1>Atualizar Setor: {department.name}</h1>}
      {!department.id && <h1>Novo Setor</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Carregando...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={department.name}
              onChange={ev => setDepartment({...department, name: ev.target.value})}
              placeholder="Nome"/>
            <button className="btn">Salvar</button>
          </form>
        )}
      </div>
    </>
  )
}