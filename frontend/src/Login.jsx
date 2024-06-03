import { useState } from "react";
import App from "./App";

function Login() {
  const [name, setName] = useState("");
  const [showApp, setShowApp] = useState(false);

  const handleSubmit = () => {
    setShowApp(true);
  };

  if (showApp) {
    return <App username={name} />;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 h-1/2 bg-amber-400 flex flex-col items-center justify-center">
        <h1 className="pb-8 text-5xl">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <input
              className="h-8 border-2 border-gray-500 text-center rounded-md"
              type="text"
              placeholder="Enter the Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="h-8 bg-black text-white rounded-md" type="submit">Login to Chat</button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default Login;
