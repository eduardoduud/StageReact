import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axiosClient from '../axios-client.js';

SubdepartmentTable.propTypes = {
  id: PropTypes.string.isRequired,
  setNotification: PropTypes.func.isRequired,
};

export default function SubdepartmentTable({ id, setNotification }) {
  const [subdepartments, setSubdepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSubSetores();
  }, []);

  const getSubSetores = () => {
    setLoading(true);
    axiosClient
      .get(`/departments/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setSubdepartments(data.subdepartments);
        console.log(subdepartments);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDeleteSubdepartment = (subdepartment) => {
    if (!window.confirm('Tem certeza que deseja deletar este Sub-setor?')) {
      return;
    }
    axiosClient.delete(`/subdepartments/${subdepartment.id}`).then(() => {
      setNotification('Sub-setor deletado com sucesso');
      getSubSetores();
    });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Sub-setores</h1>
        <Link className='btn-add' to='/subdepartments/new'>
          Adicionar
        </Link>
      </div>
      <div className='card animated fadeInDown'>
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
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='5' className='text-center'>
                  Carregando...
                </td>
              </tr>
            ) : subdepartments && subdepartments.length > 0 ? (
              subdepartments.map((subdepartment) => (
                <tr key={subdepartment.id}>
                  <td>{subdepartment.id}</td>
                  <td>
                    <Link
                      className='workflow'
                      to={'/subdepartments/' + subdepartment.id}
                    >
                      {subdepartment.name}
                    </Link>
                  </td>
                  <td>{subdepartment.updated_at}</td>
                  <td>{subdepartment.created_at}</td>
                  <td>
                    <Link
                      className='btn-edit'
                      to={'/departments/edit/' + subdepartment.id}
                    >
                      Editar
                    </Link>
                    &nbsp;
                    <button
                      className='btn-delete'
                      onClick={(ev) => onDeleteSubdepartment(subdepartment)}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='text-center'>
                  Nenhum sub-setor encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
