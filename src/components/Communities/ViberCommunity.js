import ViberIconLight from "../../icons/viber-icon-light.svg"
import ViberIconDark from "../../icons/viber-icon-dark.svg"
import OwlsCommunity from "../../icons/owls-community.svg"
import office from "../../../office-config/config.json"
import Image from 'next/image'
import Button from "../Button"

const ViberCommunity = ({
  type = 'dark'
}) => {
  function joinCommunity() {
    //TODO: join viber community
    window.open('https://invite.viber.com/?g2=AQBR%2B5ef5lKUX1MxICpe2OAUY8lYMdQcNtmvse9JE0D1fZBOi8mWfzr3nMxcOCSU', '_blank');
  }
  return(
    <div className={`viber-community-container ${type === 'dark' ? "viber-community-dark" : "viber-community-light"}`}>
      <div className="viber-community-content">
        <Image
          src={OwlsCommunity}
          width={`240`}
          height={`80`}
          alt='Viber community owls icon'
          className="viber-community-owls"
        />
        <div className="viber-community-middle">
          <Image
            src={type === 'dark' ? ViberIconDark : ViberIconLight}
            width={24}
            height={24}
            alt={'Viber community viber icon.'}
          />
          <span className="viber-community-text">Postani deo Viber zajednice</span>
        </div>
        <Button
          key={`viber-community-button`}
          type={type === 'dark' ? 'outlined-white' : 'outlined-purple'}
          name={'Pristupi grupi'}
          onClick={() => joinCommunity()}
          customStyle="viber-button"
        />
      </div>
    </div>
  )
}

export default ViberCommunity;
