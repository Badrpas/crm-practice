import React from 'react';
import TextField from '@material-ui/core/TextField';

export const FormInput = ({ name, children, setter, ...props }) => (
  <TextField
    name={name}
    label={children}
    variant="outlined"
    {
      ...(typeof setter === 'function'
          ? {
            onChange(e) {
              setter(e.target.value)
            }
          } : {})
    }
    {...props}
  />
);