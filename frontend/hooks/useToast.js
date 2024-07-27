import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useToast = () => {
  const notify = (status, message = "Deleted Success!", duration = 5000, closeClick = true) => {
    if (status === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: duration,
        hideProgressBar: false,
        closeOnClick: closeClick,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        pauseOnFocusLoss: false,
      });
    } else if (status === "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: duration,
        hideProgressBar: false,
        closeOnClick: closeClick,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        pauseOnFocusLoss: false,
      });
    }
  };

  return {
    notify,
  };
};

export default useToast;
