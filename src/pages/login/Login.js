import React, { useState } from "react";
import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((store) => store.authSlice?.loading);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await dispatch(login({ email, password })).unwrap();
      toast.success("Welcome back! You are logged in.");
      navigate("/");
    } catch (error) {
      toast.error(error || "Login failed. Please check your credentials.");
    }
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  return (
    <div className="login">
      <div className="loginwrapper">
        <div className="loginleft">
          <h3 className="loginlogo">US Social</h3>
          <span className="logindesc">
            Connect with Friends and the World around you on US Social
          </span>
        </div>
        <div className="loginright">
          <form className="loginbox" onSubmit={handleLogin}>
            <input
              value={email}
              type="email"
              placeholder="Enter your Email"
              className="logininput"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              value={password}
              type="password"
              placeholder="Enter your Password"
              className="logininput"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="loginbutton" type="submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Log In"}
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="loginregisterbutton"
            >
              Create a New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
