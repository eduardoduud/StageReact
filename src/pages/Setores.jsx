import { useEffect, useState } from 'react';
import axiosClient from '../axios-client.js';
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import TableHeader from '../components/table/TableHeader.jsx';
import TableRow from '../components/table/TableRow.jsx';

export default function Setores() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getSetores();
  }, []);

  const onDeleteClick = async (department) => {
    if (!window.confirm('Tem certeza que deseja deletar este setor?')) {
      return;
    }

    try {
      await axiosClient.delete(`/departments/${department.id}`);
      setNotification('Setor deletado com sucesso');
      getSetores();
    } catch (error) {
      console.error('Erro ao deletar setor:', error);
    }
  };

  const getSetores = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/departments');
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
    } finally {
      setLoading(false);
    }
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
        <h1>Setores</h1>
        <Link className='btn-add' to='/departments/new'>
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
            ) : (
              departments.map((u) => (
                <TableRow key={u.id} data={u} onDeleteClick={onDeleteClick} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
