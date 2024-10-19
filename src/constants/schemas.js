export const homepage = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Novosadski noćni bazar',
  url: `${process.env.NEXT_PUBLIC_APP_URL}`,
  about: {
      '@type': 'MarketBussiness',
      name: 'Novosadski noćni bazar',
      description: 'Trg je oduvek mesto okupljanja, ovaj put okupljamo VAS – preduzetnike, umetnike i male proizvođače, a glavnu ulogu imaće vaši proizvodi i kupci.',
      areaServed: 'Serbia',
  }
}
