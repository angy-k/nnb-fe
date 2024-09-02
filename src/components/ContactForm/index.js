import { Divider } from "@nextui-org/divider";
import Image from 'next/image';
import Button from "../Button";
import {Input} from "@nextui-org/input";
import DefaultImage from "./assets/default-contact-form-image.png"
import ContactFormLogo from "../Logo/ContactFormLogo";

const ContactForm = ({
    title,
}) => {
    function sendMessage() {
        //TODO: send mail message
    }
    //TODO: validacija input polja
    return (
        <>
            {title && <span className="contact-section-title">{title}</span>}
            {title && <Divider  className="section-divider"/>}
            <div className="contact-from">
                {withImage ? <Image
                        src={DefaultImage}
                        width={260}
                        height={81.8}
                        alt={'Contact form default image.'}
                    /> : <ContactFormLogo />}
                <div>
                    <div>
                        <Input
                            type="firstName" 
                            variant="underlined" 
                            label="Ime" 
                            isInvalid={true}
                            errorMessage="Uneto ime nije validno"
                        />
                        <Input 
                            type="lastName" 
                            variant="underlined" 
                            label="Prezime" 
                            isInvalid={true}
                            errorMessage="Uneto prezime nije validno"
                        />
                        <Input 
                            type="email" 
                            variant="underlined" 
                            label="E-mail"
                            isInvalid={true}
                            errorMessage="Uneta e-mail adresa nije validna"
                        />
                        <Input 
                            type="phoneNumber" 
                            variant="underlined" 
                            label="Telefon" 
                            isInvalid={true}
                            errorMessage="Unet broj telefona nije validan"
                        />
                        <Input 
                            type="address" 
                            variant="underlined" 
                            label="Adresa" 
                            isInvalid={true}
                            errorMessage="Uneta adresa nije velidna"
                        />
                        <Input 
                            type="title" 
                            variant="underlined" 
                            label="Naslov" 
                            />

                    </div>
                    <Input 
                        type="message" 
                        variant="underlined" 
                        label="Poruka" 
                        isInvalid={true}
                        errorMessage="Uneta poruka nije validna"
                    />
                    <Button
                        key={`contact-form-button`}
                        type={'outlined-dark'}
                        name={'Pošalji poruku'}
                        onClick={sendMessage}
                    />
                </div>
            </div>
        </>
    )
}

export default ContactForm;