'use client'
import React, { useState } from "react"
import CardComponent from "../CardComponent";
import PlusIcon from "../../icons/plus-icon.svg"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from "@nextui-org/react";


const Impressions = ({
    immpressions = mockImpressions
}) => {
    const [isPaused, setPause] = useState(false);
    const [selectedImpression, setSelectedImpression] = useState(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    
    // Handler function to open modal with full impression content
    const previewFullImmpression = (impression) => {
        console.log('Opening impression modal with data:', impression);
        // Pause the scroll animation
        setPause(true);
        // Set the selected impression with explicit properties
        setSelectedImpression(impression);
        // Open the modal
        onOpen();
    };
    
    // Function to close modal and resume scrolling
    const handleCloseModal = () => {
        setPause(false);
        setSelectedImpression(null);
    };
    
    return (
        <div className="immpressions-container">
            <div className={`immpressions-scroll-content ${isPaused ? 'paused' : ''}`}>
            {immpressions.map((immpression, index) => (
                <CardComponent 
                    key={`impression-card-${immpression.id}`}
                    isDark={!!(index%2)}
                    sectionType={`impression`}
                    author={immpression.author}
                    description={immpression.content}
                    position={immpression.position}
                    buttonIcon={PlusIcon}
                    buttonIconSize={58}
                    buttonAction={() => previewFullImmpression(immpression)} // Pass the impression to the handler
                    className="immpression-card"
                />
            ))}
            </div>
            
            {/* Modal for displaying full impression content */}
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={(open) => {
                    onOpenChange(open);
                    if (!open) handleCloseModal();
                }}
                size="full"
                classNames={{
                    base: "impression-modal",
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                    body: "py-6",
                    closeButton: "text-white bg-black/20 backdrop-blur-md",
                    modalWrapper: "w-full h-full max-w-full",
                    wrapper: "max-w-full w-full h-full",
                    header: "border-b-0",
                    footer: "border-t-0"
                }}
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            transition: {
                                duration: 0.3,
                                ease: "easeOut"
                            }
                        },
                        exit: {
                            opacity: 0,
                            transition: {
                                duration: 0.2,
                                ease: "easeIn"
                            }
                        }
                    }
                }}
            >
                <ModalContent style={{
                    backgroundColor: '#FFFFFF',
                    color: '#1b1b1b',
                    borderRadius: '30px',
                    maxWidth: '1200px',
                    maxHeight: '80vh',
                    margin: 'auto',
                    padding: '40px',
                    overflowY: 'auto'
                }}>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex justify-between items-center">
                                <div></div> {/* Empty div for flex spacing */}
                                <Button color="primary" variant="light" onPress={onClose} className="rounded-full">
                                    Close
                                </Button>
                            </ModalHeader>
                            <ModalBody className="py-10">
                                <div className="flex flex-col gap-10">
                                {selectedImpression && (
                                    <p
                                         style={{
                                             fontFamily: 'Open Sans',
                                             fontWeight: '400',
                                             fontSize: '36px',
                                             lineHeight: '1.4',
                                             color: '#1b1b1b',
                                             whiteSpace: 'pre-line'
                                         }}
                                    >
                                        {selectedImpression.content}
                                    </p>
                                )}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        marginTop: '20px'
                                    }}
                                >
                                    {selectedImpression && (
                                        <span 
                                            style={{
                                                fontFamily: 'Open Sans',
                                                fontWeight: '700',
                                                fontSize: '22px',
                                                color: '#1b1b1b',
                                            }}
                                        >
                                            {selectedImpression.author}
                                        </span>
                                    )}
                                    {selectedImpression && (
                                        <span 
                                            style={{
                                                fontFamily: 'Open Sans',
                                                fontWeight: '400',
                                                fontSize: '18px',
                                                color: '#1b1b1b'
                                            }}
                                        >
                                            {selectedImpression.position}
                                        </span>
                                    )}
                                </div>
                            </div>
                            </ModalBody>
                            <ModalFooter className="justify-center">
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

const mockImpressions = [
    {
        id: 1,
        content: `Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
            Nullam venenatis varius posuere. In vehicula sapien eu nunc volutpat vehicula.`,
        author: `Petar Petrović`,
        position: `Generalni direktor`,
    },
    {
        id: 2,
        content: `Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
            Nullam venenatis varius posuere. In vehicula sapien eu nunc volutpat vehicula.`,
        author: `Petar Petrović`,
        position: `Generalni direktor`,
    },
    {
        id: 3,
        content: `Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
            Nullam venenatis varius posuere. In vehicula sapien eu nunc volutpat vehicula.`,
        author: `Petar Petrović`,
        position: `Generalni direktor`,
    },
    {
        id: 4,
        content: `Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
            Nullam venenatis varius posuere. In vehicula sapien eu nunc volutpat vehicula.`,
        author: `Petar Petrović`,
        position: `Generalni direktor`,
    },
    {
        id: 5,
        content: `Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
            Nullam venenatis varius posuere. In vehicula sapien eu nunc volutpat vehicula.`,
        author: `Petar Petrović`,
        position: `Generalni direktor`,
    },
]

export default Impressions;