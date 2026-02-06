type TextProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  className?: string;
  children: React.ReactNode;
};

const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  className = '',
  children,
}) => {
  return <Component className={className}>{children}</Component>;
};

export default Text;
