'use client';

const PageHiroSection = ({
  title,
  description,
  icons,
  illustration
}) => {
  return (
    <div 
      className="w-full grid place-items-center mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto bg-[#261A54] page-hero-section" style={description ? {height: '1040px'} : {height: '572px'}}
    >
      <div className="grid w-6/12 md:w-3/12 lg:w-6/12 2xl:x-2/12 mt-20 lg:mt-60" style={{display: 'flex', flexDirection: 'column', textAlign: 'start', alignItems: 'flex-start'}}>
        {title && <span className="page-hero-section-title"
        >
          {title}
        </span>
        }
        {icons && <div className="flex-row page-hero-section-icons">
          {/* {icons.map((item, index) => {
            icons as a buttons
          })} */}
        </div>}
        {description && <span className="page-hero-section-description mt-20 w-full md:w-6/12 lg:w-6/12 2xl:x-2/12">{description}</span>}
      </div>
      <img 
        className={description ? 'top-50 left-50 md:left-135 lg:left-380 hero-owl-image' : 'top-5 left-50 md:left-185 lg:left-380 hero-owl-image'}
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
