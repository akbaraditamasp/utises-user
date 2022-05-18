import { checkCookies, getCookie } from "cookies-next";
import Error from "next/error";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Footer from "../src/components/Footer";
import Header from "../src/components/Header";
import { login } from "../src/redux/slices/auth";
import store from "../src/redux/store";
import { SocketContext } from "../src/socket";
import "../styles/globals.css";

function Wrap({ children }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (checkCookies("token")) {
      dispatch(
        login({
          token: getCookie("token"),
          id: getCookie("id"),
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      const socket = io(process.env.REACT_APP_BASE_URL, {
        auth: {
          token,
        },
      });

      setSocket(socket);
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ io: socket }}>
      {children}
    </SocketContext.Provider>
  );
}

function MyApp({ Component, pageProps }) {
  if (pageProps.error) {
    return <Error statusCode={pageProps.error} />;
  }
  return (
    <Provider store={store}>
      <Wrap>
        {pageProps.withoutLayout ? (
          <Component {...pageProps} />
        ) : (
          <div className="bg-gray-100 min-h-screen pt-12 lg:pt-16 flex flex-col">
            <Header categories={pageProps.categories || []} />
            <div className="flex-1">
              <Component {...pageProps} />
            </div>
            <Footer />
          </div>
        )}
      </Wrap>
    </Provider>
  );
}

export default MyApp;
