import JWT from "jsonwebtoken";
import moment from "moment";

export const formatDate = (format) => (req, res, next) => {
    if (req.body.due_date) {
        req.body.due_date = moment(req.body.due_date, 'DD-MM-YY').toDate();
    }
    next();
};


export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};