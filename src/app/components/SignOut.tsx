import { signOut } from "next-auth/react"

const SignOut = () => {
    return (
        <header className="bg-gray-800 p-4 text-white fixed top-0 z-50 w-full">
            <div className="container mx-auto flex justify-between items-center">  
            <button
                className="bg-indigo-900 hover:bg-indigo-800 px-4 py-2 rounded focus:outline-none focus:shadow-outline-red ml-auto"
                onClick={() => signOut()}
            >
                Sign Out
            </button>
            </div>

        </header>
    );
  };
  
  export default SignOut;