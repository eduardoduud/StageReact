import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios-client.js';
import { useStateContext } from '../../contexts/ContextProvider.jsx';

export default function SetorForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [department, setDepartment] = useState({
    id: null,
    name: '',
  });
  const [originalName, setOriginalName] = useState('');
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  if (id) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/departments/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setDepartment(data.department);
          setOriginalName(data.name);
          console.log(department);
        })
        .catch(() => {
          setLoading(false);
        });
    }, [id]);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (department.id) {
      axiosClient
        .put(`/departments/${department.id}`, department)
        .then(() => {
          setNotification('Setor atualizado com sucesso');
          navigate('/departments');
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
      fetch('https://ntfy.sh/eduardo_stage', {
        method: 'POST',
        body: 'Setor atualizado',
        headers: {
          Authorization: 'Bearer tk_98m0t6gbknq63pvodr2qalvt2yowl',
        },
      });
    } else {
      axiosClient
        .post('/departments', department)
        .then(() => {
          setNotification('Setor criado com sucesso');
          navigate('/departments');
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
      fetch('https://ntfy.sh/eduardo_stage', {
        method: 'POST',
        body: 'Setor criado',
        headers: {
          Authorization: 'Bearer tk_98m0t6gbknq63pvodr2qalvt2yowl',
        },
      });
    }
  };

  return (
    <>
      {department.id && <h1>Atualizar Setor: {originalName}</h1>}
      {!department.id && <h1>Novo Setor</h1>}
      <div className='card animated fadeInDown'>
        {loading && <div className='text-center'>Carregando...</div>}
        {errors && (
          <div className='alert'>
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={department.name}
              onChange={(ev) =>
                setDepartment({ ...department, name: ev.target.value })
              }
              placeholder='Nome'
            />
            <button className='btn'>Salvar</button>
          </form>
        )}
      </div>
    </>
  );
}
