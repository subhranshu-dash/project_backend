import mongoose, { Schema } from "mongoose"
import jwt, { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

  

const userSchma = new Schema({
   username:{
     type :String,
     required:true,
     unique:true,
     lowercase:true ,
     trim:true,
     index :true 

   },
   useremail:{
     type :String,
     required:true,
     unique:true,
     lowercase:true ,
     trim:true,
      

   },
   userfullname :{
     type  :String,
     required:true,
     lowercase:true ,
     trim:true,
      

   },
   avtar:{
    type :String,//cloudnary url 
    required:true 

   },
   coverimage:{
    type :String,//cloudnary url 
    required:true 

   },
   watchHistory:[
    {
        type :Schema.Types.ObjectId ,
        ref:"Video"

    }
   ],
   password:{
    type:String ,
    required:[true,'pass is required']
   },
   refreshToken:{
      type:String
   }

  
   


},{
  timestamps:true
})
userSchma.pre("save", async function(next){
   if(!this.ismodified("password")) return next()
   this.password = bcrypt.hash(this.password,10 ) 
   next()
})
userSchma.methods.ispasswordisCorrect = async function(password){
 return await bcrypt.compare(password,this.password)

 
}
userSchma.methods.generateToken = function(){
  jwt.sign({
    id_: this.id_,
    useremail:this.useremail,
    username :this.username ,
    userfullname:this.userfullname


  }, process.env.generateToken,
  {
    expiresIn:process.env.exparitoken 
  }
  )
}
userSchma.methods.refreshToken(function(){
  jwt. sign({
    id:this.id
  })
   
},process.env.refreshToken,
{
  expiresIn:process.env.refreshToken
}
)

export const User = mongoose.model("User",userSchma )