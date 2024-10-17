const GoogleAnalitics = () => {
  return (
    <>
      {process.env.NEXT_PUBLIC_APP_ENV === 'production' && (
        <>
          <script 
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_4}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              funcion gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_4}', {
                page_path: window.location.pathname,
              });
              `
            }}
          />
        </>
      )}
    </>
  )
}

export default GoogleAnalitics;
