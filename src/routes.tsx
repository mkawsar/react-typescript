import { Suspense, lazy } from 'react';
import MainLayout from './layouts/MainLayout';
import AuthGuard from './components/AuthGuard';
import GuestGuard from './components/GuestGuard';
import type { RouteObject } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';

const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) => 
    (
        <Suspense fallback={<LoadingScreen />}>
            <Component {...props} />
        </Suspense>
    );

 const Login = Loadable(lazy(() => import('./pages/authentication/Login')));
//  * HOME PAGE
const Home = Loadable(lazy(() => import('./pages/home/Home') ));

const routes: RouteObject[] = [
    {
        path: 'authentication',
        children: [
            {
                path: 'login',
                element: (
                    <GuestGuard>
                        <Login />
                    </GuestGuard>
                )
            }
        ]
    },
    {
        path: '*',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <AuthGuard>
                        <Home />
                    </AuthGuard>
                )
            },
        ],
    },
];

export default routes;
