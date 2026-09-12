'use client'
import SectionImage from "@/components/SectionImage"
import Button from "@/components/Button"
import DefaultImage from "@/../public/card-component-default-image.png"

const CardComponent = ({
  keyValue = 'single-card-component',
  imageSrc = DefaultImage,
  imageWidth = 438,
  imageHeight = 344,
  // Kvadratni vizual — koristi se na karticama događaja (format 1080×1080)
  imageSquare = false,
  // Prigušen vizual — prošli događaji, da se na prvi pogled razlikuju od aktuelnih
  imageGrey = false,
  imageRadius = '30px',
  imageAltText = 'Card component image alt text',
  sectionType,
  author,
  position,
  title,
  subtitle,
  description,
  // Kad kartici treba opis koji je više od običnog teksta — na primer skraćen
  // na tri reda sa dugmetom „Pročitaj više" u sekciji tima — prosleđuje se
  // gotov element umesto niske. Ostale kartice i dalje šalju običan `description`.
  descriptionSlot = null,
  buttonText = 'Detaljnije',
  /* U dizajnu natpis na dugmetu nije svuda isti: „Detaljnije" na karticama
     događaja je 18/25 u dugmetu od 129, a „Pročitaj više" na Blogu, Projektima
     i početnoj 15/20 u dugmetu od 139. Do sada su oba bila 18 u dugmetu od 172. */
  buttonSmallText = false,
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
        square={imageSquare}
        isGrey={imageGrey}
        radius={imageRadius}
        altText={imageAltText}
      />
      <>
        {author && <span className="card-component-author">{author}</span>}
        {position && <span className="card-component-author">{position}</span>}
      </>
      {/* Ime člana tima je u dizajnu pisano (MADE GoodTime Script 36px), dok su
          naslovi događaja i objava obični. Zato poseban dodatak na klasu, a ne
          izmena same `.card-component-title`. */}
      {/* Naslov je u unutrašnjem `span`-u zato što odsecanje na dva reda traži
          `display: -webkit-box`, a spoljni je stavka fleks kolone, pa mu
          pregledač tu vrednost pretvara u `flow-root` i odsecanje otpada —
          treći red se onda video kroz donji odmak. */}
      {title && <span className={
        author
          ? "card-component-title-blog mb-30"
          : "card-component-title" + (sectionType === 'our-team' ? " card-component-title--tim" : "")
      }><span className="card-component-title-tekst">{title}</span></span>}
      {/* `fontSize: '17'` bez jedinice CSS odbacuje, pa ove dve mere dosad nisu
          ni važile — otuda 17px i 23px iz dizajna sada izričito. */}
      {subtitle && <span style={sectionType === 'our-team' ? {color: '#1B1B1B', fontWeight: '400', fontSize: '17px', lineHeight: '23px'} : {}}>{subtitle}</span>}
      {descriptionSlot
        ? descriptionSlot
        : description && <span style={sectionType === 'our-team' ? {color: '#616161', fontWeight: '400', fontSize: '17px', lineHeight: '23px'} : {}}>{description}</span>}
      {buttonAction && <Button
        key={`card-component-button-${sectionType}`}
        type={buttonIcon ? 'outlined-icon' : 'outlined-dark'}
        name={buttonIcon ?  null : buttonText}
        iconAlt="see-more-button"
        iconPath={buttonIcon}
        iconSize={buttonIconSize}
        onClick={buttonAction}
        className={`card-component-button${buttonSmallText ? ' card-component-button--sitan' : ''}`}
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
      className="immpression-card-inner"
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
        className="immpression-card-text"
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
