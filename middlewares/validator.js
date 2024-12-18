import { body, validationResult, param } from "express-validator";

export const requiredFieldValidation = (field, minLength = 0) => {
  const capitalizeField = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  let validateBody = body(field)
    .exists()
    .withMessage(`${capitalizeField(field)} is required`)
    .notEmpty()
    .withMessage(`${capitalizeField(field)} should not be empty`)
    .trim();

  if (minLength > 0) {
    validateBody
      .isLength({ min: minLength })
      .withMessage(
        `${capitalizeField(
          field
        )} should be at least ${minLength} characters long`
      );
  }

  return validateBody;
};

export const requiredParamValidation = (paramName) => {
  const validateParam = param(paramName)
    .exists()
    .withMessage(`${paramName} is required.`);

  return validateParam;
};

export function getValidationResult(req, res, next) {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: result.array(),
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
