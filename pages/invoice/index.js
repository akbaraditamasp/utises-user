import { checkCookies, getCookie } from "cookies-next";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";
import NumberFormat from "react-number-format";
import Container from "../../src/components/Container";
import Heading from "../../src/components/Heading";
import getCategories from "../../src/get-categories";
import service from "../../src/service";

const _getData = (token) =>
  new Promise((resolve) => {
    service
      .get("/invoice", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        resolve({});
      });
  });

export const getServerSideProps = async ({ req, res }) => {
  if (!checkCookies("token", { req, res }))
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login?success=" + encodeURIComponent("/invoice"),
      },
    };

  const categories = await getCategories();
  const data = await _getData(getCookie("token", { req, res }));

  return {
    props: {
      categories,
      data: data.data || [],
    },
  };
};

export default function Invoice({ data }) {
  return (
    <Fragment>
      <Head>
        <title>Invoice</title>
      </Head>
      <Heading>
        <h1 className="rounded-t-xl signika font-bold text-2xl text-primary-shade text-center">
          Invoice
        </h1>
      </Heading>
      <div className="flex justify-center">
        <Container className="py-12">
          {data?.length ? (
            data.map((item, index) => (
              <div
                className="bg-white relative rounded-sm p-5 pt-16 border-2 border-gray-300 hover:border-gray-500 mb-5 group"
                key={`${index}`}
              >
                <h2 className="font-bold text-lg">{item.detail?.name}</h2>
                <NumberFormat
                  value={item.detail?.price}
                  thousandSeparator={true}
                  prefix="Rp"
                  displayType="text"
                />
                <div className="absolute top-0 left-0 right-0 flex justify-between">
                  <div className="bg-gray-300 group-hover:bg-gray-500 text-gray-800 group-hover:text-white rounded-br-sm py-2 px-5 text-sm">
                    {moment(item.created_at).format("DD/MM/YYYY")}
                  </div>
                  <div
                    className={
                      "py-2 px-5 font-bold underline " +
                      (item.is_paid
                        ? "text-green-700"
                        : item.expired
                        ? "text-red-700"
                        : "text-blue-600")
                    }
                  >
                    {item.is_paid
                      ? "SELESAI"
                      : item.expired
                      ? "KADALUARSA"
                      : "PENDING"}
                  </div>
                </div>
                <Link href={"/invoice/" + item.inv_id}>
                  <a
                    title={`Detail Invoice ${item.inv_id}`}
                    className="absolute top-0 left-0 w-full h-full text-transparent"
                  >
                    Detail Invoice {item.inv_id}
                  </a>
                </Link>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-white rounded-sm">
              Belum ada invoice
            </div>
          )}
        </Container>
      </div>
    </Fragment>
  );
}
