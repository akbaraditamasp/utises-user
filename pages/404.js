export const getStaticProps = async (ctx) => {
  return {
    props: {
      error: 404,
    },
  };
};

export default function Custom404() {
  return null;
}
