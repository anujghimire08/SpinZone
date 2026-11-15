const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#f7f7f5] flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
