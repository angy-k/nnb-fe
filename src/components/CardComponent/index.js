'use client'
import SectionImage from "@/components/SectionImage"
import Button from "@/components/Button"
import DefaultImage from "@/../public/card-component-default-image.png"

const CardComponent = ({
  keyValue = 'single-card-component',
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
  cardAction = null,
  creationDate,
  isDark = false
}) => {
  return (
    <>
    {sectionType === 'impression' && <ImpressionCard
      keyValue={keyValue} 
      description={description}
      author={author}
      position={position}
      buttonIcon={buttonIcon}
      buttonAction={buttonAction}
      buttonIconSize={buttonIconSize}
      cardAction={cardAction}
      isDark={isDark}
    />}
    {sectionType !== 'impression' && <div 
    className={"card-component" + (sectionType === 'partner' ? ' vertical-reverse' : '')} 
    key={keyValue}
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
    </div>}
    </>
  )
}

export default CardComponent;

const ImpressionCard = ({
  keyValue,
  description,
  author,
  position,
  buttonIcon,
  buttonAction,
  buttonIconSize,
  cardAction,
  isDark
}) => {
  return (
    <div
      key={keyValue}
      onClick={cardAction || undefined}
      style={{
        backgroundColor: `${isDark ? '#56C4CF' : '#ffffff'}`,
        color: '#1b1b1b',
        width: '821px',
        height: '493px',
        borderRadius: '30px',
        padding: '50px 95px',
        display: 'flex',
        flexDirection: 'column',
        gap: '50px',
        cursor: cardAction ? 'pointer' : 'default'
      }}
    >
      {description && <p
        style={{
          fontFamily: 'Open Sans',
          fontWeight: '400',
          fontSize: '36px',
          color: '#1b1b1b',
          whiteSpace: 'pre-line'
        }}
      >{description}</p>}
      <div
         style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        {author && <span 
          // className="card-component-author"
          style={{
            fontFamily: 'Open Sans',
            fontWeight: '700',
            size: '18px',
            color: '#1b1b1b',
          }}
        >{author}</span>}
        {position && <span 
          style={{
            fontFamily: 'Open Sans',
            fontWeight: '400',
            size: '18px',
            color: '#1b1b1b'
          }}
        // className="card-component-author"
        >{position}</span>}
      </div>
      {buttonAction && <Button
        key={`card-component-button-immpression`}
        type={buttonIcon ? 'outlined-icon' : 'outlined-dark'}
        name={buttonIcon ?  null : buttonText}
        iconAlt="see-more-button"
        iconPath={buttonIcon}
        iconSize={buttonIconSize}
        onClick={buttonAction}
        className="card-component-button"
      />}
      </div>
    </div>
  )
}
