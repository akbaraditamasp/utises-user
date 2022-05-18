export default function Container({ className = "", children }) {
  return (
    <div
      className={
        "w-full md:w-640 lg:w-768 xl:w-1024 2xl:w-1280 px-5 lg:px-8 " +
        className
      }
    >
      {children}
    </div>
  );
}
