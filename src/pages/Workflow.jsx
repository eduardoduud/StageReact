import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import { useParams, useLocation } from "react-router-dom";

export default function Workflows() {
  const location = useLocation();
  const [workflows, setWorkflows] = useState([]);
  const [subdepartments, setSubdepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()
  
  let { id } = useParams();

  const filterWorkflows = workflows.filter(u => u.department_id === parseInt(id) && u.sub_id === null);
  const filterSubWorkflows = workflows.filter(u => u.sub_id === parseInt(id));
  const filterSubdepartments = subdepartments.filter(u => u.department_id === parseInt(id));
  const isSubDepartments = location.pathname.match(/^\/subdepartments(\/|$)/);

  useEffect(() => {
    getWorkflows();
    getSubSetores();
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

  const getSubSetores = () => {
    setLoading(true)
    axiosClient.get('/subdepartments')
      .then(({ data }) => {
        setLoading(false)
        console.log(data)
        setSubdepartments(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const onDeleteWorkflow = workflow => {
    if (!window.confirm("Tem certeza que deseja deletar este workflow?")) {
      return
    }
    axiosClient.delete(`/workflows/${workflow.id}`)
      .then(() => {
        setNotification('Workflow deletado com sucesso')
        getWorkflows()
      })
  }

  const onDeleteSubdepartment = subdepartment => {
    if (!window.confirm("Tem certeza que deseja deletar este Sub-setor?")) {
      return
    }
    axiosClient.delete(`/subdepartments/${subdepartment.id}`)
      .then(() => {
        setNotification('Workflow deletado com sucesso')
        getSubSetores()
      })
  }

  return (
    <>
    {!isSubDepartments ? (
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
              <th>Última modificação</th>
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
              {filterWorkflows.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td><Link className="workflow" to={'/workflows/' + u.id}>{u.name}</Link></td>
                  <td>{u.updated_at}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={'/workflows/edit/' + u.id}>Editar</Link>
                    &nbsp;
                    <button className="btn-delete" onClick={ev => onDeleteWorkflow(u)}>Deletar</button>
                  </td>
                </tr>
              ))}
              </tbody>
            }
          </table>
        </div>
      </div>
    ) : (
      <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Sub-setores Workflows</h1>
        <Link className="btn-add" to="/workflows/new">Adicionar</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Última modificação</th>
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
            {filterSubWorkflows.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td><Link className="workflow" to={'/workflows/' + u.id}>{u.name}</Link></td>
                <td>{u.updated_at}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/workflows/edit/' + u.id}>Editar</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteWorkflow(u)}>Deletar</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
    )}
      {!isSubDepartments && (
        <div>
          <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
            <h1>Sub-setores</h1>
            <Link className="btn-add" to="/subdepartments/new">Adicionar</Link>
          </div>
          <div className="card animated fadeInDown">
            <table>
              <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Última modificação</th>
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
                {filterSubdepartments.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td><Link className="workflow" to={'/subdepartments/' + u.id}>{u.name}</Link></td>
                    <td>{u.updated_at}</td>
                    <td>{u.created_at}</td>
                    <td>
                      <Link className="btn-edit" to={'/departments/edit/' + u.id}>Editar</Link>
                      &nbsp;
                      <button className="btn-delete" onClick={ev => onDeleteSubdepartment(u)}>Deletar</button>
                    </td>
                  </tr>
                ))}
                </tbody>
              }
            </table>
          </div>
        </div>
      )}
    </>
  )
}