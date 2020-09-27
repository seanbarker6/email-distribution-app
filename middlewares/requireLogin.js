module.exports = (req, res, next) => {
  //next is an express function
  if (!req.user) {
    return res.status(401).send({ error: "you must log in!" });
  }

  next();
};
