import { body, validationResult } from "express-validator";

export const requiredStringValidation = (field, minLength = 1) => {
  const capitalizeField = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  let validateBody = body(field)
    .exists()
    .withMessage(`${capitalizeField(field)} is required`)
    .notEmpty()
    .withMessage(`${capitalizeField(field)} should not be empty`)
    .trim();

  if (minLength > 0) {
    validateBody = validateBody
      .isLength({ min: minLength })
      .withMessage(
        `${capitalizeField(
          field
        )} should be at least ${minLength} characters long`
      );
  }

  return validateBody;
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
