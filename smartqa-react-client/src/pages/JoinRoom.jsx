import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinRoom() {
  const [name, setName] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (name.length === 0) {
      isValid = false;
      newErrors.name = "Name is mandatory";
    }

    if (roomCode.length === 0) {
      isValid = false;
      newErrors.roomCode = "Room Code is mandatory";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async() => {
    if (validate()) {
      localStorage.setItem("participant-name", name);
      navigate(`/room/${roomCode}`);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h2 className="mb-4 text-center">Join Room</h2>
          <div className="mb-3">
            <input type="text" id="name" name="name"
              className={errors.name ? 'form-control is-invalid' : 'form-control'}
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
            <div className="invalid-feedback">{errors.name}</div>
          </div>
          <div className="mb-3">
            <input type="text" id="roomCode" name="roomCode"
              className={errors.roomCode ? 'form-control is-invalid' : 'form-control'}
              value={roomCode} onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter room code"
            />
            <div className="invalid-feedback">{errors.roomCode}</div>
          </div>
          <div className="mb-3">
            <button type="button" onClick={()=>handleSubmit()}
              className="btn btn-primary w-100"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
