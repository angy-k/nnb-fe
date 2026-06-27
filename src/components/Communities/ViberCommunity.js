 'use client';
import ViberIconLight from "../../icons/viber-icon-light.svg"
import ViberIconDark from "../../icons/viber-icon-dark.svg"
import OwlsCommunity from "../../icons/owls-community.svg"
import Image from 'next/image'
import Button from "../Button"

const ViberCommunity = ({
  type = 'dark',
  title = 'Postani deo Viber zajednice',
  ctaLabel = 'Pristupi grupi',
  onCtaClick,
  showMiddleIcon = true,
  showCta = true,
  buttonType,
  buttonCustomStyle,
  wrapperClassName = '',
  wrapperStyle,
}) => {
  function joinCommunity() {
    const url = process.env.NEXT_PUBLIC_VIBER_INVITE_URL;
    if (url) window.open(url, '_blank');
  }

  const handleCtaClick = onCtaClick || (() => joinCommunity())

  return(
    <div
      className={`viber-community-container ${type === 'dark' ? "viber-community-dark" : "viber-community-light"} ${wrapperClassName}`}
      style={wrapperStyle}
    >
      <div className="viber-community-content">
        <Image
          src={OwlsCommunity}
          width={`240`}
          height={`80`}
          alt='Viber community owls icon'
          className="viber-community-owls"
        />
        <div className="viber-community-middle">
          {showMiddleIcon && (
            <Image
              src={type === 'dark' ? ViberIconDark : ViberIconLight}
              width={24}
              height={24}
              alt={'Viber community viber icon.'}
            />
          )}
          <span className="viber-community-text">{title}</span>
        </div>
        {showCta && (
          <Button
            keyValue={`viber-community-button`}
            type={buttonType || (type === 'dark' ? 'outlined-white' : 'outlined-purple')}
            name={ctaLabel}
            onClick={handleCtaClick}
            customStyle={buttonCustomStyle || "viber-button"}
          />
        )}
      </div>
    </div>
  )
}

export default ViberCommunity;
