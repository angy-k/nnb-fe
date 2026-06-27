'use client'
import ShoppingBagIcon from "../../icons/shopping-bag-icon.svg"
import ViberCommunity from '../Communities/ViberCommunity';
import Image from 'next/image';
import { useState } from 'react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [consentChecked, setConsentChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage('');
        setSuccessMessage('');
    };

    async function addToNewsletter() {
        setErrorMessage('');
        setSuccessMessage('');

        if (!email || !validateEmail(email)) {
            setErrorMessage('Uneta e-mail adresa nije validna.');
            return;
        }

        if (!consentChecked) {
            setErrorMessage('Potrebna je saglasnost pre prijave na newsletter.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/newsletter/subscribe`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccessMessage('Uspešno ste se prijavili na newsletter!');
                setEmail('');
                setConsentChecked(false);
            } else if (response.status === 422) {
                const emailErrors = data.errors?.email;
                setErrorMessage(
                    emailErrors
                        ? 'Ova e-mail adresa je već prijavljena na newsletter.'
                        : (data.message || 'Došlo je do greške prilikom prijave.')
                );
            } else {
                setErrorMessage(data.message || 'Došlo je do greške prilikom prijave.');
            }
        } catch {
            setErrorMessage('Došlo je do greške. Pokušajte ponovo kasnije.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full newsletter-wrapper">
            <div className="newsletter-container">
                <Image
                    src={ShoppingBagIcon}
                    width={408.65}
                    height={491.62}
                    alt="Newsletter section shopping bag icon."
                    className="newsletter-bag-icon"
                />
                <div className="newsletter-subcontainer">
                    <h2 className="newsletter-title">Newsletter</h2>
                    <p className="newsletter-subtitle">Prijavite se na naš newsletter!</p>

                    <div className="newsletter-form">
                        {successMessage ? (
                            <div className="newsletter-success">{successMessage}</div>
                        ) : (
                            <>
                                <div className="newsletter-input-group">
                                    <input
                                        type="email"
                                        placeholder="Vaš e-mail"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="newsletter-email-field"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={addToNewsletter}
                                        className="newsletter-button"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Slanje...' : 'Pošalji'}
                                    </button>
                                </div>

                                {errorMessage && (
                                    <p className="newsletter-error">{errorMessage}</p>
                                )}

                                <div className="newsletter-consent">
                                    <input
                                        type="checkbox"
                                        id="consent"
                                        className="newsletter-checkbox"
                                        checked={consentChecked}
                                        onChange={(e) => setConsentChecked(e.target.checked)}
                                    />
                                    <label htmlFor="consent" className="newsletter-consent-text">
                                        Saglasan/Saglasna sam da se prikupljeni lični podaci upotrebljavaju,
                                        obrađuju i čuvaju u skladu s pravilima privatnosti, uz lični pristanak.
                                    </label>
                                </div>
                            </>
                        )}
                    </div>

                    <ViberCommunity type="light" />
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
