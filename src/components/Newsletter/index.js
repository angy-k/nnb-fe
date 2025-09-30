'use client'
import Button from '../Button';
import {Input} from "@nextui-org/input";
import ShoppingBagIcon from "../../icons/shopping-bag-icon.svg"
import ViberCommunity from '../Communities/ViberCommunity';
import Image from 'next/image';
import { useState } from 'react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [isValidValue, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Validate email address format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    // Handle input change
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsValid(true); // Reset validation state on change
        setErrorMessage('');
        setSuccessMessage('');
    };
    
    // Handle form submission
    async function addToNewsletter() {
        // Reset previous messages
        setErrorMessage('');
        setSuccessMessage('');
        
        // Validate email
        if (!email || !validateEmail(email)) {
            setIsValid(false);
            setErrorMessage('Uneta e-mail adresa nije validna');
            return;
        }
        
        // Submit to API
        try {
            setIsSubmitting(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                setSuccessMessage('Uspešno ste se prijavili na newsletter!');
                setEmail(''); // Clear the input
            } else {
                setIsValid(false);
                setErrorMessage(data.message || 'Došlo je do greške prilikom prijave.');
            }
        } catch (error) {
            setIsValid(false);
            setErrorMessage('Došlo je do greške prilikom prijave. Pokušajte ponovo kasnije.');
            console.error('Newsletter subscription error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }
  return (
    <div className="w-full newsletter-wrapper">
        <div className='newsletter-container'>
            <Image
                src={ShoppingBagIcon}
                width={408.65}
                height={491.62}
                alt={'Newsletter section shopping bag icon.'}
                className='newsletter-bag-icon'
            />
            <div className='newsletter-subcontainer'>
                <h2 className='newsletter-title'>Newsletter</h2>
                <p className='newsletter-subtitle'>Prijavite se na naš newsletter!</p>
                
                <div className='newsletter-form'>
                    {successMessage ? (
                        <div className="newsletter-success">{successMessage}</div>
                    ) : (
                        <>
                            <div className='newsletter-input-group'>
                                <input
                                    type="email" 
                                    // variant="bordered" 
                                    placeholder="Vaš e-mail"
                                    value={email}
                                    onChange={handleEmailChange}
                                    isinvalid={(!isValidValue).toString()}
                                    errormessage={errorMessage || "Uneta e-mail adresa nije validna"}
                                    className='newsletter-email-field'
                                    disabled={isSubmitting}
                                />
                                <button
                                    key={`newsletter-button`}
                                    type={'filled'}
                                    onClick={addToNewsletter}
                                    className='newsletter-button'
                                    disabled={isSubmitting}
                                >{isSubmitting ? 'Slanje...' : 'Pošalji'}</button>
                            </div>
                            
                            <div className='newsletter-consent'>
                                <input type="checkbox" id="consent" className='newsletter-checkbox' />
                                <label htmlFor="consent" className='newsletter-consent-text'>
                                    Saglasan/Saglasna sam da se se prikupljeni lični podaci upotrebljavaju, 
                                    obrađuju i čuvaju u skladu s pravilima privatnosti, uz lični pristanak.
                                </label>
                            </div>
                        </>
                    )}
                </div>
                <ViberCommunity type={'light'} />
            </div>
            
        </div>
    </div>
  )
}

export default Newsletter