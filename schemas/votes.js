import yup from 'yup';

export const voteCreateSchema = yup.object({
    judge_id:          yup.string().length(24).required().strict(),
    gameplay:          yup.number().moreThan(0).lessThan(11).required().strict(),
    art:               yup.number().moreThan(0).lessThan(11).required().strict(),
    sound:             yup.number().moreThan(0).lessThan(11).required().strict(),
    thematic_affinity: yup.number().moreThan(0).lessThan(11).required().strict(),
})

