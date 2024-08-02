import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import WebLayout from 'src/website/layouts';
import DashboardLayout from 'src/layouts/dashboard';

export const FileInfoPage = lazy(() => import('src/pages/fileInfo'));
export const VideoPage = lazy(() => import('src/pages/video'));
export const IndexPage = lazy(() => import('src/pages/app'));
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
