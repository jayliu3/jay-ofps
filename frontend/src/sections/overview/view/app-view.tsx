import { useTranslation } from 'react-i18next';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function AppView() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        {t('Welcome')}
      </Typography>
    </Container>
  );
}
