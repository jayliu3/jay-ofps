import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { Box } from '@mui/material';

export default function DetailPage() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title> OF影院|详细信息 </title>
      </Helmet>

      <Box component="span">{id}</Box>
    </>
  );
}
