'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoCloseSharp } from 'react-icons/io5';
import CustomModal from '../CustomModal/CustomModal';
import axios from 'axios';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FormData = {
    message: string;
};

interface PropsType {
    toggleMessageModal: boolean;
    setToggleMessageModal: (toggleMessageModal: boolean) => void;
    productTitle: string;
    productId: number;
}

export default function MessageModal({ setToggleMessageModal, toggleMessageModal, productTitle, productId }: PropsType) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const [sending, setSending] = useState<boolean>(false);
   

    const onSubmit = async (data: FormData) => {
        setSending(true);
        try {
            const bearerToken = "your-bearer-token";
    
            const res = await axios.post(
                "/api/message", 
                { 
                    productId, 
                    message: data.message,
                    bearerToken
                },
                { headers: { "Content-Type": "application/json" } }
            );
    
            console.log(res);
            toast.success("Message envoyé avec succès !");
            setToggleMessageModal(false);
            reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Erreur lors de l'envoi du message :", error);
                toast.error(error.response?.data?.error || "Échec de l'envoi du message.");
            } else {
                console.error("Une erreur inattendue est survenue :", error);
                toast.error("Une erreur inattendue s'est produite.");
            }
        } finally {
            setSending(false);
        }
    };
    
    

    return (
   <>
     <ToastContainer position="top-right" autoClose={3000} />
     <CustomModal setOpenModal={setToggleMessageModal} openModal={toggleMessageModal}>
            <div className="flex flex-col w-full items-end">
                <IoCloseSharp 
                    onClick={() => setToggleMessageModal(false)} 
                    size={30} 
                    className="cursor-pointer transition-all ease-in-out delay-75 hover:fill-red-500" 
                />
                <span className="inline-block w-full text-gray-700 font-semibold mb-3 text-lg">{productTitle}</span>
                <form className="w-full flex flex-col items-end" onSubmit={handleSubmit(onSubmit)}>
                    <textarea 
                        {...register('message', { required: 'Le message est requis' })}
                        placeholder="Message..." 
                        className={`w-full h-[200px] outline-none resize-none rounded-md p-5 border ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.message && <span className="text-red-500 inline-block w-full mt-2">{errors.message.message}</span>}
                    <button 
                        type="submit"
                        disabled={sending} 
                        className="bg-blue-500 mt-8 text-sm text-white py-1.5 px-3 rounded cursor-pointer hover:scale-110 transition-all ease-in-out delay-75 disabled:opacity-50"
                    >
                        {sending ? "Envoi en cours..." : "Soumettre le message"}
                    </button>
                </form>
            </div>
        </CustomModal>
   </>
    );
}
