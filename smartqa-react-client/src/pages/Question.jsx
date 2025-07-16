import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function Question({ roomCode }) {
  const [question, setQuestion] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (question.length === 0) {
      isValid = false;
      newErrors.question = "Question is mandatory";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const participantName = 
                localStorage.getItem("participant-name");
        const response = await axios.post(
          `${serverEndpoint}/room/${roomCode}/question`,
          {
            content: question,
            createdBy: participantName ? participantName : "Anonymous",
          },
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setQuestion("");
      } catch (error) {
        console.log(error);
        setErrors({
          message: "Error posting question, please try again",
        });
      }
    }
  };

  return (
    <div className="row py-3">
      <div className="col-md-5">
        <h5 className="mb-2">Question</h5>
        <div className="mb-2">
          <textarea
            id="question"
            name="question"
            className={
              errors.question ? 
                "form-control is-invalid" 
                : "form-control"
              }
            rows="3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter Question"
          />
          <div className="invalid-feedback">{errors.question}</div>
        </div>
        <div className="mb-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary w-100"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Question;
