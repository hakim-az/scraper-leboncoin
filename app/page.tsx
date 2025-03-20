"use client";
import { useState } from "react";
import axios from "axios";
import MessageModal from "./components/MessageModal/MessageModal";
import ProductCard from "./components/ProductCard/ProductCard";

export interface IAnnonce {
  title: string;
  price: string;
  link: string;
  image: string;
}

export default function Home() {
  const [annonces, setAnnonces] = useState<IAnnonce[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toggleMessageModal, setToggleMessageModal] = useState<boolean>(false);
  const [productTitle, setProductTitle] = useState<string>('')
  const [productId, setProductId] = useState<number>(0)

  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/scrape");
      setAnnonces(res.data.annonces);
    } catch (error) {
      console.error("Error fetching annonces:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-28">
      {/* message modal */}
      <MessageModal 
        toggleMessageModal={toggleMessageModal} 
        setToggleMessageModal={setToggleMessageModal} 
        productId={productId} 
        productTitle={productTitle} />
      {/* header */}
      <div className="w-11/12 mb-10 py-7 max-w-[1280px] mx-auto flex items-end justify-between">
        <h1 className="text-2xl font-bold">
          Scraper LeBonCoin - Skates électriques
        </h1>
        <button
          className="bg-blue-500 disabled:cursor-not-allowed disabled:opacity-35 text-white py-2 cursor-pointer hover:scale-110 transition-all ease-in-out delay-75 px-6 rounded-md"
          onClick={fetchAnnonces}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Chargement..." : "Récupérer les annonces"}
        </button>
      </div>

      {/* products list */}
      {loading ? (
        <div className="w-11/12 max-w-[1200px] mx-auto h-[400px] flex items-center justify-center ">
          <p className="mt-4 text-gray-500">Chargement des annonces...</p>
        </div>
      ) : (
        <div className="w-11/12 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8  ">
          {annonces.map((annonce, index) => {
            const isPriceDropped: boolean = annonce.price
              .toLowerCase()
              .includes("baisse de prix");

            const price: string = isPriceDropped 
              ? annonce.price.replace("Baisse de prix", "").trim()
              : annonce.price;

            return <ProductCard key={index} annonce={annonce} setToggleMessageModal={setToggleMessageModal} setProductTitle={setProductTitle} setProductId={setProductId} price={price} isPriceDropped={isPriceDropped} />
            
          })}
        </div>
      )}
    </section>
  );
}
