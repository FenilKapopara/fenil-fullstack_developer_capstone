const { useState, useEffect } = React;

const Navbar = ({ user, onLogout }) => (
    <div className="navbar">
        <div style={{ display: "flex", alignItems: "center" }}>
            <a href="/" style={{ fontSize: "24px", fontWeight: "bold", color: "#FF7500", marginRight: "30px" }}>AutoHaus24</a>
            <a href="/" className="active">Home</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
        </div>
        <div className="auth-links">
            {user ? (
                <React.Fragment>
                    <span style={{ marginRight: "15px", color: "#333" }}>Hello, <b>{user}</b></span>
                    <a href="#" onClick={onLogout}>Logout</a>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <a href="#" onClick={() => window.location.hash = 'login'}>Login</a>
                    <a href="#" onClick={() => window.location.hash = 'register'}>Register</a>
                </React.Fragment>
            )}
        </div>
    </div>
);

const Hero = ({ onSearch, searchTerm, setSearchTerm }) => (
    <div className="hero">
        <h1>Find Your Perfect Car</h1>
        <p>Search through thousands of dealerships and find the best deals.</p>
        <div className="search-mask">
            <input
                type="text"
                placeholder="Search by State (e.g. Kansas, Texas)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={onSearch}>Search Dealers</button>
        </div>
    </div>
);

const Dealers = ({ onSelectDealer }) => {
    const [dealers, setDealers] = useState([]);
    const [state, setState] = useState("");

    const fetchDealers = async () => {
        let url = "/djangoapp/get_dealers";
        if (state) url += "/" + state;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data.dealers) setDealers(data.dealers);
        } catch (e) {
            console.error("Failed to fetch dealers", e);
        }
    };

    useEffect(() => { fetchDealers(); }, []);

    return (
        <div>
            <Hero onSearch={fetchDealers} searchTerm={state} setSearchTerm={setState} />
            <div className="container">
                <h2>Our Dealership Network</h2>
                <div className="card-container">
                    {dealers.map(d => (
                        <div key={d.id} className="card">
                            <img src={`https://loremflickr.com/500/300/car?random=${d.id}`} alt="Car" />
                            <div className="card-body">
                                <h3>{d.full_name} (ID: {d.id})</h3>
                                <p>📍 {d.address}, {d.city}, {d.state} {d.zip}</p>
                                <button onClick={() => onSelectDealer(d)}>View Inventory</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

const DealerDetails = ({ dealer, onBack }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`/djangoapp/reviews/dealer/${dealer.id}`)
            .then(res => res.json())
            .then(data => setReviews(data.reviews || []))
            .catch(err => console.error("Error fetching reviews:", err));
    }, [dealer]);

    const getSentimentIcon = (sentiment) => {
        if (sentiment === 'positive') return "😊";
        if (sentiment === 'negative') return "😠";
        return "😐";
    };

    return (
        <div className="container" style={{ marginTop: "30px" }}>
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#FF7500", cursor: "pointer", fontWeight: "bold", marginBottom: "15px" }}>&larr; Back to Search</button>

            <div className="card" style={{ marginBottom: "40px" }}>
                <div className="card-body">
                    <h1 style={{ color: "#002F5F", marginBottom: "5px" }}>{dealer.full_name}</h1>
                    <p style={{ fontSize: "1.1rem" }}>{dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}</p>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Customer Reviews</h2>
                <button
                    onClick={() => window.location.hash = `addreview/${dealer.id}`}
                    style={{ backgroundColor: "#FF7500", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}
                >
                    Write a Review
                </button>
            </div>

            <div className="card" style={{ padding: "0 20px" }}>
                {reviews.length === 0 ? <p style={{ padding: "20px" }}>No reviews yet. Be the first!</p> : reviews.map((r, i) => (
                    <div key={i} className="review-card" style={{ display: "flex", alignItems: "start" }}>
                        <div className="sentiment-icon">{getSentimentIcon(r.sentiment)}</div>
                        <div>
                            <h4 style={{ margin: "0 0 5px 0" }}>{r.name} {r.purchase ? <span style={{ fontSize: "0.8rem", color: "green", background: "#e6fffa", padding: "2px 6px", borderRadius: "4px" }}>Verified Purchase</span> : ""}</h4>
                            <p style={{ margin: 0 }}>"{r.review}"</p>
                            {r.purchase && <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "5px" }}>Purchased: {r.car_make} {r.car_model} ({r.car_year})</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/djangoapp/login", {
                method: "POST", body: JSON.stringify({ userName, password })
            });
            const data = await res.json();
            if (data.userName) {
                sessionStorage.setItem("user", data.userName);
                window.location.hash = "";
                window.location.reload();
            } else {
                alert("Login failed: " + (data.error || "Unknown error"));
            }
        } catch (e) { console.error("Login connect error", e); alert("System error"); }
    };

    return (
        <div className="container">
            <div className="contact-form">
                <h2 style={{ textAlign: "center" }}>Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group"><label>User Name</label><input onChange={e => setUserName(e.target.value)} required /></div>
                    <div className="form-group"><label>Password</label><input type="password" onChange={e => setPassword(e.target.value)} required /></div>
                    <button>Sign In</button>
                </form>
            </div>
        </div>
    )
}

const Register = () => {
    const [formData, setFormData] = useState({ userName: "", password: "", firstName: "", lastName: "", email: "" });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/djangoapp/register", {
                method: "POST", body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.userName) {
                sessionStorage.setItem("user", data.userName);
                window.location.hash = "";
                window.location.reload();
            } else {
                alert("Registration failed: " + (data.error || "Unknown error"));
            }
        } catch (e) { console.error("Reg error", e); }
    };

    return (
        <div className="container">
            <div className="contact-form">
                <h2 style={{ textAlign: "center" }}>Create Account</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group"><label>Username</label><input name="userName" onChange={handleChange} required /></div>
                    <div className="form-group"><label>First Name</label><input name="firstName" onChange={handleChange} required /></div>
                    <div className="form-group"><label>Last Name</label><input name="lastName" onChange={handleChange} required /></div>
                    <div className="form-group"><label>Email</label><input name="email" type="email" onChange={handleChange} required /></div>
                    <div className="form-group"><label>Password</label><input name="password" type="password" onChange={handleChange} required /></div>
                    <button>Sign Up</button>
                </form>
            </div>
        </div>
    )
}

