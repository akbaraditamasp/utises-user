export default function BaseButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="rounded-sm h-12 px-12 flex justify-center items-center bg-primary-base text-white signika"
    >
      {children}
    </button>
  );
}
