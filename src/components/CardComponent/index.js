'use client'
import SectionImage from "@/components/SectionImage"
import Button from "@/components/Button"
import DefaultImage from "./assets/card-component-default-image.png"

const CardComponent = ({
  key = 'single-card-component',
  imageSrc = DefaultImage,
  imageWidth = 438,
  imageHeight = 344,
  imageRadius = '30px',
  imageAltText = 'Card component image alt text',
  sectionType,
  author,
  position,
  title,
  subtitle,
  description,
  buttonText = 'Detaljnije',
  buttonIcon,
  buttonIconSize,
  buttonAction = null,
  creationDate
}) => {
  return (
    <div 
    className={"card-component" + (sectionType === 'partner' ? ' vertical-reverse' : '')} 
    key={key}
    style={sectionType === 'partner' ? {borderRadius: '30px', paddingTop: '20px', backgroundColor: '#ffffff', width: '467px', height: '467px', margin: 'auto',  alignItems: 'center', display: 'flex', gap: '60px'} : {}}
    >
      <SectionImage 
        imageSrc={imageSrc}
        width={imageWidth}
        height={imageHeight}
        radius={imageRadius}
        altText={imageAltText}
      />
        <>
          {author && <span className="card-component-author">{author}</span>}
          {position && <span className="card-component-author">{position}</span>}
        </>
        {title && <span className={author ? "card-component-title-blog mb-30" : "card-component-title"}>{title}</span>}
        {subtitle && <span style={sectionType === 'our-team' ? {color: '#1B1B1B', fontWeight: '400', fontSize: '17'} : {}}>{subtitle}</span>}
        {description && <span style={sectionType === 'our-team' ? {color: '#616161', fontWeight: '400', fontSize: '17'} : {}}>{description}</span>}
        {buttonAction && <Button
          key={`card-component-button-${sectionType}`}
          type={buttonIcon ? 'outlined-icon' : 'outlined-dark'}
          name={buttonIcon ?  null : buttonText}
          iconAlt="see-more-button"
          iconPath={buttonIcon}
          iconSize={buttonIconSize}
          onClick={buttonAction}
          className="card-component-button"
        />}
        {creationDate && <span className="card-component-creation-date" style={{alignSelf: 'flex-end'}}>{creationDate}</span>}
    </div>
  )
}

export default CardComponent;
