import { useTranslation } from 'react-i18next';
import Button from './Button';
import Text from './Text';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
  className?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-dark-bg text-white p-6 rounded-lg ${className}`}>
      <Text as="h2" className="text-xl font-bold mb-2" dataTestId="error-title">
        {t('error.title')}
      </Text>
      <Text as="p" dataTestId="error-message">
        {error.message}
      </Text>
      {resetErrorBoundary && (
        <Button
          onClick={resetErrorBoundary}
          className="mt-4 px-4 py-2 bg-accent text-black rounded hover:bg-secondary-bg transition-colors"
        >
          {t('error.tryAgain')}
        </Button>
      )}
    </div>
  );
};

export default ErrorFallback;
