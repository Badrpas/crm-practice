import React, { useCallback, useState } from 'react';
import { Form } from '../Form';
import { Card, Link } from '@material-ui/core';
import { loginUser, registerUser } from '../../services/auth';
import './Auth.scss'
import { loginSchema, registerSchema } from '../../validation';

const getCaption = isRegistration => isRegistration ? 'Register' : 'Login';

export const Auth = ({onLogin}) => {
  const [isRegistration, setRegistration] = useState(false);
  const [errors, setErrors] = useState({});
  const switchState = () => {
    setRegistration(!isRegistration);
    setErrors({});
  };

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

  const handleError = useCallback(err => {
    let msg = 'Something sent wrong.';
    if (err.isAxiosError) {
      msg = err.response.data.message;
    }
    setErrors({ msg });
    console.log('err while loggin in:', err);
  }, [setErrors]);

  const onSubmit = useCallback(async (data) => {
    if (!await validate(data)) {
      return;
    }

    const { email, password } = data;
    const authorize = isRegistration ? registerUser : loginUser;
    try {
      const res = await authorize({ email, password });
      if (res.status >= 200) {
        console.log('logged in as', email);
        onLogin(res.data);
      }
    } catch (err) {
      handleError(err);
    }
  }, [isRegistration, validate, onLogin, handleError]);

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
