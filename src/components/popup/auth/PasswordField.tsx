import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField } from '@mui/material'

interface PasswordFieldProps {
  name: string
  label: string
  value: string
  show: boolean
  setShow: (show: boolean) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export const PasswordField = ({ name, label, value, show, setShow, onChange, disabled = false }: PasswordFieldProps) => (
  <TextField
    fullWidth
    label={label}
    name={name}
    type={show ? 'text' : 'password'}
    value={value}
    onChange={onChange}
    required
    margin='normal'
    disabled={disabled}
    InputProps={{
      endAdornment: (
        <InputAdornment position='end'>
          <IconButton onClick={() => setShow(!show)} edge='end' disabled={disabled}>
            {show ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      )
    }}
  />
)
