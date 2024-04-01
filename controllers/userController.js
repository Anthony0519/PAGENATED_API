const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {sendEmail} = require("../Utils/sendMail")
const {dynamicMail,resetPasswordMail} = require("../Utils/emailtemplate")

// create a new user
exports.createUser = async (req,res)=>{
    try{

        // get the user's input
        const {firstName,lastName,email,phoneNumber,password,confirmPassword} = req.body

        // check if tne user entered all fields
        if(!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword){
            return res.status(400).json({
                error:"All fields must be filled"
            })
        }
        
        // check if the email already exist
        const checkEmail = await userModel.findOne({email:email})
        if(checkEmail){
            return res.status(400).json({
                error:"user with email already exist"
            })
        }
        // check if the password matches
        if(confirmPassword !== password){
            return res.status(400).json({
                error:"password does not match"
            })
        }

        // hash the password
        const saltPass = bcrypt.genSaltSync(12)
        const hash = bcrypt.hashSync(password,saltPass)

        // create the user
        const user = await userModel.create({
            firstName:firstName.toLowerCase().charAt(0).toUpperCase() + firstName.slice(1),
            lastName:lastName.toLowerCase().charAt(0).toUpperCase() + lastName.slice(1),
            email:email.toLowerCase(),
            phoneNumber,
            password:hash
        })

        // generate a token for the user
        const token = jwt.sign({
            userId:user._id,
            email:user.email,
            tel:user.phoneNumber
        },process.env.jwtKey,{expiresIn:"5mins"})

        // verify the users email
        const link = `${req.protocol}://${req.get("host")}/api/v1/users/verify/${token}`
        const html = dynamicMail(link,user.firstName,user.lastName.slice(0,1).toUpperCase())

        sendEmail({
            email:user.email,
            subject: "KIND VERIFY YOUR ACCOUNT",
            html:html
        })

        // success message
        res.status(201).json({
            message:"Account created successfully... Kindly check your email or spam for verification",
            user
        })

    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
}

exports.verifyUser = async (req,res)=>{
    try{

        // get the user token
        const {token} = req.params
        if (!token) {
            return res.status(400).json({
                error:"link expired"
            })
        }

        // extract the user's id from the token
        const decodeToken = jwt.verify(token,process.env.jwtKey)

        // extract the user's id
        const ID = decodeToken.userId

        // find the user that own the token
        const user = await userModel.findById(ID)
        if(!user){
            return res.status(400).json({
                error:"email not found"
            })
        }

        // check if the user is already verified
        if(user.isverified === true){
            return res.status(400).json({
                error:"user already verified"
            })
        }
        
        // find by id and verify
         await userModel.findByIdAndUpdate(ID,{isVerified:true}, {new:true})
    
        // res.status(200).json({
        //     message: "you have been verified",
        // })
        res.redirect("https://tour-haven-appli.vercel.app/verify")

    }catch(err){
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                error:"link expired"
            })
        }
        res.status(500).json({
            error:err.message
        })
    }
}

