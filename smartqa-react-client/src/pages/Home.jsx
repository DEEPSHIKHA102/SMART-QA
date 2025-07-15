import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="container text-center py-5">
      {user ? (
        <>
          {/* SmartQA Instructions */}
          <h2 className="mb-3">SmartQA - Get Started!</h2>
          <p className="mb-2">
            Click on <strong>Create Room</strong> if you are the host to get started. Share the code with participants.
          </p>
          <p className="mb-4">
            If you are a participant, click on <strong>Join Room</strong> and enter the room code shared by the host.
          </p>

          {/* Buttons */}
          <Link to="/create" className="btn btn-primary me-2">
            Create Room
          </Link>
          <Link to="/join" className="btn btn-success">
            Join Room
          </Link>
        </>
      ) : (
        <div className="text-center">
          <h2 className="mb-3">Welcome to SmartQA</h2>
          <p className="lead">
            Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to continue.
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
