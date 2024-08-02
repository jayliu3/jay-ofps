import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import WebLayout from 'src/website/layouts';
import DashboardLayout from 'src/layouts/dashboard';

export const FileInfoPage = lazy(() => import('src/pages/fileInfo'));
export const VideoPage = lazy(() => import('src/pages/video'));
export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export const HomePage = lazy(() => import('src/website/pages/home'));
export const DetailPage = lazy(() => import('src/website/pages/detail'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'fileInfo', element: <FileInfoPage /> },
        { path: 'video', element: <VideoPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'home',
      element: (
        <WebLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </WebLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'detail/:id', element: <DetailPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
