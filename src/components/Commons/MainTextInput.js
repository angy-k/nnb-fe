import { ErrorMessage, useField } from 'formik';
import { useEffect } from 'react';
import AuthValidationErrors from '../Auths/AuthValidationErrors';
import Input from './Input';

const MainTextInput = ({
  isValid = true,
  setErrors,
  label,
  type,
  error,
  ...props
}) => {
  const [field] = useField(props)
  useEffect(() => {
    isValid ? error : setErrors('')
  }, [isValid])
  return (
    <>
      {label && <label htmlFor={field.name} className='text-[#A4A4A4]'>{label}</label>}
      <Input type={type} {...field} {...props} value={field.value || ''} />
      <ErrorMessage
        component="div"
        className="mb-1 text-sm text-left text-negative-color white-space-pre-line"
        name={field.name}
      />
      {error && isValid && (
        <AuthValidationErrors className="mb-1" errors={error} />
      )}
    </>
  )
}

export default MainTextInput;
