const AccountData = ({
    account
}) => {
  return (
    <div
      className='w-full grid grid-rows-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pt-10 gap-16'
      style={{maxWidth: '1400px'}}
    >
      <div className='flex-1 w-full gap-3' style={{display: 'flex', flexDirection: 'column'}}>
        <span className='edit-profile-subtitle'>{`Podaci o vlasniku`}</span>
        {/* Naziv izlagača i delatnost stoje u zaglavlju iznad, pa se u kartici
            ne ponavljaju — u dizajnu kartica počinje imenom vlasnika. Ranije je
            prvi red bio `brandName || fullName`, pa je izlagaču bez unetog
            naziva pisalo doslovno „-" (tako ga postavlja `Profile/index.js`
            kad naziva nema). */}
        <div className='edit-profile-container flex-1'>
          <span className='edit-profile-name'>{account.owner.fullName}</span>
          <span className='edit-profile-data'>{account.owner.email}</span>
          <span className='edit-profile-data'>{account.owner.phone}</span>
          <span className='edit-profile-data'>{account.owner.address}</span>
          <span className='edit-profile-data'>{account.owner.dateOfBirth}</span>
          {account.owner.facebook && (
            <a href={account.owner.facebook} target="_blank" rel="noopener noreferrer" className='edit-profile-data' style={{ textDecoration: 'underline', wordBreak: 'break-all' }}>
              {account.owner.facebook}
            </a>
          )}
          {account.owner.instagram && (
            <a href={account.owner.instagram} target="_blank" rel="noopener noreferrer" className='edit-profile-data' style={{ textDecoration: 'underline', wordBreak: 'break-all' }}>
              {account.owner.instagram}
            </a>
          )}
        </div>
      </div>
      <div className='flex-1 w-full gap-3' style={{display: 'flex', flexDirection: 'column'}}>
        <span className='edit-profile-subtitle'>
          {account.company.entityType === 'agricultural'
            ? 'Podaci o poljoprivrednom gazdinstvu'
            : 'Podaci o pravnom licu'}
        </span>
        {/* `flex-1` na obe kartice poravnava im donje ivice, kao u dizajnu, iako
            leva ima više redova od desne. */}
        <div className='edit-profile-container flex-1'>
          <span className='edit-profile-name'>{account.company.name}</span>
          <span className='edit-profile-data'>{account.company.address}</span>
          {account.company.entityType === 'agricultural' ? (
            account.company.farmNumber && (
              <span className='edit-profile-data'>Broj gazdinstva: {account.company.farmNumber}</span>
            )
          ) : (
            <>
              {account.company.mb && (
                <span className='edit-profile-data'>MB: {account.company.mb}</span>
              )}
              {account.company.pib && (
                <span className='edit-profile-data'>PIB: {account.company.pib}</span>
              )}
              {account.company.isSefUser && (
                <span className='edit-profile-data' style={{ color: '#56C4CF', fontWeight: 600 }}>
                  Korisnik SEF-a
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountData;
