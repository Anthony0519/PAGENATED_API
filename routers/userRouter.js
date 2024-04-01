 const router = require("express").Router()
const { createUser, signIn, verifyUser, getOneUser, changeProfilePics, updateUser, forgetPassword, logOut, resendVerification, resetPassword, deleteUser, pagenated } = require("../controllers/userController")
const authorization = require("../middlewares/authorization")
const { signUpValidation, resetPasswordValidation, updateValidation, forgotValidation, } = require("../middlewares/validation")

router.route("/signup").post(signUpValidation,createUser)

router.route("/login").post(signIn)

router.route("/logout").post(authorization,logOut)  

router.route("/verify/:token").get(verifyUser)

router.route("/get-one-user").get(authorization,getOneUser)

router.route("/verification").post(resendVerification)

router.route("/forgetPassword").post(forgotValidation,forgetPassword)

router.route("/reset_password/:token").put(resetPasswordValidation,resetPassword)

router.route("/change-profile-picture").put(authorization,changeProfilePics)

router.route("/updateusers").put(authorization,updateValidation,updateUser)

router.route("/deleteusers").delete(authorization,deleteUser)

router.route("/pagenation").get(pagenated)

module.exports = router
