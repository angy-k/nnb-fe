const AccountData = ({
    account
}) => {
  return (
    <div 
      className='w-full grid grid-rows-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pt-24 gap-24' 
      style={{maxWidth: '1400px'}}
    >
      <div className='flex-1 w-full pt-24 gap-4' style={{display: 'flex', flexDirection: 'column'}}>
        <span className='edit-profile-subtitle'>{`Podaci o vlasniku`}</span>
        <div
          className='edit-profile-container'
        >
          <span className='edit-profile-name'>{account.owner.fullName}</span>
          <span className='edit-profile-data'>{account.owner.email}</span>
          <span className='edit-profile-data'>{account.owner.phone}</span>
          <span className='edit-profile-data'>{account.owner.address}</span>
          <span className='edit-profile-data'>{account.owner.dateOfBirth}</span>
        </div>
      </div>
      <div className='flex-1 w-full pt-24 gap-4' style={{display: 'flex', flexDirection: 'column'}}>
        <span  className='edit-profile-subtitle'>{`Podaci o firmi`}</span>
        <div 
          className='edit-profile-container'
        >
          <span className='edit-profile-name'>{account.company.name}</span>
          <span className='edit-profile-data'>{account.company.address}</span>
          <span className='edit-profile-data'>{account.company.mb}</span>
          <span className='edit-profile-data'>{account.company.pib}</span>
        </div>
      </div>
    </div>
  )
}

export default AccountData;
