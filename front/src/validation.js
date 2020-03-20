import * as yup from 'yup';

const LOGIN_SHAPE = {
  email   : yup.string().label('Email').email().required(),
  password: yup.string().label('Password').required(),
};

export const loginSchema = yup.object(LOGIN_SHAPE);

export const registerSchema = yup.object({
  ...LOGIN_SHAPE,

  confirm: yup.string()
    .label('Password Confirmation')
    .required()
    .test(
      'passwords-match',
      'Password and Password Confirmation fields should match.',
      function (value) {
        return this.parent.password === value;
      }),
});