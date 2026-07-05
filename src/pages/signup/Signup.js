import React, { useState } from "react";
import "../login/login.css";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((store) => store.authSlice?.loading);

  const handlesignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await dispatch(signup({ username, email, password, phone })).unwrap();
      toast.success("Account created! Welcome to US Social ");
      navigate("/");
    } catch (error) {
      toast.error(error || "Signup failed. Please try again.");
    }
  };

  const handleLogin = () => {
    navigate("/login");
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
          <form className="loginbox" onSubmit={handlesignup}>
            <input
              value={username}
              type="text"
              placeholder="Enter Username"
              className="logininput"
              onChange={(e) => setUsername(e.target.value)}
            />
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
              placeholder="Enter your Password (min 6 chars)"
              className="logininput"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              value={phone}
              type="tel"
              placeholder="Enter your Phone number (optional)"
              className="logininput"
              onChange={(e) => setPhone(e.target.value)}
            />
            <button className="loginbutton" type="submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Sign Up"}
            </button>
            <button
              type="button"
              onClick={handleLogin}
              className="loginregisterbutton"
            >
              Login to your Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
