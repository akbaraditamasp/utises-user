import Head from "next/head";
import { Fragment } from "react";
import Container from "../../src/components/Container";
import Heading from "../../src/components/Heading";
import ProductList from "../../src/components/ProductList";
import getCategories from "../../src/get-categories";
import service from "../../src/service";

const _getData = (slug) =>
  new Promise((resolve) => {
    service
      .get("/product", {
        params: {
          limit: 16,
          category_slug: slug,
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
  const data = await _getData(ctx.query.slug);

  if (data.error) return { props: { error: data.error } };

  return {
    props: {
      categories,
      data: data.data,
      category: data.category,
    },
  };
};

export default function Category({ data, category }) {
  return (
    <Fragment>
      <Head>
        <title>{category.name}</title>
      </Head>
      <Heading>
        <h1 className="rounded-t-xl signika font-bold text-2xl text-primary-shade">
          {category.name}
        </h1>
      </Heading>
      <div className="flex justify-center">
        <Container className="py-12">
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
        </Container>
      </div>
    </Fragment>
  );
}
