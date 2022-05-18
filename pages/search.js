import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import Container from "../src/components/Container";
import Heading from "../src/components/Heading";
import ProductList from "../src/components/ProductList";
import getCategories from "../src/get-categories";
import service from "../src/service";

const _getData = (q) =>
  new Promise((resolve) => {
    service
      .get("/product", {
        params: {
          limit: 16,
          search: q,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        resolve({ error: e.response?.status });
      });
  });

export const getServerSideProps = async (ctx) => {
  const categories = await getCategories();
  const data = await _getData(ctx.query.q);

  if (data.error) return { props: { error: data.error } };

  return {
    props: {
      categories,
      q: ctx.query.q,
      data: data.data || [],
    },
  };
};

export default function Search({ q = "", data }) {
  const [query, setQuery] = useState(q);
  const router = useRouter();

  return (
    <Fragment>
      <Head>
        <title>Hasil Pencarian "{q}"</title>
      </Head>
      <Heading>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/search?q=" + encodeURIComponent(query));
          }}
          className="bg-gray-100 flex rounded w-full p-1"
        >
          <input
            type="text"
            className="w-32 p-2 flex-1 rounded mr-2 bg-white"
            placeholder="Cari source code..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <button
            type="submit"
            className="bg-primary-base text-white signika font-medium h-10 px-5 rounded"
          >
            CARI
          </button>
        </form>
      </Heading>
      <div className="flex justify-center">
        <Container className="py-12">
          <h1 className="subtitle">Hasil Pencarian</h1>

          {data.length ? (
            <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {data.map((item, index) => (
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
            <div className="py-5 text-center">
              Tidak ditemukan produk dengan keyword "{q}"
            </div>
          )}
        </Container>
      </div>
    </Fragment>
  );
}
