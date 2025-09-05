import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import publicAPI  from '../api/api.js'; // make sure this matches your export

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic,setProfilePic]=useState(null);
  const [preview, setPreview] = useState(null); // new state for preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();




  useEffect(() => {
    if (!profilePic) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(profilePic);
    setPreview(objectUrl);

    // Cleanup memory when component unmounts or profilePic changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePic]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await publicAPI.post('/auth/register', { username, email, password,profilePic }, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Signup success:", res.data);
      alert("Signup successful!");
      navigate('/login'); // redirect to login page
    } catch (err) {
      console.error("Signup error:", err.response?.data?.msg || err.message);
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />

          </div>

          <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <input
            type="file"
            id="profilePic"
           
            onChange={(e) => setProfilePic(e.target.files[0])}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded"
          />

         
        </div>

          

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;




// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import publicAPI from '../api/api.js';

// const Signup = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [profilePic, setProfilePic] = useState(null); // fixed: uncommented
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (!username || !email || !password) {
//       setError("All fields are required");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Use FormData for file upload
//       const formData = new FormData();
//       formData.append("username", username);
//       formData.append("email", email);
//       formData.append("password", password);
//       if (profilePic) formData.append("profilePic", profilePic);

//       const res = await publicAPI.post("/auth/register", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("Signup success:", res.data);
//       alert("Signup successful!");
//       navigate("/login");
//     } catch (err) {
//       console.error("Signup error:", err.response?.data?.error || err.message);
//       setError(err.response?.data?.error || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
//         <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
//           <div className="mb-4">
//             <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
//             <input
//               type="text"
//               id="username"
//               value={username}
//               onChange={e => setUsername(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="profilePic" className="block text-sm font-medium mb-2">Profile Picture</label>
//             <input
//               type="file"
//               id="profilePic"
//               onChange={(e) => setProfilePic(e.target.files[0])}
//               accept="image/*"
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>

//           {error && <p className="text-red-500">{error}</p>}

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//             disabled={loading}
//           >
//             {loading ? "Signing up..." : "Sign Up"}
//           </button>
//         </form>

//         <p className="text-center mt-4 text-gray-600">
//           Already have an account?{" "}
//           <span
//             className="text-blue-500 cursor-pointer hover:underline"
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;
