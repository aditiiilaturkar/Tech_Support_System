import { lazy } from 'react';

// const Chart = lazy(() => import('../pages/Chart'));
// const FormElements = lazy(() => import('../pages/Form/FormElements'));
// const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
// const Profile = lazy(() => import('../pages/Profile'));
// const Settings = lazy(() => import('../pages/Settings'));
// const Tables = lazy(() => import('../pages/Tables'));
// const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
// const Buttons = lazy(() => import('../pages/UiElements/Buttons'));

const Component = () =>{
    return  (
        // <div style={{ color: 'black' }}>
        <p className="mt-2 text-center text-sm text-gray-600 mt-5">
            welcome
            {/* <Link to={linkUrl} className="font-mediu text-pink-500 hover:text-pink-500">
                {linkName} 
            </Link> */}
            </p>
    // </div>

    )
}

const coreRoutes = [
  {
    path: '/profile',
    title: 'Profile',
    component: Component
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: Component,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: Component
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Component
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Component
  },
//   {
//     path: '/ui/alerts',
//     title: 'Alerts',
//     component: Alerts,
//   },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Component
  },
];

const routes = [...coreRoutes];
export default routes;
