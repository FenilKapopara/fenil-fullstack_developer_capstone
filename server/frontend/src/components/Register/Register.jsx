import React, { useState } from "react";

const Register = () => {
    const [userName, setUserName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        // Registration logic
    };

    return (
        <div className="register_container">
            <h2>Sign Up</h2>
            <form onSubmit={handleRegister}>
                <div className="input_group">
                    <label>Username</label>
                    <input type="text" onChange={(e) => setUserName(e.target.value)} placeholder="Username" required />
                </div>
                <div className="input_group">
                    <label>First Name</label>
                    <input type="text" onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
                </div>
                <div className="input_group">
                    <label>Last Name</label>
                    <input type="text" onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
                </div>
                <div className="input_group">
                    <label>Email</label>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                </div>
                <div className="input_group">
                    <label>Password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                </div>
                <button type="submit" className="register_btn">Register</button>
            </form>
        </div>
    );
};

export default Register;
