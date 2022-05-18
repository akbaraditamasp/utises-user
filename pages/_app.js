import "../styles/globals.css";
import { Provider, useDispatch } from "react-redux";
import store from "../src/redux/store";
import { useEffect } from "react";
import { checkCookies, getCookie } from "cookies-next";
import { login } from "../src/redux/slices/auth";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Error from "next/error";

function Wrap({ children }) {
  const dispatch = useDispatch();

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

  return children;
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