exports.signIn = async (req,res)=>{
    try{

        // get the users input
        const {email,password } = req.body;

        // check if tne user entered all fields
        if(!email || !password){
            return res.status(400).json({
                error:"All fields must be filled"
            })
        }

        // check if tghe user exist
        const user = await userModel.findOne({email:email.toLowerCase()})
        if(!user){
            return res.status(400).json({
                error: "wrong email"
            })
        }

        // check for pasword
        const checkPassword = bcrypt.compareSync(password,user.password)
        if (!checkPassword) {
            return res.status(400).json({
                error: "wrong password"
            })
        }

        // check for verification
        if(user.isVerified  === false){
            return res.status(400).json({
                error: "kindly verify your email so you can login"
            })
        }

        // generate a token for the user if all detail are correct
        const token = jwt.sign({
            userId:user._id,
            email:user.email,
            tel:user.phoneNumber
        },process.env.jwtKey,{expiresIn:"1d"})

        // throw a success respomse
        res.status(200).json({
            message:"Login successful",
            data:{
                firstName:user.firstName,
                lastName:user.lastName
            },
            token:token
        })

    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
}

exports.resendVerification = async (req,res)=>{
    try{

        // get the user's email
        const {email} = req.body
        if (!email) {
            return res.status(404).json({
              error: "Please enter your email address"
            });
          }
      

        // find the user with the email
        const user = await userModel.findOne({email:email.toLowerCase()})
        if(!user){
            return res.status(404).json({
                error:"email not found"
            })
        }

       // check if the user is already verified
        if(user.isverified === true){
            return res.status(400).json({
                error:"user already verified"
            })
        }        

        // generate a token for the user
        const token = jwt.sign({
            userId:user._id,
            email:user.email,
            tel:user.phoneNumber
        },process.env.jwtKey,{expiresIn: "5mins"})

        // verify the users email
        const link = `${req.protocol}://${req.get("host")}/api/v1/users/verify/${token}`
        // const html = dynamicMail(link,user.firstName,user.lastName.slice(0,1).toUpperCase())

        sendMail({
            email:user.email,
            subject: "KIND VERIFY YOUR ACCOUNT",
            html:hello
        })

        res.status(200).json({
            message: "verification mail sent to your email"
        })


    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
}

exports.resetPassword = async (req,res)=>{
    try {

        // get the token from the params
        const {token} = req.params
        if (!token) {
            return res.status(404).json({
                error:"token not found"
            })
        }

        // get the user's input
        const {newPassword,confirmPassword} = req.body

        // check if the fields are empty
        if (confirmPassword !== newPassword) {
            return res.status(400).json({
                error:"password does not match"
            })
        }

        // encrypt the token
        const decodeToken = jwt.verify(token,process.env.jwtKey)

        // extract the user's id        
        const ID = decodeToken.userId

        // find the user with the token
        const user = await userModel.findById(ID)
        if (!user) {
            return res.status(404).json({
                error:"user not found"
            })
        }

        // bcrypt the password
        const saltPass = bcrypt.genSaltSync(12)
        const hash = bcrypt.hashSync(newPassword,saltPass)

        // save the changes
        user.password = hash
        await user.save()

        // return success message
        res.status(200).json({
            message: "password reset successfull"
        })
        
    } catch (err) {
        res.status(500).json({
            error:err.message
        })
    }
}

exports.forgetPassword = async (req,res)=>{
    try {

        // request for the users email
        const {email} = req.body
        if (!email) {
            return res.status(404).json({
              error: "Please enter your email address"
            });
          }

        // check if the users email exist in the dataBase
        const user = await userModel.findOne({email:email.toLowerCase()})
        if (!user) {
            return res.status(404).json({
                error:"user not found"
            })
        }

        // if user found generate a new token for the user
        const token = jwt.sign({userId:user._id},process.env.jwtKey,{expiresIn:"10mins"})
       
        const link = `https://tour-haven-appli.vercel.app/resetpass/${token}`
        const html =  resetPasswordMail(link, user.firstName)

        sendMail({
            email: user.email,
            subject:"VERIFY YOUR EMAIL TO RESET PASSWORD",
            html:html
        })

        // throw a success message
        res.status(200).json({
            message:"Email sent successfully"
        })
        
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                error:"link expired"
            })
        }
        res.status(500).json({
            error:err.message
        })
    }
}

exports.getOneUser = async(req,res)=>{
    try {

        // get the users id
        const ID = req.user.userId

        // find the user
        const user = await userModel.findById(ID)
        if(!user){
            return res.status(404).json({
                error:"user not found"
            })
        }

        // return the user's details when found
        res.status(200).json({
            message:"here are the user's details",
            details:{
                name:`${user.firstName} ${user.lastName}`,
                email:user.email,
                phoneNumber:user.phoneNumber
            }
        })
        
    } catch (err) {
        res.status(500).json({
            error:err.message
        })
    }
}

