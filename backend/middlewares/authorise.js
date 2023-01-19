function authorise(permittedRole) {
  return (req, res, next) => {
    let role = req.body.userRole;
    if (permittedRole.includes(role)) {
      next();
    } else {
      return res
        .status(401)
        .send({ msg: "You are not permitted", status: "fails" });
    }
  };
}

module.exports = authorise;