const AddReview = ({ dealerId }) => {
    const [review, setReview] = useState("");
    const [date, setDate] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");

    const submit = async () => {
        const user = sessionStorage.getItem("user");
        if (!user) return alert("Please login");

        try {
            await fetch("/djangoapp/add_review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dealership: parseInt(dealerId),
                    review: review,
                    name: user,
                    purchase: true,
                    purchase_date: date,
                    car_make: make,
                    car_model: model,
                    car_year: year
                })
            });
            alert("Review Submitted!");
            window.location.hash = "";
        } catch (e) { console.error("Post review error", e); }
    }

    return (
        <div className="container">
            <div className="contact-form" style={{ maxWidth: "700px" }}>
                <h2>Write a Review</h2>
                <p>Share your experience with this dealer.</p>

                <div className="form-group">
                    <label>Your Review</label>
                    <textarea rows="4" onChange={e => setReview(e.target.value)} placeholder="Tell us about your experience..."></textarea>
                </div>

                <div className="form-group">
                    <label>Purchase Date</label>
                    <input type="date" onChange={e => setDate(e.target.value)} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                    <div className="form-group">
                        <label>Car Make</label>
                        <select onChange={e => setMake(e.target.value)} style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}>
                            <option value="">Select Make</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Ford">Ford</option>
                            <option value="Chevrolet">Chevrolet</option>
                            <option value="Audi">Audi</option>
                            <option value="Mercedes">Mercedes</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Car Model</label>
                        <input type="text" onChange={e => setModel(e.target.value)} placeholder="e.g. Camry" />
                    </div>

                    <div className="form-group">
                        <label>Car Year</label>
                        <input type="number" onChange={e => setYear(e.target.value)} placeholder="2023" />
                    </div>
                </div>

                <div style={{ textAlign: "center", margin: "20px 0" }}>
                    <span style={{ fontSize: "2rem", color: "#FF7500" }}>⭐⭐⭐⭐⭐</span>
                </div>

                <button onClick={submit}>Post Review</button>
            </div>
        </div>
    )
}

const App = () => {
    const [user, setUser] = useState(sessionStorage.getItem("user"));
    const [view, setView] = useState("home");
    const [selectedDealer, setSelectedDealer] = useState(null);

    useEffect(() => {
        const handleHash = () => {
            const hash = window.location.hash.substring(1);
            if (hash === "login") setView("login");
            else if (hash === "register") setView("register");
            else if (hash.startsWith("addreview")) {
                setView("add_review");
                const parts = hash.split("/");
                if (parts.length > 1) setSelectedDealer({ id: parts[1] });
            }
            else {
                setView("home");
                // Don't clear selectedDealer if we just went back to home? No, home IS list.
                // But dealer details shares "home" view logic in previous code -> NO.
                // let's stick to simple view stats.
                setSelectedDealer(null);
            }
        }
        window.addEventListener("hashchange", handleHash);
        handleHash();
        return () => window.removeEventListener("hashchange", handleHash);
    }, []);

    const logout = async () => {
        try { await fetch("/djangoapp/logout"); } catch (e) { }
        sessionStorage.removeItem("user");
        setUser(null);
        window.location.hash = "";
        window.location.reload();
    };

    return (
        <div>
            <Navbar user={user} onLogout={logout} />
            {view === "home" && !selectedDealer && <Dealers onSelectDealer={setSelectedDealer} />}
            {view === "home" && selectedDealer && <DealerDetails dealer={selectedDealer} onBack={() => setSelectedDealer(null)} />}
            {/* Wait, the logic above for "home" and dealer details overrides selectedDealer. 
                I need to separate them better for hash routing or state. 
                Optimized: If selectedDealer is set, we show details. Home view logic clears it.
            */}
            {view === "login" && <Login />}
            {view === "register" && <Register />}
            {view === "add_review" && <AddReview dealerId={selectedDealer ? selectedDealer.id : 1} />}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
