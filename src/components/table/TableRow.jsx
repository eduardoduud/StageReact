import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

TableRow.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  basePath: PropTypes.string.isRequired, // Adicione a prop basePath
};

export default function TableRow({ data, onDeleteClick, basePath }) {
  return (
    <tr key={data.id}>
      <td>{data.id}</td>
      <td>
        <Link className='workflow' to={`${basePath}/${data.id}`}>
          {data.name}
        </Link>
      </td>
      <td>{data.updated_at}</td>
      <td>{data.created_at}</td>
      <td>
        <Link className='btn-edit' to={`${basePath}/edit/${data.id}`}>
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
