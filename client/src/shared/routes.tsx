// import Layout from "./layout";
// import System from "../system";
// import Modules, { action as newModule, loader as modulesLoader} from "../system/modules/modules";
// import ModuleEdit, { action as moduleAction, loader as moduleLoader } from "../system/modules/edit/edit";
// import React from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import Dashboard from '../dashboard';
import { Outlet, useLocation } from 'react-router-dom'
import Layout from './layout';
import Day from '~/day-review/day';

const routes = [{
    path: '/',
    element: <Layout />,
    name: 'layout',
    key: 'sub1',
    meta: {
      title: 'layout',
      hidden: false
    },
    children: [
      {
        path: '/',
        element: <Navigate to="/home" />,
        key: '1',
        meta: {
          title: '首页',
          hidden: false,
          // icon: <HomeFilled />
        }
      },
      {
        path: 'home',
        element: <Dashboard />,
        key: '2',
        meta: {
          title: '首页',
          hidden: true,
          // icon: <HomeFilled />
        }
      },
      {
        path: 'papers/:dayId',
        element: <Day />,
        key: '2',
        meta: {
          title: '首页',
          hidden: true,
          // icon: <HomeFilled />
        }
      }
    ]
  },
  {
    path: '/404',
    // element: <NotFound />,
    element: <div>Losing</div>,
    name: '404',
    key: '5',
    meta: {
      title: '404',
      hidden: true
    }
  },
]

export default createBrowserRouter(routes)
