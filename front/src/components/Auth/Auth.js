import React, { useCallback, useState } from 'react';
import { Form } from '../Form';
import { Card, Link } from '@material-ui/core';
import { loginUser, registerUser } from '../../services/auth';
import './Auth.scss'
import { loginSchema, registerSchema } from '../../validation';

const getCaption = isRegistration => isRegistration ? 'Register' : 'Login';

export const Auth = ({onLogin}) => {
  const [isRegistration, setRegistration] = useState(false);
  const switchState = () => setRegistration(!isRegistration);
  const [errors, setErrors] = useState({});

  const validate = useCallback(async function validate (data) {
    const schema = isRegistration ? registerSchema : loginSchema;
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const entries = err.inner.map(({ path, errors }) => [path, errors.join('\n')]);
      setErrors(Object.fromEntries(entries));
      return false;
    }
  }, [isRegistration]);

  const onSubmit = useCallback(async (data) => {
    if (!await validate(data)) {
      return;
    }

    const { email, password } = data;
    if (isRegistration) {
      try {
        const res = await registerUser({ email, password })
        if (res.status === 201) {
          console.log('user created - do other stuff');
          onLogin();
        }
      } catch (err) {
        console.log('err on user registration');
      }
    } else {
      try {
        const res = await loginUser({ email, password });
        if (res.status === 200) {
          console.log('logged in');
          onLogin();
        }
      } catch (err) {
        console.log('err while loggin in:', err);
      }
    }
  }, [isRegistration, validate, onLogin]);

  return (
    <div className="auth-card-container">
      <Card className="auth-card">

        <Form
          title={getCaption(isRegistration)}
          actionCaption={isRegistration ? 'Sign up' : 'Sign in'}
          {...{ isRegistration, onSubmit, errors }}
        />

        <Link className="switch-form-link" onClick={switchState} component="button">
          Switch to {getCaption(!isRegistration)} form
        </Link>

      </Card>
    </div>
  );
};
