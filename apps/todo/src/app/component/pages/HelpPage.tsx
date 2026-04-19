import { useTranslation } from 'react-i18next';

function HelpPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-dark-bg">{t('help.title')}</h1>
      <p className="text-secondary-dark-bg">{t('help.comingSoon')}</p>
    </div>
  );
}

export default HelpPage;
