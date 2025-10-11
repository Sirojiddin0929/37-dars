import { StatusCodes } from "http-status-codes"

export function validateRequest(schema, property="body"){
    return (req, res, next)=>{
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
            errors: {
                wrap: {
                label: false
                }
            }
        })

        if (!error) {
            req[property] = value
            return next()
        }

        const errorDetails = error.details.map(detail => ({
            path: detail.path.join('.'),
            message: detail.message
        }))

        return res.status(StatusCodes.BAD_REQUEST).json({
            status: 'error',
            message: 'Validation error',
            errors: errorDetails
        })
    }
}