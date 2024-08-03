import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { FileInfoView } from 'src/sections/fileInfo/view';

// ----------------------------------------------------------------------

export default function FileInfoPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('FileInfo Management')}</title>
      </Helmet>

      <FileInfoView />
    </>
  );
}
