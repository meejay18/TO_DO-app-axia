export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'only admins are allowed to perform this action',
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}
