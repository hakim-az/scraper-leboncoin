"use client";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import CustomModal from "./components/CustomModal/CustomModal";
import { FiArrowDownCircle } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";

interface IAnnonce {
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

  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

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

  const postMessage = async () => {
    if (!message.trim()) return alert("Veuillez entrer un message.");
  
    setSending(true);
    try {
      const res = await axios.post(
        `https://api.leboncoin.fr/api/frontend/v1/classified/${productId}/reply`,
        { message },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(res);
      
      
      alert("Message envoyé avec succès !");
      setToggleMessageModal(false);
      setMessage(''); // Réinitialiser le champ après envoi
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      alert("Échec de l'envoi du message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="pb-28">
      {/* message modal */}
      <CustomModal setOpenModal={setToggleMessageModal} openModal={toggleMessageModal}>
        <div className="flex flex-col w-full items-end">
          <IoCloseSharp 
            onClick={() => setToggleMessageModal(false)} 
            size={30} 
            className="cursor-pointer transition-all ease-in-out delay-75 hover:fill-red-500" 
          />
          <span className="inline-block w-full text-gray-700 font-semibold mb-3 text-lg">{productTitle}</span>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..." 
            className="w-full h-[200px] resize-none rounded-md p-5 border border-gray-300 "
          />
          <button 
            onClick={postMessage} 
            disabled={sending} 
            className="bg-blue-500 mt-8 text-sm text-white py-1.5 px-3 rounded cursor-pointer hover:scale-110 transition-all ease-in-out delay-75 disabled:opacity-50"
          >
            {sending ? "Envoi en cours..." : "Soumettre le message"}
          </button>
        </div>
      </CustomModal>
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
        <div className="w-11/12 max-w-[1280px] mx-auto gap-y-7 items-stretch flex justify-between flex-wrap ">
          {annonces.map((annonce, index) => {
            const isPriceDropped = annonce.price
              .toLowerCase()
              .includes("baisse de prix");
            const price = isPriceDropped
              ? annonce.price.replace("Baisse de prix", "").trim()
              : annonce.price;

            return (
              <div
                key={index}
                className="w-full border border-gray-200 shadow rounded-md max-w-[300px] p-3"
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
            );
          })}
        </div>
      )}
    </section>
  );
}
