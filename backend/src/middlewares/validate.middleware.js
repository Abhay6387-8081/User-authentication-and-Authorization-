import CustomError from "../utils/CustomError.util.js";

export const validates = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      new CustomError(400, `${error.details.map((ele) => ele.message)}`);
    }
    req.body = value;
    next();
  };
};
