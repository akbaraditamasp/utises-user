import { checkCookies, getCookie } from "cookies-next";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
import Container from "../../src/components/Container";
import Heading from "../../src/components/Heading";
import Loader from "../../src/components/Loader";
import getCategories from "../../src/get-categories";
import service from "../../src/service";
import { SocketContext } from "../../src/socket";

function List({ title, children }) {
  return (
    <div className="mb-4 pb-4 flex flex-col border-b border-dashed border-gray-400">
      <span>{title}</span>
      <span className="text-lg font-bold">{children}</span>
    </div>
  );
}

const _getData = (inv, token) =>
  new Promise((resolve) => {
    service
      .get("/invoice/inv/" + inv, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        resolve({ error: e.response?.status });
      });
  });

export const getServerSideProps = async ({ query, req, res, resolvedUrl }) => {
  if (!checkCookies("token", { req, res }))
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login?success=" + encodeURIComponent(resolvedUrl),
      },
    };

  const categories = await getCategories();
  const data = await _getData(query.inv, getCookie("token", { req, res }));

  if (data.error) return { props: data };

  return {
    props: {
      categories,
      inv: query.inv,
      data,
    },
  };
};

export default function InvDetail({ inv, data }) {
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const socket = useContext(SocketContext);
  const [paid, setPaid] = useState(data.is_paid);

  const _proceedDownload = () => {
    setLoading(true);
    service
      .get("/product/download/" + data.detail?.product?.id, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        router.push(response.data.download_url);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (inv && socket.io) {
      socket.io.emit("join", inv);
      socket.io.on("paid", () => {
        setPaid(true);
      });
    }
  }, [socket.io]);

  return (
    <Fragment>
      <Head>
        <title>Detail Invoice {inv}</title>
      </Head>
      <Heading>
        <h1 className="rounded-t-xl signika font-bold text-2xl text-primary-shade text-center">
          Detail Invoice
        </h1>
      </Heading>
      <div className="flex justify-center">
        <Container className="py-12">
          <div className="bg-white border border-gray-400 p-5 rounded-sm">
            <List title="Inv ID">{inv}</List>
            <List title="Nama Produk">{data.detail.name}</List>
            <NumberFormat
              value={data.detail.price}
              thousandSeparator={true}
              prefix="Rp"
              displayType="text"
              renderText={(value) => <List title="Harga">{value}</List>}
            />
            <List title="Status">
              <span
                className={
                  paid
                    ? "text-green-700"
                    : data.expired
                    ? "text-red-700"
                    : "text-blue-600"
                }
              >
                {paid
                  ? "Pembayaran Berhasil"
                  : data.expired
                  ? "Kadaluarsa"
                  : "Menunggu Pembayaran"}
              </span>
            </List>
            <List title="Dibuat pada">
              {moment(data.created_at).format("DD/MM/YYYY HH:mm")}
            </List>
          </div>
          <div className="flex mt-5 justify-end">
            {data.detail?.product && (
              <Link href={`/${data.detail?.product?.slug}`}>
                <a
                  className="border border-primary-base text-primary-base py-3 px-8 text-center"
                  title="Lihat Halaman Produk"
                >
                  Lihat Halaman Produk
                </a>
              </Link>
            )}
            {!data.is_paid ? (
              <a
                target="_blank"
                href={data.payment_link}
                className="bg-primary-base text-white py-3 px-8 text-center ml-5"
                title="Lanjutkan Pembayaran"
              >
                Lanjutkan Pembayaran
              </a>
            ) : data.detail?.product?.id ? (
              <button
                onClick={() => _proceedDownload()}
                className="bg-primary-base text-white py-3 px-8 text-center ml-5"
                title="Download Konten"
              >
                Download Konten
              </button>
            ) : null}
          </div>
        </Container>
      </div>
      {loading && <Loader />}
    </Fragment>
  );
}
