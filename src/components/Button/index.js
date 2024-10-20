import Image from 'next/image'

const Button = ({
  keyValue,
  type,
  color,
  iconPath,
  iconSize,
  iconAlt = 'Button icon alt text',
  name,
  description,
  disabled,
  onClick,
  customStyle
}) => {
  const setStyle = (buttonType) => {
    switch (buttonType) {
      case 'dark':
        return 'button-dark';
      case 'light':
        return 'button-light';
      case 'outlined-light': 
        return 'button-outlined-light';
      case 'outlined-dark': 
        return 'button-outlined-dark';
      case 'icon':
        return 'button-icon';
      case 'title-description': 
        return 'title-description-button';
      case 'outlined-white':
        return 'button-outlined-white';
      case 'outlined-icon':
        return 'outlined-icon-button';
      default:
        return customStyle;

    }
  }
  return (
    <button
      key={keyValue}
      className={setStyle(type) + (color ? (+ ' ' + setStyle(type) + '__' + color) : '')}
      disabled={disabled}
      onClick={onClick}
    >
      {iconPath && <Image
        src={iconPath}
        width={iconSize}
        height={iconSize}
        alt={iconAlt}
        style={{marginLeft: '14px'}}
      />}
      {name && <span className={(name && description) ? "title" : "text"}>{name}</span>}
      {description && <span className="description">{description}</span>}
    </button>
  )
}

export default Button
