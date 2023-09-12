import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function SubSetorForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [departments, setDepartments] = useState([]);
  const [subdepartment, setSubdepartment] = useState({
    id: null,
    department_id: '',
    name: "",
  });
  const [originalName, setOriginalName] = useState("");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  if (id) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/subdepartments/${id}`)
        .then(({ data }) => {
          setLoading(false);
          console.log(data);
          setSubdepartment(data);
          setOriginalName(data.name);
        })
        .catch(() => {
          setLoading(false);
        });
    }, [id]);
  }

  if (!id)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    axiosClient.get('/departments')
    .then(({ data }) => {
      if (data && Array.isArray(data.data)) {
        const setoresArray = data.data;
        setDepartments(setoresArray);
      } else {
        console.error('A resposta da API não contém uma matriz de setores válida.');
      }
    })
    .catch(error => {
      console.error('Erro ao carregar os setores', error);
    });
  

  }, []);

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (subdepartment.id) {
      axiosClient
        .put(`/subdepartments/${subdepartment.id}`, subdepartment)
        .then(() => {
          setNotification("Setor atualizado com sucesso");
          navigate(`/departments/${subdepartment.department_id}`);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/subdepartments", subdepartment)
        .then(() => {
          setNotification("Setor criado com sucesso");
          navigate(`/departments/${subdepartment.department_id}`);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {subdepartment.id && <h1>Atualizar Sub-setor: {originalName}</h1>}
      {!subdepartment.id && <h1>Novo Sub-setor</h1>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Carregando...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={subdepartment.name}
              onChange={(ev) =>
                setSubdepartment({ ...subdepartment, name: ev.target.value })
              }
              placeholder="Nome"
            />
            <select
              onChange={ev => setSubdepartment({...subdepartment, department_id: ev.target.value})}
              placeholder="Setor">
              <option value="">Selecione um Setor</option>
              {departments.map(setor => (
                <option key={setor.id} value={setor.id}>
                  {setor.name} - {setor.id}
                </option>
              ))}
            </select>
            <button className="btn">Salvar</button>
          </form>
        )}
      </div>
    </>
  );
}