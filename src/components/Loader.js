import Logo from "../../src/assets/svg/Logo.js";

export default function Loader() {
  return (
    <div className="fixed top-0 left-0 h-screen w-full bg-black opacity-50 flex justify-center items-center z-50">
      <div className="w-24 h-24 rounded bg-white flex justify-center items-center relative overflow-hidden">
        <div className="h-full w-full bg-primary-base absolute top-0 left-0 loading" />
        <Logo className="w-16 h-16 text-black absolute" />
      </div>
    </div>
  );
}
