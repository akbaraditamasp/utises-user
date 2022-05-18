import Image from "next/image";
import Link from "next/link";
import NumberFormat from "react-number-format";

export default function ProductList({ title, image, price, slug }) {
  return (
    <div className="bg-white rounded relative border-2 border-gray-300 hover:border-gray-500">
      <div className="w-16-9 bg-gray-300 rounded-t border-b-2">
        {image && <Image src={image} alt={title} layout="fill" />}
      </div>
      <div className="p-5">
        <div className="font-bold line-clamp-2">{title}</div>
        <div className="text-primary-base signika">
          <NumberFormat
            value={price}
            displayType="text"
            thousandSeparator={true}
            prefix="Rp"
          />
        </div>
      </div>
      <Link href={"/" + slug}>
        <a
          className="absolute top-0 left-0 w-full h-full text-transparent"
          title={title}
        >
          {title}
        </a>
      </Link>
    </div>
  );
}
