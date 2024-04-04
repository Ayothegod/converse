
export const isAuthenticated = (req, res, next) => {
    if (req.session?.user) {
      console.log(" authenticated");
      next();
    } else {
      res.json({status: 404, msg: "not authenticated"});
    }
  };

