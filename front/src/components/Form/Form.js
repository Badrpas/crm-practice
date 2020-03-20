import React, { useCallback } from 'react';
import { Button, FormLabel } from '@material-ui/core';
import { observer, useObservable } from 'mobx-react-lite';
import { FormInput } from '../FormInput';
import './Form.scss';
import Alert from '@material-ui/lab/Alert';

const initialData = {
  email   : '',
  password: '',
  confirm: '',
};

export const Form = observer(
({
   title = 'Form',
   actionCaption = 'Submit',
   isRegistration = false,
   onSubmit,
   errors
}) => {
  const data = useObservable({ ...initialData });

  const getDataSetter = name => value => data[name] = value;

  const getErrorProps = useCallback(name =>
    (errors[name] ? {
      error     : true,
      helperText: errors[name]
    } : {}), [errors]);

  const Input = observer(({ name, children, ...props }) => (
    <FormInput
      setter={getDataSetter(name)}
      value={data[name]}
      name={name}
      {...getErrorProps(name)}
      {...props}
    >
      {children}
    </FormInput>
  ));

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    onSubmit({ ...data });
  }, [data, onSubmit]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} autoComplete="off">
        <FormLabel>{title}</FormLabel>

        {!!errors.msg ? <Alert severity="error">{errors.msg}</Alert> : null}

        <Input name="email">Your Email</Input>
        <Input name="password" type="password">Your Password</Input>

        {
          isRegistration
            ? <Input name="confirm" type="password">Confirm Password</Input>
            : null
        }

        <div>
          <Button color="primary" variant="contained" type="submit">
            {actionCaption}
          </Button>
        </div>

      </form>
    </div>
  );
});