exports.pagenated = async(req,res)=>{
    try {

        const page = parseInt(req.query.page) || 5
        const size = parseInt(req.query.size) || 3

        
        // find the user
        const users = await userModel.find().select("_id")
        if(!users || users.length === 0){
            return res.status(404).json({
                error:"user not found"
            })
        }

        const start = (page - 1) * size;
        const end = start + size;
        const paginatedUsers = users.slice(start, end);

        const nextPage = end < users.length;

        res.json({
            users: paginatedUsers,
            has_next_page: nextPage
        });

    } catch (err) {
        res.status(500).json({
            error:err.message
        })
    }
}

exports.changeProfilePics = async(req,res)=>{
    try {

        // get the id from the token
        const ID = req.user.userId

        // get the user with the id
        const user = await userModel.findById(ID)
        if (!user) {
            return res.status(404).json({
                error:"user not found"
            })
        }

        // detroy the prvious image/and update the new one
        if (user.profilePics) {
            const oldImage = user.profilePics.split("/").pop().split(".")[0]
            await cloud.uploader.destroy(oldImage)

        }

        // update the new image
        const file = req.files.profilePics.tempFilePath
        const newImage = await cloud.uploader.upload(file)
        await userModel.findByIdAndUpdate(ID,{profileImage:newImage.secure_url},{new:true})

        res.status(200).json({
            message: "picture updated"
        })

    } catch (err) {
        res.status(500).json({
            error:err.message
        })
    }
}

exports.updateUser = async(req,res)=>{
    try {

        // get the user's id
        const ID = req.user.userId

        // get the user's input
        const {firstName,lastName,phoneNumber,email} = req.body

        // find tyhe user with the id
        const user = await userModel.findById(ID)
        if (!user) {
            return res.status(404).json({
                error:"user not found"
            })
        }

        // create an instance of what the user can edit
        const editOnly = {
            firstName,
            lastName,
            phoneNumber,
        }

        // eddit the details
        const updated = await userModel.findByIdAndUpdate(ID,editOnly,{new:true})
        if (!updated) {
            return res.status(400).json({
                error:"error updating user"
            })
        }
        
        // if(email){
        //     updated.email = email.toLowerCase()
        //     updated.isVerified = false
        //     await updated.save()

        //             // generate a token for the user
        // const token = jwt.sign({
        //     userId:user._id,
        //     email:user.email,
        //     tel:user.phoneNumber
        // },process.env.jwtKey,{expiresIn:"5mins"})

        // // verify the users email
        // const link = `${req.protocol}://${req.get("host")}/api/v1/users/verify/${token}`
        // const html = dynamicMail(link,updated.firstName,updated.lastName.slice(0,1).toUpperCase())

        // sendMail({
        //     email:user.email,
        //     subject: "KIND VERIFY YOUR ACCOUNT",
        //     html:html
        // })

        // return  res.status(200).json({
        //     message:"user updatted successfully. Kindly verify your new email address to continue"
        // })

        // }

        // success message
        res.status(200).json({
            message:"user updatted successfully"
        })
        
    } catch (err) {
        res.status(500).json({
            error:err.message
        })
    }
}

exports.deleteUser = async(req,res)=>{
    try {

        // get the user's id
        const ID = req.user.userId

        // find tyhe user with the id
        const user = await userModel.findById(ID)
        if (!user) {
            return res.status(404).json({
                error:"user not found"
            })
        }

        // eddit the details
        const deleteAcct = await userModel.findByIdAndDelete(ID,{new:true})
        if (!deleteAcct) {
            return res.status(400).json({
                error:"error deleting account"
            })
        }

        // success message
        res.status(200).json({
            message:"user deleted successfully"
        })
        
    } catch (err) {
        res.status(500).json({
            error:err.message
        })
    }
}

exports.logOut = async (req, res) => {
    try {

        // get the user's id from token
        const userId = req.user.userId;

        // find the user
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: 'This user does not exist',
            });
        }

        // get theusers token and push to blacklist
        const token = req.headers.authorization.split(' ')[1];
        user.blackList.push(token)
        // save the user
        await user.save()

        // return sucess message
        res.status(200).json({
            message: 'User logged out successfully',
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};