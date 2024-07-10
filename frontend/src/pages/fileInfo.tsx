import { Helmet } from 'react-helmet-async';

import { FileInfoView } from 'src/sections/fileInfo/view';

// ----------------------------------------------------------------------

export default function FileInfoPage() {
  return (
    <>
      <Helmet>
        <title>FileInfo Management</title>
      </Helmet>

      <FileInfoView />
    </>
  );
}
