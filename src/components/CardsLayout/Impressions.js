'use client'
import React, { useEffect, useState } from "react"
import CardComponent from "../CardComponent";
import PlusIcon from "../../icons/plus-icon.svg"
import reviewService from "@/services/reviewService";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure
} from "@nextui-org/react";


const Impressions = ({
    immpressions: propImpressions
}) => {
    const [isPaused, setPause] = useState(false);
    const [selectedImpression, setSelectedImpression] = useState(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [immpressions, setImmpressions] = useState(Array.isArray(propImpressions) ? propImpressions : []);
    const [loading, setLoading] = useState(!Array.isArray(propImpressions));
    const [error, setError] = useState(null);
    
    // Handler function to open modal with full impression content
    const previewFullImmpression = (impression) => {
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

    useEffect(() => {
        if (Array.isArray(propImpressions)) {
            setImmpressions(propImpressions);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await reviewService.getReviews();
                if (!response.ok) {
                    setImmpressions([]);
                    setError('Greška prilikom učitavanja recenzija.');
                    return;
                }

                const data = await response.json().catch(() => null);
                if (!data?.success) {
                    setImmpressions([]);
                    setError(data?.message || 'Greška prilikom učitavanja recenzija.');
                    return;
                }

                const items = Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data?.data?.data)
                        ? data.data.data
                        : [];

                setImmpressions(items);
            } catch (e) {
                setImmpressions([]);
                setError('Greška prilikom učitavanja recenzija.');
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, [propImpressions]);
    
    return (
        <div className="immpressions-container">
            {loading && <div className="w-full grid place-items-center py-12">Učitavanje...</div>}
            {!loading && error && <div className="w-full grid place-items-center py-12 text-[#EC4923]">{error}</div>}
            {!loading && !error && (
                <div className={`immpressions-scroll-content ${isPaused ? 'paused' : ''}`}>
                {[...immpressions, ...immpressions].map((immpression, index) => (
                    <CardComponent
                        key={`impression-card-${index}`}
                        isDark={!!(index%2)}
                        sectionType={`impression`}
                        author={immpression.author}
                        description={immpression.content}
                        position={immpression.position}
                        buttonIcon={PlusIcon}
                        buttonIconSize={58}
                        cardAction={() => previewFullImmpression(immpression)}
                        buttonAction={(e) => {
                            e?.stopPropagation?.();
                            previewFullImmpression(immpression);
                        }}
                        className="immpression-card"
                    />
                ))}
                </div>
            )}
            
            {/* Modal for displaying full impression content */}
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={(open) => {
                    onOpenChange(open);
                    if (!open) handleCloseModal();
                }}
                size="full"
                classNames={{
                    base: "impression-modal",
                    backdrop: "nnb-modal-backdrop",
                    body: "py-6",
                    closeButton: "top-6 right-6 text-[#261A54] bg-transparent hover:bg-black/5 w-12 h-12 text-3xl",
                    modalWrapper: "w-full h-full max-w-full",
                    wrapper: "nnb-modal-wrapper max-w-full w-full h-full",
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
                            <ModalHeader className="p-0 h-0 min-h-0" />
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
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}
export default Impressions;