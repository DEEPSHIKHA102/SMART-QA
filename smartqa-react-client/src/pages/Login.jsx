import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login`,
        form,
        { withCredentials: true }
      );

      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('❌ Invalid credentials');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { email, name } = decoded;

    try {
      // Try login with email as password (simple fallback logic)
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login`,
        {
          email,
          password: email,
        },
        { withCredentials: true }
      );

      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch {
      // Register if login fails
      try {
        await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/auth/register`, {
          name,
          email,
          password: email,
        });

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
        console.error('Google Login/Register failed', err);
        alert('Google login failed');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login to SmartQA</h2>

      {/* Manual Login Form */}
      <form onSubmit={handleSubmit} className="w-50 mx-auto mb-4">
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
          Login
        </button>
      </form>

      <div className="text-center mb-3">or</div>

      {/* Google Login Button */}
      <div className="d-flex justify-content-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log('Google Login Failed')}
        />
      </div>
    </div>
  );
};

export default Login;
