import yup from 'yup';

export const gameSchema = yup.object({
    name:          yup.string().required().strict(),
    genre:         yup.string().required().strict(),
    members:       yup.array().required().strict(),
    edition:       yup.string().required().strict(),
})

