import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal"

import { Dog } from "@/types"

interface MatchDialogProps {
  dog: Dog,
  isOpen: boolean,
  onOpenChange: () => void
}

export const MatchDialog = ({dog, isOpen, onOpenChange}: MatchDialogProps) => {
    return (
        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
      >
        <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Match Found!</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center">
                    <img src={dog.img} alt={dog.name} className="w-48 h-48 object-cover rounded-md" />
                    <h6 className="mt-4">{dog.name}</h6>
                    <h3>{dog.breed} | {dog.age} years old</h3>
                    <h3>Zipcode: {dog.zip_code}</h3>
                </div>
              </ModalBody>
        </ModalContent>
      </Modal>
    )
}