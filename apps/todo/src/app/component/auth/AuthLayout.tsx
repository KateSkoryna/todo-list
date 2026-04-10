import bgImage from '../../../assets/bg.webp';

type Props = {
  illustration: React.ReactNode;
  illustrationSide?: 'left' | 'right';
  children: React.ReactNode;
};

function AuthLayout({
  illustration,
  illustrationSide = 'left',
  children,
}: Props) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '800px',
      }}
    >
      <div className="absolute inset-0 bg-accent/30" />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl flex w-full max-w-[84rem] overflow-hidden min-h-[720px]">
        {illustrationSide === 'left' ? (
          <>
            {illustration}
            {children}
          </>
        ) : (
          <>
            {children}
            {illustration}
          </>
        )}
      </div>
    </div>
  );
}

export default AuthLayout;
