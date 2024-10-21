import Image from 'next/image'
import { useState } from 'react'
import EyeIcon from '@/icons/event-icon.svg';
import EyeUnseen from '@/icons/eye-unseen.svg';

const Input = ({
  img = null,
  visiblePassword = null,
  type,
  disabled = false,
  className,
  ...props
}) => {
  const password = type === 'password'
  const email = type === 'email'
  const { name } = props
  const [inputType, setInputType] = useState(type)
  const [visible, setVisible] = useState(visiblePassword)

  return (
    <div className='relative'>
      {email && img && (
        <div className='absolute pt-5 pl-2.5'>
          <Image src={img} alt="email" className='w-4 login-grey' width="0" height="0" />
        </div>
      )}
      {password && img && (
        <div className='absolute pt-5 pl-2.5 items-center'>
          <Image src={img} alt="password" className='w-4' width="0" height="0" />
        </div>
      )}
      {!email && !password && name != 'address' && (
        <div className='absolute pt-4 pl-2.5'>
          {img && <Image src={img} alt="input" className='w-4' width="0" height="0" />}
        </div>
      )}
      {name === 'address' && (
        <div className='absolute pt-5 pl-2.5'>
          {img && <Image src={img} alt="input" className='w-4' width="0" height="0" />}
        </div>
      )}
      <input
        disabled={disabled}
        value={props.value || ''}
        type={inputType}
        style={{
          color: '#A4A4A4',
          fontWeight: '400'
        }}
        className={`${className} rounded-md shadow-sm border-none text-section-color`}
        {...props}
        />
        {visible && password && (
          <button
            onClick={() => {
              setInputType('text')
              setVisible(false)
            }}
            type="button"
            tabIndex="-1"
            className='absolute pt-5 right-4'>
              <Image
                src={EyeIcon}
                alt="eye"
                width="0"
                height="0"
                className='w-4'
              />
            </button>
        )}
        {!visible && password && (
          <button
            onClick={() => {
              setInputType('password')
              setVisible(true)
            }}
            tabIndex="-1"
            type="button"
            className='absolute pt-5 right-4'
          >
            <Image
              src={EyeUnseen}
              alt="eye-unseen"
              width="0"
              height="0"
              className='w-4'
            />
          </button>
        )}
    </div>
  )
}

export default Input
