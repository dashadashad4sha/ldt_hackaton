import "./App.css";
import { Router } from "./sections";
import "react-toastify/dist/ReactToastify.css";
import 'swiper/css/bundle';
import { ToastContainer } from "react-toastify";
import { observer } from "mobx-react-lite";

const App = observer(() => {

  return (
    <>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </>
  );
});

export default App;
