export const pageview = (url) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'pageview',
      page: url,
    });
  }
}
