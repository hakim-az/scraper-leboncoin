import React, { Fragment } from 'react'
import { Dialog, Transition, TransitionChild } from '@headlessui/react'

type PropsType = {
  children: React.ReactNode
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
}

function CustomModal({ children, openModal, setOpenModal }: PropsType) {
  return (
    <Transition show={openModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-40 inset-0 overflow-y-auto bg-gray-500/60"
        onClose={setOpenModal}>
        <div className="flex items-center justify-center min-h-screen pt-4 pb-20 text-center sm:block sm:p-0">
          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div className="w-[90%] md:w-[80%] lg:w-[65%] h-5/6  relative inline-block align-middle bg-white rounded-lg p-6 text-left  shadow-xl transform transition-all">
              {children}
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CustomModal
