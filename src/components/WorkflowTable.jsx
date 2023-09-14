import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axiosClient from '../axios-client.js';

WorkflowTable.propTypes = {
  id: PropTypes.string.isRequired,
  setNotification: PropTypes.func.isRequired,
};

export default function WorkflowTable({ id, setNotification }) {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWorkflows();
  }, []);

  const getWorkflows = () => {
    setLoading(true);
    axiosClient
      .get(`/departments/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setWorkflows(data.workflows);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDeleteWorkflow = (workflow) => {
    if (!window.confirm('Tem certeza que deseja deletar este workflow?')) {
      return;
    }
    axiosClient.delete(`/workflows/${workflow.id}`).then(() => {
      setNotification('Workflow deletado com sucesso');
      getWorkflows();
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
        <h1>Workflows</h1>
        <Link className='btn-add' to='/workflows/new'>
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
          {loading && (
            <tbody>
              <tr>
                <td colSpan='5' className='text-center'>
                  Carregando...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {workflows.map((workflow) => (
                <tr key={workflow.id}>
                  <td>{workflow.id}</td>
                  <td>
                    <Link className='workflow' to={'/workflows/' + workflow.id}>
                      {workflow.name}
                    </Link>
                  </td>
                  <td>{workflow.updated_at}</td>
                  <td>{workflow.created_at}</td>
                  <td>
                    <Link
                      className='btn-edit'
                      to={'/workflows/edit/' + workflow.id}
                    >
                      Editar
                    </Link>
                    &nbsp;
                    <button
                      className='btn-delete'
                      onClick={(ev) => onDeleteWorkflow(workflow)}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
