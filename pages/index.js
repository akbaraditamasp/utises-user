import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import Cloud from "../src/assets/svg/Cloud.js";
import MainIllustration from "../src/assets/svg/MainIllustration.js";
import Container from "../src/components/Container.js";
import ProductList from "../src/components/ProductList.js";
import getCategories from "../src/get-categories.js";
import service from "../src/service.js";

const _getData = () =>
  new Promise((resolve) => {
    service
      .get("/product", {
        params: {
          limit: 8,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        resolve({});
      });
  });

export const getServerSideProps = async () => {
  const { data: latestProduct = [] } = await _getData();

  return {
    props: {
      latestProduct,
      categories: await getCategories(),
    },
  };
};

export default function Home({ latestProduct = [] }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  return (
    <Fragment>
      <Head>
        <title>Utises</title>
        <meta property="og:title" content="Utises" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL} />
        <meta
          property="og:image"
          content={process.env.NEXT_PUBLIC_APP_URL + "logo.png"}
        />
      </Head>
      <div className="h-screen bg-primary-tint flex justify-center relative overflow-hidden -mt-12 lg:-mt-16">
        <Cloud className="absolute top-auto lg:top-0 bottom-0 lg:bottom-auto left-0 w-auto lg:w-full text-primary-background" />
        <Container className="p-5 lg:px-8 flex flex-col lg:flex-row justify-center items-center z-10">
          <div className="flex-0 lg:flex-1 lg:order-2 flex justify-center mb-10 lg:mb-0">
            <MainIllustration className="w-1/2 lg:w-full h-auto text-primary-shade" />
          </div>
          <div className="w-full lg:w-3/5 lg:order-1 text-center lg:text-left">
            <div className="lalezar font-bold text-2xl lg:text-4xl text-gray-800">
              Bangun Aplikasimu Sekarang!
            </div>
            <div className="varela mt-2 text-lg">
              Kami menyediakan puluhan source code yang bisa membantu dalam
              pembuatan aplikasi impianmu.
            </div>
            <div className="mt-10 flex justify-center lg:justify-start">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push("/search?q=" + encodeURIComponent(q));
                }}
                className="bg-gray-100 flex rounded w-5/6 lg:w-4/6 p-1"
              >
                <input
                  type="text"
                  className="w-32 p-2 flex-1 rounded mr-2 bg-white"
                  placeholder="Cari source code..."
                  onChange={(e) => setQ(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-primary-base text-white signika font-medium h-10 px-5 rounded"
                >
                  CARI
                </button>
              </form>
            </div>
          </div>
        </Container>
      </div>
      <div className="flex justify-center">
        <Container className="py-12 lg:py-24 px-5 lg:px-8">
          <h3 className="subtitle">Pilihan Kami</h3>

          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {latestProduct.map((item, index) => (
              <ProductList
                key={`${index}`}
                title={item.name}
                price={item.price}
                image={item.images[0]?.url}
                slug={item.slug}
              />
            ))}
          </div>
          <h3 className="subtitle mt-16">Baru Ditambahkan</h3>

          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {latestProduct.map((item, index) => (
              <ProductList
                key={`${index}`}
                title={item.name}
                price={item.price}
                image={item.images[0]?.url}
                slug={item.slug}
              />
            ))}
          </div>
        </Container>
      </div>
    </Fragment>
  );
}
