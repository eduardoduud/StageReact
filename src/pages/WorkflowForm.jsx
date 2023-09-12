import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function WorkflowsForm() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [subdepartments, setSubdepartments] = useState([]);
  let {id} = useParams();
  const [workflow, setWorkflow] = useState({
    id: null,
    sub_id: null,
    name: '',
    department_id: '',
    description: '',
    htmltext: 'Faça suas anotações aqui',
  })
  const [originalName, setOriginalName] = useState("");
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  useEffect(() => {
    axiosClient.get('/departments')
    .then(({ data }) => {
      if (data && Array.isArray(data.data)) {
        const departmentsArray = data.data;
        setDepartments(departmentsArray);
      } else {
        console.error('A resposta da API não contém uma matriz de setores válida.');
      }
    })
    .catch(error => {
      console.error('Erro ao carregar os setores', error);
    });

    axiosClient.get('/subdepartments')
    .then(({ data }) => {
      if (data && Array.isArray(data.data)) {
        const subDepartmentsArray = data.data;
        setSubdepartments(subDepartmentsArray);
      } else {
        console.error('A resposta da API não contém uma matriz de setores válida.');
      }
    })
  }, []);
  

  if (id) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/workflows/${id}`)
        .then(({data}) => {
          setLoading(false)
          setWorkflow(data)
          setOriginalName(data.name);
        })
        .catch(() => {
          setLoading(false)
        })
    }, [id])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (workflow.id) {
      axiosClient.put(`/workflows/${workflow.id}`, workflow)
        .then(() => {
          setNotification('Workflow atualizado com sucesso')
          if (workflow.sub_id !== null){
            navigate(`/subdepartments/${workflow.sub_id}`);
          } else {
              navigate(`/departments/${workflow.department_id}`)
            }
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/workflows', workflow)
        .then(() => {
          setNotification('Workflow criado com sucesso')
          if (workflow.sub_id !== null){
            navigate(`/subdepartments/${workflow.sub_id}`);
          } else {
              navigate(`/departments/${workflow.department_id}`)
            }
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
      {workflow.id && <h1>Atualizar Workflow: {originalName}</h1>}
      {!workflow.id && <h1>Novo Workflow</h1>}
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
              value={workflow.name}
              onChange={ev => setWorkflow({...workflow, name: ev.target.value})}
              placeholder="Nome"/>
            <select
              onChange={ev => setWorkflow({...workflow, department_id: ev.target.value})}
              placeholder="Setor"
            >
              <option value="">Selecione um Setor</option>
              {departments.map(setor => (
                <option key={setor.id} value={setor.id}>
                  {setor.name} - {setor.id}
                </option>
              ))}
            </select>
            <select
              onChange={ev => setWorkflow({...workflow, sub_id: ev.target.value})}
              placeholder="Sub-setor"
            >
              <option value="">Selecione um Sub-setor</option>
              {subdepartments.map(setor => (
                <option key={setor.id} value={setor.id}>
                  {setor.name} - {setor.id}
                </option>
              ))}
            </select>
            <textarea
              className='textarea-form'
              value={workflow.description}
              onChange={ev => setWorkflow({...workflow, description: ev.target.value})}
              placeholder="Descrição do processo"
            />
            <button className="btn">Salvar</button>
          </form>
        )}
      </div>
    </>
  )
}