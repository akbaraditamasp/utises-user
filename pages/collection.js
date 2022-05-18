import { checkCookies, getCookie } from "cookies-next";
import Head from "next/head";
import { Fragment } from "react";
import Container from "../src/components/Container";
import Heading from "../src/components/Heading";
import ProductList from "../src/components/ProductList";
import getCategories from "../src/get-categories";
import service from "../src/service";

const _getData = (token) =>
  new Promise((resolve) => {
    service
      .get("/product", {
        params: {
          collection: true,
          limit: 16,
        },
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

export const getServerSideProps = async ({ req, res }) => {
  const categories = await getCategories();
  if (!checkCookies("token", { req, res }))
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login?success=/collection",
      },
    };
  const data = await _getData(getCookie("token", { req, res }));
  if (data.error) return { props: data };

  return {
    props: {
      categories,
      data: data.data || [],
    },
  };
};

export default function Collection({ data }) {
  return (
    <Fragment>
      <Head>
        <title>Koleksi</title>
      </Head>
      <Heading>
        <h1 className="rounded-t-xl signika font-bold text-2xl text-primary-shade text-center">
          Koleksi
        </h1>
      </Heading>
      <div className="flex justify-center">
        <Container className="py-12">
          {data.length ? (
            <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {data?.map((item, index) => (
                <ProductList
                  key={`${index}`}
                  title={item.name}
                  price={item.price}
                  image={item.images[0]?.url}
                  slug={item.slug}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-sm">
              Belum ada koleksi
            </div>
          )}
        </Container>
      </div>
    </Fragment>
  );
}
