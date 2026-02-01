import { ErrorMessage, useField } from 'formik'
import { useEffect } from 'react';
import AuthValidationErrors from '../Auths/AuthValidationErrors';
import InputTextArea from './InputTextArea';

const MainTextAreaInput = ({
  label,
  error,
  isValid = true,
  setErrors,
  labelStyle = '',
  ...props
}) => {
  const [field] = useField(props)

  useEffect(() => {
    isValid ? error : setErrors('')
  }, [isValid])

  return (
    <>
      {label && (
        <label className={`${labelStyle} text-[#A4A4A4]`} htmlFor={field.name}>{label}</label>
      )}
      <InputTextArea {...props} {...field} />
      {/* Validation Errors */}
      <ErrorMessage 
        component="div"
        className="mb-1 mt-1 text-sm text-left text-negative-color"
        name={field.name}
      />
      {error && <AuthValidationErrors className="mb-1" errors={error} />}
    </>
  )
}

export default MainTextAreaInput
