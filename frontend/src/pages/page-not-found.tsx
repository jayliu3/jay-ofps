import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('404 Page Not Found')} </title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
