const asynchandeler = (reqhandeler)=>{
       return(req,res,next)=>{
      return Promise.resolve(reqhandeler(req,res,next)).catch((err)=>next(err))
}}


 

export{asynchandeler}








//higher order function 
// const asynchandeler = ()=>{}

// const asynchandelere = ()=>{()=>{}}
// const asynchandeleree = (functio)=> async()=>{}

//  const asynchandeler = (fn)=> async (req,res,next)=>{
//     try{
//         await fn(req,res,next)

//     }catch (error){
//         res.status(error.code || 5000).json({
//             sucess:falsez,
//             message:error.message
//         })

//     }
//  }