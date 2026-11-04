const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-red-500 flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
