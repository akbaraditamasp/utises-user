import { getCookie, removeCookies } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { BiCollection, BiLogOut, BiMenu, BiReceipt } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../src/assets/svg/Logo.js";
import { logout } from "../redux/slices/auth.js";
import service from "../service.js";
import Loader from "./Loader.js";

export default function Header({ categories = [] }) {
  const [loading, setLoading] = useState(false);
  const [menuShow, setMenuShow] = useState(false);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();

  const _logout = () => {
    setLoading(true);
    service
      .delete("/user/remove-token", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(() => {
        setLoading(false);
        removeCookies("token");
        removeCookies("id");

        dispatch(logout());

        router.replace(
          "/auth/login?success=" + encodeURIComponent(router.asPath)
        );
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-white flex items-center justify-center fixed top-0 left-0 right-0 z-20">
      <div className="w-full md:w-640 lg:w-768 xl:w-1024 2xl:w-1280 h-12 lg:h-16 px-5 lg:px-8 flex items-center">
        <div className="flex items-center h-full">
          <Link href="/">
            <a
              className="mr-3 hover:bg-primary-shade w-12 lg:w-16 h-full bg-primary-base flex justify-center items-center"
              title="Utises"
            >
              <Logo className="h-6 w-auto text-white" />
            </a>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setMenuShow(true)}
          className="ml-auto flex lg:hidden w-8 h-8 border justify-center items-center"
        >
          <BiMenu />
        </button>
        <div
          className={`items-center h-full flex-1 block lg:flex bg-white fixed lg:static top-0 left-0 w-full lg:w-auto min-h-screen lg:min-h-0 transform ${
            menuShow ? "translate-x-0" : "translate-x-full"
          } transition duration-300 lg:translate-x-0`}
        >
          <div className="text-lg signika font-bold p-5 flex justify-between items-center text-gray-800 lg:hidden">
            MENU
            <button
              type="button"
              onClick={() => setMenuShow(false)}
              className="ml-auto flex lg:hidden w-8 h-8 justify-center items-center text-red-400"
            >
              <FaTimes />
            </button>
          </div>
          <ul className="h-auto lg:h-full flex flex-col lg:flex-row">
            {categories.map((item, index) => (
              <li key={`${index}`}>
                <Link href={`/category/${item.slug}`}>
                  <a
                    className="text-gray-600 h-auto lg:h-full flex items-center teko font-medium text-xl px-5 lg:px-3 hover:bg-gray-200 hover:text-gray-700 py-2 lg:py-0 border-t lg:border-t-0"
                    onClick={() => setMenuShow(false)}
                  >
                    {item.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          {!auth.token ? (
            <Fragment>
              <div className="lg:ml-auto flex p-5 lg:p-0 border-t lg:border-t-0">
                <Link href="/auth/login">
                  <a
                    className="mr-3 px-3 py-2 border border-primary-base text-primary-base rounded-sm signika flex-1 text-center"
                    onClick={() => setMenuShow(false)}
                    title="Masuk"
                  >
                    Masuk
                  </a>
                </Link>
                <Link href="/auth/register">
                  <a
                    className="px-3 py-2 bg-primary-base text-white rounded-sm signika border border-primary-shade flex-1 text-center"
                    onClick={() => setMenuShow(false)}
                    title="Daftar"
                  >
                    Daftar
                  </a>
                </Link>
              </div>
            </Fragment>
          ) : (
            <div className="lg:ml-auto flex flex-col lg:flex-row p-5 lg:p-0 border-t lg:border-t-0">
              <div className="flex border-r-0 lg:border-r mr-0 pr-0 lg:mr-3 lg:pr-3">
                <Link href="/collection" title="Koleksi">
                  <a
                    className="px-3 py-2 bg-primary-base lg:bg-transparent text-white rounded-sm signika flex-1 flex justify-center items-center lg:text-primary-base hover:bg-primary-base hover:text-white mr-5 lg:mr-0"
                    onClick={() => setMenuShow(false)}
                  >
                    <BiCollection size={20} className="mr-2 lg:mr-0" />
                    <span className="block lg:hidden">Koleksi</span>
                  </a>
                </Link>
                <Link href="/invoice" title="Invoice">
                  <a
                    className="px-3 py-2 bg-primary-base lg:bg-transparent text-white rounded-sm signika flex-1 flex justify-center items-center lg:text-primary-base hover:bg-primary-base hover:text-white"
                    onClick={() => setMenuShow(false)}
                  >
                    <BiReceipt size={20} className="mr-2 lg:mr-0" />
                    <span className="block lg:hidden">Invoice</span>
                  </a>
                </Link>
              </div>
              <button
                className="px-3 py-2 text-white lg:text-red-400 bg-red-500 hover:bg-red-500 lg:hover:text-white lg:bg-transparent rounded-sm signika flex-1 flex justify-center items-center mt-5 lg:mt-0"
                onClick={() => {
                  setMenuShow(false);
                  _logout();
                }}
                title="Keluar"
              >
                <BiLogOut className="mr-2" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
      {loading && <Loader />}
    </div>
  );
}
