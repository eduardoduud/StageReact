import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

TableRow.propTypes = {
  data: PropTypes.string.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default function TableRow({ data, onDeleteClick }) {
  return (
    <tr key={data.id}>
      <td>{data.id}</td>
      <td>
        <Link className='workflow' to={`/departments/${data.id}`}>
          {data.name}
        </Link>
      </td>
      <td>{data.updated_at}</td>
      <td>{data.created_at}</td>
      <td>
        <Link className='btn-edit' to={`/departments/edit/${data.id}`}>
          Editar
        </Link>
        &nbsp;
        <button className='btn-delete' onClick={() => onDeleteClick(data)}>
          Deletar
        </button>
      </td>
    </tr>
  );
}
