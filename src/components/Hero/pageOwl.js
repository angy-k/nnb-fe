'use client';

const PageHiroSection = ({
  title,
  description,
  icons,
  illustration
}) => {
  return (
    <div 
      className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto bg-[#261A54] page-hero-section" style={{height: '572px'}}
    >
        <div className="grid md:w-3/12 lg:w-6/12 2xl:x-2/12 mt-20 lg:mt-60">
          {title && <span className="page-hero-section-title" style={{fontFamily: 'MADE GoodTime Script', fontWeight: 400, fontSize: 128, lineHeight: '118.01px', color: '#ffffff'}}
          >
            {title}
          </span>
          }
          {icons && <div className="flex-row page-hero-section-icons">
            {/* {icons.map((item, index) => {
              icons as a buttons
            })} */}
          </div>}
          {description && <p className="page-hero-section-description">{description}</p>}
        </div>
        <img 
          className='top-125 left-50 md:left-185 lg:left-380 hero-owl-image '
          maxwidth={'660px'}
          maxheight={'914px'}
          src='/hero-owl.svg'
          alt="hero-owl"
          style={{position: 'relative', bottom: '0', overflow: 'hidden'}}
        />
    </div>
  )
}

export default PageHiroSection