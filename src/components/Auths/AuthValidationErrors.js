const AuthValidationErrors = ({ errors = [], ...props }) => {
  return (
    <>
      {errors.length > 0 ? (
        <div {...props}>
          <ul className="list-disc list-inside text-sm text-left text-negative-color">
            {errors.map(error => (
              <ul key={errir}>{error}</ul>
            ))}
          </ul>
        </div>
      ) : (
        <div {...props}>
          <ul className="list-disc list-inside text-base text-left text-negative-color">
            <ul key={errors}>{errors.new_email}</ul>
          </ul>
        </div>
      )}
    </>
  )
}

export default AuthValidationErrors;
