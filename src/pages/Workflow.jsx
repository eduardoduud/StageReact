import { useStateContext } from '../contexts/ContextProvider.jsx';
import { useParams, useLocation } from 'react-router-dom';
import WorkflowTable from '../components/WorkflowTable';
import SubworkflowTable from '../components/SubworkflowTable';
import SubdepartmentTable from '../components/SubdepartmentTable';

const Workflows = () => {
  const location = useLocation();
  const { id } = useParams();
  const { setNotification } = useStateContext();

  return (
    <>
      {!location.pathname.match(/^\/subdepartments(\/|$)/) ? (
        <>
          <WorkflowTable id={id} setNotification={setNotification} />
          <SubdepartmentTable id={id} setNotification={setNotification} />
        </>
      ) : (
        <SubworkflowTable id={id} setNotification={setNotification} />
      )}
    </>
  );
};

export default Workflows;
