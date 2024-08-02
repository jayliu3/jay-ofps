import { Helmet } from 'react-helmet-async';

import HomeView from '../sections/home';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> OF影院|详细信息 </title>
      </Helmet>

      <HomeView />
    </>
  );
}
