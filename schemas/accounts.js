import yup from 'yup';

export const AccountSchema = yup.object({
    email:             yup.string().email().required(),
    name:              yup.string().required(),
    surname:           yup.string().required(),
    password:          yup.string().length(8).required(),
    confirm_password:  yup.string().length(8).required().oneOf([yup.ref('password'), null], 'Passwords must match'),
})

export const AccountLoginSchema = yup.object({
    email:             yup.string().email().required(),
    password:          yup.string().length(8).required(),
})