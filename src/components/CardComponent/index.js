import SectionImage from "../SectionImage"
import Button from "../Button"
import DefaultImage from "./assets/card-component-default-image.png"

const CardComponent = ({
    key,
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
    onClick,
    creationDate
}) => {
    return (
        <div className={"card-component" + (sectionType === 'partner' ? ' vertical-reverse' : '')} key={key}>
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
            {title && <span className={author ? "card-component-title-blog" : "card-component-title"}>{title}</span>}
            {subtitle && <span>{subtitle}</span>}
            {description && <span>{description}</span>}
            <Button
                key={`card-component-button-${sectionType}`}
                type={'outlined-dark'}
                name={buttonIcon ?  null : buttonText}
                iconAlt={buttonIcon}
                iconSize={buttonIconSize}
                onClick={onClick}
            />
            {creationDate && <span>{creationDate}</span>}
        </div>
    )
}

export default CardComponent;