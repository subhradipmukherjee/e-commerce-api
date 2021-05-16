const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name : {
       type: String,
       required:true,
       trim: true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        trim: true,
        lowercase : true,
        // validate(value) {
        //     if(!validator.isEmail(value))
        //      throw new Error('Incorrect mail id')

        // }

    },
    password : {
        type : String,
        required: true,
        trim : true,
        // validate(value) {
        //  if(value.length <= 6)
        //   throw new Error('Password mmust contain more than 6 letters')

        //  if(value.toLowerCase() == 'password') 
        //     throw new Error('Password can not be the word password')             
        // }

    },
    tokens : [{
        token : {
            type: String,
            //required: true
        }
    }],

    cart : [{ //mongoose.Schema.Types.ObjectId
            type:mongoose.Schema.Types.ObjectId , ref: 'Product'
        }]
},{
    timestamps : true
})


userSchema.methods.authtoken = async function (){                             // functions with userschema.methods are for particular instances of that schema
    const user = this
    const token = jwt.sign({id : user._id.toString()},'topsecret')
    return token
}

module.exports = mongoose.model('Users', userSchema);