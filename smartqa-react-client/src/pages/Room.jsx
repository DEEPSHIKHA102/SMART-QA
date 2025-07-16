import { useParams } from "react-router-dom";
import Question from "./Question";

function Room() {
  const { code } = useParams();

  return (
    <div className="container py-5">
      <h2>Room {code}</h2>
      <Question roomCode={code} />
    </div>
  );
}

export default Room;
