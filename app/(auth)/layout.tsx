const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return ( 
        <div className="flex justify-center items-center bg-red-500 h-full">
            {children}
        </div>
     );
}
 
export default AuthLayout;