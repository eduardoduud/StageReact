import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Setores() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  useEffect(() => {
    getSetores();
  }, [])

  const onDeleteClick = department => {
    if (!window.confirm("Tem certeza que deseja deletar este setor?")) {
      return
    }
    axiosClient.delete(`/departments/${department.id}`)
      .then(() => {
        setNotification('Setor deletado com sucesso')
        getSetores()
      })
  }

  const getSetores = () => {
    setLoading(true)
    axiosClient.get('/departments')
      .then(({ data }) => {
        setLoading(false)
        console.log(data)
        setDepartments(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Setores</h1>
        <Link className="btn-add" to="/departments/new">Adicionar</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Setor</th>
            <th>Criado em</th>
            <th>Ações</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                Carregando...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {departments.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td><Link className="workflow" to={'/departments/' + u.id}>{u.name}</Link></td>
                <td>{u.department}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/departments/edit/' + u.id}>Editar</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Deletar</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}