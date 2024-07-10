import { Helmet } from 'react-helmet-async';

import { VideoView } from 'src/sections/video/view';

// ----------------------------------------------------------------------

export default function VideoPage() {
  return (
    <>
      <Helmet>
        <title>Video Management</title>
      </Helmet>

      <VideoView />
    </>
  );
}
