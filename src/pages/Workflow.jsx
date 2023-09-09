import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import { useParams } from "react-router-dom";

export default function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()
  let { id } = useParams();

  useEffect(() => {
    getWorkflows();
  }, [])

  const getWorkflows = () => {
    setLoading(true)
    axiosClient.get('/workflows')
      .then(({ data }) => {
        setLoading(false)
        setWorkflows(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const filteredWorkflows = workflows.filter(u => u.department_id === parseInt(id));

  const onDeleteClick = workflow => {
    if (!window.confirm("Tem certeza que deseja deletar este workflow?")) {
      return
    }
    axiosClient.delete(`/workflows/${workflow.id}`)
      .then(() => {
        setNotification('Workflow deletado com sucesso')
        getWorkflows()
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Workflows</h1>
        <Link className="btn-add" to="/workflows/new">Adicionar</Link>
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
            {filteredWorkflows.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td><Link className="workflow" to={'/workflows/' + u.id}>{u.name}</Link></td>
                <td>{u.department_id}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/workflows/edit/' + u.id}>Editar</Link>
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