const AccountData = ({
    account
}) => {
  return (
    <div
      className='w-full grid grid-rows-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pt-10 gap-8'
      style={{maxWidth: '1400px'}}
    >
      <div className='flex-1 w-full gap-3' style={{display: 'flex', flexDirection: 'column'}}>
        <span className='edit-profile-subtitle'>{`Podaci o vlasniku`}</span>
        <div className='edit-profile-container'>
          <span className='edit-profile-name'>{account.brandName || account.owner.fullName}</span>
          {account.type && <span className='edit-profile-data'>{account.type}</span>}
          <span className='edit-profile-data'>{account.owner.fullName}</span>
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
        <span className='edit-profile-subtitle'>{`Podaci o firmi`}</span>
        <div className='edit-profile-container'>
          <span className='edit-profile-name'>{account.company.name}</span>
          <span className='edit-profile-data'>{account.company.address}</span>
          {account.company.mb && account.company.mb !== '-' && (
            <span className='edit-profile-data'>MB: {account.company.mb}</span>
          )}
          {account.company.pib && account.company.pib !== '-' && (
            <span className='edit-profile-data'>PIB: {account.company.pib}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountData;
