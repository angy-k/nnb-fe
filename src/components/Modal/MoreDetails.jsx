import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import Image from 'next/image';

const MoreDetailsModal = ({
    isDefaultOpen = false,
    modalTitle,
    modalBody,
    modalImage,
    imageWidth = 211,
    imageHeight = 138,
    onClickActionButton,
    actionButtonText = '',
    defaultLayout = 'column'
}) => {

  const handleOpen = () => {
    onOpen();
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button  
          key={b}
          variant="flat" 
          color="warning" 
          onPress={() => handleOpen()}
          className="capitalize"
        >
          {'prikazi modal'}
        </Button>
      </div>
      <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose} defaultOpen={isDefaultOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              {modalTitle && <ModalHeader className="flex flex-col gap-1">{modalTitle}</ModalHeader>}
              <ModalBody>
                <div style={{display: 'flex', flexDirection: defaultLayout}}>
                {modalImage && <Image
                    src={modalImage}
                    width={imageWidth}
                    height={imageHeight}
                    alt={'Modal image alt text.'}
                />}
                {modalBody && <p>{modalBody}</p>}
                </div>
              </ModalBody>
              <ModalFooter>
               {onClickActionButton && <Button color="primary" onPress={() => {onClickActionButton, onClose}}>
                  {actionButtonText}
                </Button>}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MoreDetailsModal;
