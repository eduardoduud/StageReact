import { Navigate, createBrowserRouter } from 'react-router-dom';
import Signup from '../pages/signup/Signup';
import Login from '../pages/login/Login';
import Users from '../pages/Users';
import NotFound from '../pages/NotFound';
import DefaultLayout from '../layouts/DefaultLayout';
import GuestLayout from '../layouts/GuestLayout';
import Workflow from '../pages/Workflow';
import Setores from '../pages/Setores';
import WorkflowForm from '../components/forms/WorkflowForm';
import SetorForm from '../components/forms/SetorForm';
import SubSetorForm from '../components/forms/SubSetorForm';
import UserForm from '../components/forms/UserForm';
import { Editor } from '../components/Editor';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to='/users' />,
      },
      {
        path: '/workflows',
        element: <Workflow />,
      },
      {
        path: '/departments',
        element: <Setores />,
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/users/new',
        element: <UserForm key='userCreate' />,
      },
      {
        path: '/users/:id',
        element: <UserForm key='userUpdate' />,
      },
      {
        path: '/departments/new',
        element: <SetorForm key='setorCreate' />,
      },
      {
        path: '/departments/:id',
        element: <Workflow key='workflows' />,
      },
      {
        path: '/departments/edit/:id',
        element: <SetorForm key='setorUpdate' />,
      },
      {
        path: '/subdepartments/new',
        element: <SubSetorForm key='subsetorCreate' />,
      },
      {
        path: '/subdepartments/:id',
        element: <Workflow key='workflows' />,
      },
      {
        path: '/subdepartments/edit/:id',
        element: <SetorForm key='setorUpdate' />,
      },
      {
        path: '/workflows/new',
        element: <WorkflowForm key='workflowCreate' />,
      },
      {
        path: '/workflows/:id',
        element: <Editor key='editor' />,
      },
      {
        path: '/workflows/edit/:id',
        element: <WorkflowForm key='workflowUpdate' />,
      },
    ],
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
