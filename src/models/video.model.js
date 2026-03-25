import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
     videoFile:{
        type:String,
        required:true
     },
     thumbNail:{
        type:String,
        required:true
     },
      titel:{
        type:String,
        required:true
      },
      description:{
        type:String,
        required:true
      },
      
      duration:{
        type:Number,
        default:0
      },
      views:{
        type:Number,
        required:true
      },
      isPublished:{
        type:Boolean,
        required:true 
      },
      owner:{
         type:Schema.Types.ObjectId,
         ref:"User"
      }
      
    },{
        timestamps:true
    }
)


export const Video = mongoose.model("Video" , videoSchema)