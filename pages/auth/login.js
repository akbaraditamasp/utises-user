import Link from "next/link";
import { useForm } from "react-hook-form";
import Auth from "../../src/assets/svg/Auth";
import BaseButton from "../../src/components/input/BaseButton";
import TextField from "../../src/components/input/TextField";
import { Fragment, useState } from "react";
import service from "../../src/service";
import Loader from "../../src/components/Loader";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login } from "../../src/redux/slices/auth";
import { checkCookies, setCookies } from "cookies-next";
import Alert from "../../src/components/Alert";
import moment from "moment";

export const getServerSideProps = async ({ req, res, query }) => {
  if (checkCookies("token", { req, res })) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {
      withoutLayout: true,
      success: query.success || "/",
    },
  };
};

export default function Login({ success }) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const _proceed = ({ email, password }) => {
    setLoading(true);
    service
      .get("/user/get-token", {
        params: {
          email,
          password,
        },
      })
      .then((response) => {
        setLoading(false);
        setFailed(false);
        setCookies("token", response.data.token, {
          expires: moment().add(1, "year").toDate(),
        });
        setCookies("id", response.data.id, {
          expires: moment().add(1, "year").toDate(),
        });
        dispatch(login({ token: response.data.token, id: response.data.id }));
        router.replace(success || "/");
      })
      .catch(() => {
        setLoading(false);
        setFailed(true);
      });
  };
  return (
    <Fragment>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-screen bg-white flex">
        <div className="bg-primary-tint flex-1 justify-center items-center hidden lg:flex">
          <Auth className="text-primary-base w-1/2 h-auto" />
        </div>
        <div className="w-full lg:w-2/5 p-10 lg:p-8 lg:px-16 flex justify-center flex-col">
          <h2 className="text-gray-800 font-bold text-3xl">Login</h2>
          <div className="text-gray-800">
            Masuk ke akun anda untuk melanjutkan
          </div>
          <form className="mt-10" onSubmit={handleSubmit(_proceed)}>
            {failed && (
              <Alert className="bg-red-400 text-white text-center mb-3">
                Autentikasi gagal, username atau password mungkin salah
              </Alert>
            )}
            <TextField
              placeholder="Email"
              className="mb-3"
              type="text"
              {...register("email", { required: true })}
            />
            <TextField
              placeholder="Password"
              className="mb-5"
              type="password"
              {...register("password", { required: true })}
            />
            <BaseButton type="submit">Masuk</BaseButton>
          </form>
          <div className="border-t mt-10 pt-5 text-center">
            Belum punya akun?{" "}
            <Link
              href={"/auth/register?success=" + encodeURIComponent(success)}
            >
              Buat Akun
            </Link>
          </div>
        </div>
      </div>
      {loading && <Loader />}
    </Fragment>
  );
}
