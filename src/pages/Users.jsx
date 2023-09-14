import { useEffect, useState } from 'react';
import axiosClient from '../axios-client.js';
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import TableHeader from '../components/table/TableHeader.jsx';
import TableRow from '../components/table/TableRow.jsx';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getUsers();
  }, []);

  const onDeleteClick = (user) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }
    axiosClient.delete(`/users/${user.id}`).then(() => {
      setNotification('Usuário deletado com sucesso');
      getUsers();
    });
  };

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get('/users')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
      })
      .catch(() => {
        setLoading(false);
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
        <h1>Usuários</h1>
        <Link className='btn-add' to='/users/new'>
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
              users.map((u) => (
                <TableRow key={u.id} data={u} onDeleteClick={onDeleteClick} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
