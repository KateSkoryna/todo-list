type TextProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  className?: string;
  children: React.ReactNode;
  dataTestId?: string;
};

const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  className = '',
  children,
  dataTestId,
}) => {
  return (
    <Component className={className} data-testid={dataTestId}>
      {children}
    </Component>
  );
};

export default Text;
