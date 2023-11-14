const Component = () =>{
    return  (
        <p className="mt-2 text-center text-sm text-gray-600 mt-5">
            welcome
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
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Component
  },
];

const routes = [...coreRoutes];
export default routes;
