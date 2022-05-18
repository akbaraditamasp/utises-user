import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Fragment, useState } from "react";
import Auth from "../../src/assets/svg/Auth";
import BaseButton from "../../src/components/input/BaseButton";
import TextField from "../../src/components/input/TextField";
import Loader from "../../src/components/Loader";
import service from "../../src/service";
import { checkCookies, setCookies } from "cookies-next";
import { useDispatch } from "react-redux";
import { login } from "../../src/redux/slices/auth";
import { useRouter } from "next/router";
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
      success: query.success || "",
    },
  };
};

export default function Register({ success }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const _proceed = ({ email, fullname, password }) => {
    setLoading(true);
    service
      .post("/user", {
        fullname,
        email,
        password,
      })
      .then((response) => {
        setLoading(false);
        setCookies("token", response.data.token, {
          expires: moment().add(1, "year").toDate(),
        });
        setCookies("id", response.data.id, {
          expires: moment().add(1, "year").toDate(),
        });
        dispatch(login({ token: response.data.token, id: response.data.id }));
        router.replace(success || "/");
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };
  return (
    <Fragment>
      <Head>
        <title>Buat Akun</title>
      </Head>
      <div className="min-h-screen bg-white flex">
        <div className="bg-primary-tint flex-1 hidden lg:flex justify-center items-center">
          <Auth className="text-primary-base w-1/2 h-auto" />
        </div>
        <div className="w-full lg:w-2/5 p-10 lg:p-8 lg:px-16 flex justify-center flex-col">
          <h2 className="text-gray-800 font-bold text-3xl">Buat Akun</h2>
          <div className="text-gray-800">Buat akun baru untuk memulai</div>
          <form className="mt-10" onSubmit={handleSubmit(_proceed)}>
            <TextField
              label="Nama Lengkap"
              className="mb-3"
              type="text"
              message={errors.fullname?.message}
              {...register("fullname", {
                required: "Tidak boleh kosong",
              })}
            />
            <TextField
              label="Email"
              className="mb-3"
              message={errors.email?.message}
              type="text"
              {...register("email", {
                required: "Tidak boleh kosong",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Email tidak valid",
                },
              })}
            />
            <TextField
              label="Password"
              className="mb-5"
              type="password"
              message={errors.password?.message}
              {...register("password", {
                required: "Tidak boleh kosong",
              })}
            />
            <BaseButton type="submit">Mendaftar</BaseButton>
          </form>
          <div className="border-t mt-10 pt-5 text-center">
            Sudah punya akun?{" "}
            <Link href={"/auth/login?success=" + encodeURIComponent(success)}>
              Masuk
            </Link>
          </div>
        </div>
      </div>
      {loading && <Loader />}
    </Fragment>
  );
}
