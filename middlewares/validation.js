const hapiJoiValidator = require("@hapi/joi");

const signUpValidation = (req, res, next) => {
  const validateSignup = hapiJoiValidator.object({
    firstName: hapiJoiValidator.string().min(3).max(40).trim().pattern(/^[a-zA-Z]+$/).required().messages({
      'string.empty': 'firstName cannot be empty',
      'string.min': 'Min 3 characters',
      'string.pattern.base': 'Invalid format for firstName. Number not accepted',
    }),
    lastName: hapiJoiValidator.string().min(3).max(40).trim().pattern(/^[a-zA-Z]+$/).required().messages({
      'string.empty': 'lastName cannot be empty',
      'string.min': 'Min 3 characters',
      'string.pattern.base': 'Invalid format for lastName. Number not accepted',
    }),
    phoneNumber: hapiJoiValidator.string().min(11).trim().regex(/^\d{11}$/).required().messages({
      'string.empty': 'phone number cannot be empty',
      'string.pattern.base': 'Invalid phone number format',
  }),    
    email: hapiJoiValidator.string().email({ tlds: { allow: false } }).trim().min(5).required().messages({
      'string.empty': 'email cannot be empty',
      'string.email': 'Invalid email format',
    }),
    password: hapiJoiValidator.string().min(8).max(30).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#_:\-\/])[a-zA-Z0-9$@#_:\-\/]+$/).required().messages({
      'string.empty': 'password cannot be empty',
      'string.min': 'Min 8 characters for password',
      'string.max': 'Max 30 characters for password',
      'string.pattern.base':'Password must contain uppercase,lowercase, digits from(0-9), and one of the following special characters: @, #, $, :, -, /',
    }),
  });

  const { firstName, lastName, email, phoneNumber, password } = req.body;

  const { error } = validateSignup.validate({firstName,lastName,email,phoneNumber,password}, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    
    // Send errors one by one
    for (const errorMessage of errors) {
    return res.status(400).json({ error: errorMessage });
    }
  }


  next();
};

const hotelValidation = (req, res, next) => {
  const validateSignup = hapiJoiValidator.object({
    hotelName: hapiJoiValidator.string().min(3).max(40).required().messages({
      'string.empty': 'hotelName cannot be empty',
      'string.min': 'Min 3 characters', 
    }),
    phoneNumber: hapiJoiValidator.string().min(11).trim().regex(/^\d{11}$/).required().messages({
      'string.empty': 'phone number cannot be empty',
      'string.pattern.base': 'Invalid phone number format', 
  }),    
    email: hapiJoiValidator.string().email({ tlds: { allow: false } }).trim().min(5).required().messages({
      'string.empty': 'email cannot be empty',
      'string.email': 'Invalid email format',
    }),
    city: hapiJoiValidator.string().min(3).max(40).trim().required().messages({
      'string.empty': 'city cannot be empty',
      'string.min': 'Min 3 characters', 
    }),
    address: hapiJoiValidator.string().min(3).max(100).trim().required().messages({
      'string.empty': 'address cannot be empty',
      'string.min': 'Min 3 characters', 
    }),
    password: hapiJoiValidator.string().min(8).max(30).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#_:\-\/])[a-zA-Z0-9$@#_:\-\/]+$/).required().messages({
      'string.empty': 'password cannot be empty',
      'string.min': 'Min 8 characters for password',
      'string.max': 'Max 30 characters for password',
      'string.pattern.base':'Password must contain uppercase,lowercase, digits from(0-9), and one of the following special characters: @, #, $, :, -, /',
    }),
  });

  const {hotelName,city,address,email,phoneNumber,password} = req.body

  const { error } = validateSignup.validate({hotelName,city,address,email,phoneNumber,password});

  if (error) {
    const errors = error.details.map(detail => detail.message);
    
    // Send errors one by one
    for (const errorMessage of errors) {
    return res.status(400).json({ error: errorMessage });
    }
  }

  next();
};

const resetPasswordValidation = (req, res, next) => {
  const validatePassword = hapiJoiValidator.object({
    password: hapiJoiValidator.string().min(8).max(30).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#_:\-\/])[a-zA-Z0-9$@#_:\-\/]+$/).required().messages({
      'string.empty': 'password cannot be empty',
      'string.min': 'Min 8 characters for password',
      'string.max': 'Max 30 characters for password',
      'string.pattern.base':'Password must contain uppercase,lowercase, digits from(0-9), and one of the following special characters: @, #, $, :, -, /',
    }),
  });

  const { password } = req.body;

  const { error } = validatePassword.validate({password});

  if (error) {
    const errors = error.details.map(detail => detail.message);
    
    // Send errors one by one
    for (const errorMessage of errors) {
    return res.status(400).json({ error: errorMessage });
    }
  }

  next();
};

const updateValidation = (req, res, next) => {
  const validateUpdate = hapiJoiValidator.object({
    firstName: hapiJoiValidator.string().min(3).max(40).trim().pattern(/^[a-zA-Z]+$/).required().messages({
      'string.empty': 'firstName cannot be empty',
      'string.min': 'Min 3 characters', 
    }),
    lastName: hapiJoiValidator.string().min(3).max(40).trim().pattern(/^[a-zA-Z]+$/).required().messages({
      'string.empty': 'lastName cannot be empty',
      'string.min': 'Min 3 characters',
    }),
    phoneNumber: hapiJoiValidator.string().min(11).trim().regex(/^\d{11}$/).required().messages({
      'string.empty': 'phone number cannot be empty',
      'string.pattern.base': 'Invalid phone number format', 
  }),    
  });

  const { firstName, lastName, phoneNumber } = req.body;

  const { error } = validateUpdate.validate({firstName,lastName,phoneNumber});

  if (error) {
    const errors = error.details.map(detail => detail.message);
    
    // Send errors one by one
    for (const errorMessage of errors) {
    return res.status(400).json({ error: errorMessage });
    }
  }

  next();
};

const forgotValidation = (req, res, next) => {
  const validateforgot = hapiJoiValidator.object({
    email: hapiJoiValidator
      .string()
      .email({ tlds: { allow: false } })
      .trim()
      .min(5)
      .required()
      .messages({
        "string.empty": "email cannot be empty",
        "string.email": "Invalid email format",
      }),
  });

  const { email } = req.body;

  const { error } = validateforgot.validate({email});

  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message), 
    });
  }

  next();
};


module.exports = {
  signUpValidation,
  resetPasswordValidation,
  updateValidation,
  forgotValidation,
  hotelValidation
};
