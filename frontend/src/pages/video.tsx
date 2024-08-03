import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { VideoView } from 'src/sections/video/view';

// ----------------------------------------------------------------------

export default function VideoPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('Video Management')}</title>
      </Helmet>

      <VideoView />
    </>
  );
}
