import { Helmet } from 'react-helmet-async';

import { VideoView } from 'src/sections/video/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title>Video Management</title>
      </Helmet>

      <VideoView />
    </>
  );
}
