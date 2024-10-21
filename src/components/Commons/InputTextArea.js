const InputTextArea = ({ style, ...props }) => {
  return (
    <textarea 
      className={`border border-solid input-boder-color ${style}`}
      {...props}
      style={{
        color: '#A4A4A4',
        fontWeight: '400'
      }}
    />
  )
}

export default InputTextArea;
