import { useEffect, useState } from "react";
import API from "./api/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/")
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "30px",
        fontWeight: "bold",
      }}
    >
      {message}
    </div>
  );
}

export default App;