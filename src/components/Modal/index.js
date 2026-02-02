import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from "@nextui-org/react";


const ModalComponent = ({
  title= 'Modal title',
  // modalIsOpen = false
}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        wrapper: 'nnb-modal-wrapper items-center justify-center',
        backdrop: 'nnb-modal-backdrop',
        base: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {title && <ModalHeader classNames="flex flex-col gap-1">{title}</ModalHeader>}
            <ModalBody>
              <p >{`ovde sam`}</p>
            </ModalBody>
            <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={onClose}>
              Action
            </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalComponent;
