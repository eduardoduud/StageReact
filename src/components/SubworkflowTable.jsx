import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axiosClient from '../axios-client.js';
import TableHeader from '../components/table/TableHeader.jsx';
import TableRow from '../components/table/TableRow.jsx';

SubworkflowTable.propTypes = {
  id: PropTypes.string.isRequired,
  setNotification: PropTypes.func.isRequired,
};

export default function SubworkflowTable({ id, setNotification }) {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWorkflows();
  }, []);

  const getWorkflows = () => {
    setLoading(true);
    axiosClient
      .get(`/subdepartments/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setWorkflows(data.workflows);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDeleteClick = (workflow) => {
    if (!window.confirm('Tem certeza que deseja deletar este Sub-setor?')) {
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
        <h1>Sub-Workflows</h1>
        <Link className='btn-add' to='/workflows/new'>
          Adicionar
        </Link>
      </div>
      <div className='card animated fadeInDown'>
        <table>
          <TableHeader />
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='5' className='text-center'>
                  Carregando...
                </td>
              </tr>
            ) : workflows && workflows.length > 0 ? (
              workflows.map((u) => (
                <TableRow
                  key={u.id}
                  data={u}
                  onDeleteClick={onDeleteClick}
                  basePath='/workflows'
                />
              ))
            ) : (
              <tr>
                <td colSpan='5' className='text-center'>
                  Nenhum sub-workflow encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
