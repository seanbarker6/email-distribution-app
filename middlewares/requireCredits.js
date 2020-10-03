module.exports = (req, res, next) => {
  //next is an express function
  if (req.user.credits < 1) {
    return res.status(403).send({ error: "Not enough credits" });
  }

  next();
};
