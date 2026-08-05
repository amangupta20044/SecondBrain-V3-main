import mongoose from "mongoose";


const connectDB = async (retries = 5 , delay=5000)=>{
    try {
        if(!process.env.MONGO_URI){
            throw new Error("Mongo DB Uri in not present in env file")
        }
        await mongoose.connect(process.env.MONGO_URI)
    } catch (e : any) {
        console.error(e.message)
        if(retries=== 0 ){
            process.exit(1)
        }else{
            console.log(`Retrying to connect in ${delay/1000} seconds...`)
            setTimeout(()=>connectDB(retries-1, delay), delay)
        }
    }
}

export default connectDB