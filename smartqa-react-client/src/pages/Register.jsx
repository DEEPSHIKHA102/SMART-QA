import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/register`,
        form,
        { withCredentials: true }
      );
      alert("✅ Registered successfully! You can now log in.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert("❌ Registration failed.");
    }
  };

  const handleGoogleRegister = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { email, name } = decoded;

    try {
      // Register with Google details
      await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/register`,
        {
          name,
          email,
          password: email, // using email as default password
        },
        { withCredentials: true }
      );

      // Then auto-login
      const loginRes = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login`,
        {
          email,
          password: email,
        },
        { withCredentials: true }
      );

      localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Google registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Register</h2>

      {/* Manual Register Form */}
      <form onSubmit={handleSubmit} className="w-50 mx-auto mb-4">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>

      {/* Divider */}
      <div className="text-center mb-3">or</div>

      {/* Google Sign-Up Button */}
      <div className="d-flex justify-content-center">
        <GoogleLogin
          onSuccess={handleGoogleRegister}
          onError={() => console.log("Google Register Failed")}
        />
      </div>
    </div>
  );
};

export default Register;
