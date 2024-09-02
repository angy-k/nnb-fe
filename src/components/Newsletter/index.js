
import Button from '../Button';
import {Input} from "@nextui-org/input";
import ShoppingBagIcon from "../../icons/shopping-bag-icon.svg"
import ViberCommunity from '../Communities/ViberCommunity';
import Image from 'next/image';
 
const Newsletter = () => {
    function addToNewsletter() {
        //TODO: add email address to the newsletter
    }
  return (
    <div className="newsletter-wrapper">
        <div className='newsletter-container'>
        <Image
            src={ShoppingBagIcon}
            width={408.65}
            height={491.62}
            alt={'Newsletter section shopping bag icon.'}
        />
        <div className='newsletter-subcontainer'>
            <div className='newsletter-div'>
                <Input 
                    type="email" 
                    variant="faded" 
                    label="E-mail" 
                    isInvalid={true}
                    errorMessage="Uneta e-mail adresa nije validna"
                    className='newsletter-email-field'
                />
                <Button
                    key={`newsletter-button`}
                    type={'outlined-light'}
                    name={'Pošalji'}
                    onClick={addToNewsletter}
                    className='newsletter-button'
                />
            </div>
            <ViberCommunity type={'light'} />
        </div>
        </div>
    </div>
  )
}

export default Newsletter