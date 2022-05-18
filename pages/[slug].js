import { getCookie } from "cookies-next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { FaDonate, FaDownload } from "react-icons/fa";
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
import Container from "../src/components/Container";
import Loader from "../src/components/Loader";
import getCategories from "../src/get-categories";
import service from "../src/service";

const _getData = (slug, token = null) =>
  new Promise((resolve) => {
    const options = !token
      ? {}
      : {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    service
      .get("/product/slug/" + slug, options)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        resolve({ error: e.response?.status });
      });
  });

export const getServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const data = await _getData(ctx.query.slug, getCookie("token", { req, res }));

  if (data.error) return { props: { error: data.error } };

  return {
    props: {
      categories: await getCategories(),
      data,
      slug: ctx.query.slug,
    },
  };
};

export default function DetailProduct({ data = {}, slug }) {
  const [imageFocus, setImageFocus] = useState(0);
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  const router = useRouter();

  const _proceedPurchase = () => {
    if (!auth.token) {
      router.push("/auth/login?success=" + encodeURIComponent(router.asPath));
      return;
    }

    setLoading(true);
    service
      .post(
        "/invoice/" + data.id,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        router.push("/invoice/" + response.data.inv_id);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const _proceedDownload = () => {
    setLoading(true);
    service
      .get("/product/download/" + data.id, {
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

  return (
    <Fragment>
      <Head>
        <title>{data.name}</title>
        <meta property="og:title" content={data.name} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={process.env.NEXT_PUBLIC_APP_URL + slug}
        />
        {data.images[0]?.url && (
          <meta property="og:image" content={data.images[0]?.url} />
        )}
      </Head>
      <div className="flex justify-center">
        <Container className="w-full md:w-640 lg:w-768 xl:w-1024 2xl:w-1280 flex flex-col lg:flex-row p-5 lg:p-8 my-3 lg:my-6">
          <div className="w-full lg:w-2/5 order-2 lg:order-1">
            <h3 className="font-bold text-gray-800 mb-3 block lg:hidden">
              Gambar
            </h3>
            <div className="w-16-9 bg-gray-300 rounded-sm overflow-hidden">
              {data.images[imageFocus]?.url && (
                <Image
                  src={data.images[imageFocus]?.url}
                  alt={`${data.name}`}
                  layout="fill"
                />
              )}
            </div>
            <div className="grid grid-flow-row grid-cols-4 gap-5 mt-5">
              {data.images?.map((item, index) => (
                <div
                  className={`w-16-9 bg-gray-300 rounded-sm overflow-hidden border-2 ${
                    imageFocus === index
                      ? "border-primary-base"
                      : "border-transparent"
                  }`}
                  key={`${index}`}
                >
                  <Image
                    layout="fill"
                    src={item.url}
                    alt={`${data.name} ${index}`}
                  />
                  <button
                    type="submit"
                    className="absolute top-0 left-0 w-full h-full"
                    onClick={() => setImageFocus(index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 ml-0 lg:ml-8 mb-8 lg:mb-0 order-1 lg:order-2">
            <h1 className="text-2xl font-bold text-gray-800">{data.name}</h1>
            <NumberFormat
              displayType="text"
              prefix="Rp"
              thousandSeparator={true}
              value={data.price}
              renderText={(value) => (
                <span className="text-xl font-bold text-primary-shade">
                  {value}
                </span>
              )}
            />
            <div className="mt-8 mb-8 pb-8 border-b border-gray-300">
              <button
                type="button"
                onClick={
                  data.is_collection
                    ? () => _proceedDownload()
                    : () => _proceedPurchase()
                }
                className="inline-flex justify-center items-center py-3 px-10 bg-primary-base hover:bg-primary-shade rounded-sm text-white signika"
              >
                {data.is_collection ? (
                  <Fragment>
                    <FaDownload className="mr-2" />
                    Download Konten
                  </Fragment>
                ) : (
                  <Fragment>
                    <FaDonate className="mr-2" />
                    Beli Sekarang
                  </Fragment>
                )}
              </button>
            </div>
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-3">Deskripsi</h3>
              <p className="text-justify">{data.description}</p>
            </div>
            {data.categories.length ? (
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Kategori</h3>
                <div className="flex flex-wrap">
                  {data.categories.map((item, index) => (
                    <Link key={`${index}`} href={`/category/${item.slug}`}>
                      <a className="mr-3 py-2 px-5 bg-white border border-primary-shade mb-3 rounded-sm">
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </div>
      {loading && <Loader />}
    </Fragment>
  );
}
