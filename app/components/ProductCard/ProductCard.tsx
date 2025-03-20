import { IAnnonce } from "@/app/page";
import Image from "next/image";
import { FiArrowDownCircle } from "react-icons/fi";

interface PropsType {
    annonce: IAnnonce
    setToggleMessageModal: (toggleMessageModal: boolean) => void
    setProductTitle: (productTitle: string) => void
    setProductId: (productId: number) => void
    price: string
    isPriceDropped: boolean
}

export default function ProductCard({annonce, setToggleMessageModal,setProductTitle, setProductId, price, isPriceDropped}: PropsType) {
  return (
    <div
    className="w-full border border-gray-200 shadow rounded-md min-w-[250px] p-3"
    >
    {/* product image */}
    <Image
        src={annonce.image}
        alt={annonce.title}
        width={300}
        height={300}
        className="w-full aspect-[3/3.5] rounded object-cover border border-gray-400"
    />
    {/* product info */}
    <div className="flex flex-col gap-1 items-end mt-3">
        <h2 className="w-full font-semibold text-nowrap overflow-hidden truncate">
        {annonce.title}
        </h2>

        <div className="flex w-full gap-2 items-center justify-start">
        <p className="text-gray-700">{price}</p>
        {isPriceDropped && (
            <FiArrowDownCircle className="text-red-500" />
        )}
        </div>

        <a
        href={annonce.link}
        target="_blank"
        className="text-blue-600 w-full"
        >
        Voir l&apos;annonce
        </a>
        <button 
        onClick={() => {
            setToggleMessageModal(true)
            setProductTitle(annonce.title)
            // Extraction de l'ID depuis l'URL
            const match = annonce.link.match(/\/(\d+)$/);
            const id = match ? parseInt(match[1], 10) : 0;
            setProductId(id);              
        } } 
        className="bg-green-500 mt-4 text-xs text-white py-1.5 px-3 rounded cursor-pointer hover:scale-110 transition-all ease-in-out delay-75">
        Envoyer un message
        </button>
    </div>
    </div>
  )
}
