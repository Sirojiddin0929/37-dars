export function errorHandler(err, req, res) {
    console.error(err)
    const status = err.status || 500
    const message = err.message || 'Serverda xatolik yuz berdi'

    res.status(status).json({
        success: false,
        message
    })
}