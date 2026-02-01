const AuthValidationErrors = ({ errors = [], ...props }) => {
  const normalizedErrors = (() => {
    if (!errors) return []
    if (Array.isArray(errors)) return errors.filter(Boolean)
    if (typeof errors === 'string') return [errors]

    if (typeof errors === 'object') {
      return Object.values(errors)
        .flat()
        .filter(Boolean)
    }

    return []
  })()

  return (
    <>
      {normalizedErrors.length > 0 ? (
        <div {...props}>
          <ul className="list-disc list-inside text-sm text-left text-negative-color">
            {normalizedErrors.map((error, idx) => (
              <li key={`${idx}-${String(error)}`}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}

export default AuthValidationErrors;
