import { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, onClose, duration = 3000, type = "success" }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }, [onClose, duration]);
  
    return (
      <div className={`toast ${type}`}>
        {message}
      </div>
    );
  };
  
export default Toast;
