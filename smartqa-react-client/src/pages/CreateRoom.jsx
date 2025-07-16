import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";
import axios from 'axios';

function CreateRoom() {
  const [name, setName] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (name.length === 0) {
      isValid = false;
      newErrors.name = "Name is mandatory";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validate()) {
        setLoading(true);
      try {
        const response = await axios.post(`${serverEndpoint}/room`,{
            createdBy: name,
          },{
            withCredentials: true,
          });
        navigate(`/room/${response.data.roomCode}`);
      } catch (error) {
        console.log(error);
        setErrors({ message: "Error creating room, please try again" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
            <h2 className="mb-4 text-center">Create Room</h2>
            <div className="mb-3">
                <input type="text" name="name" id="name"
                    className={errors.name ? 'form-control is-invalid' : 'form-control'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full Name"
                />
                <div className="invalid-feedback">{errors.name}</div>
            </div>

            <div className="mb-3">
                <button type="button"
                    onClick={handleSubmit}
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    Submit
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
