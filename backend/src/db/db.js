import mongoose from 'mongoose'

const DbConnnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.DB_URL)
    console.log(`Connected to ${connectionInstance.connection.name}`)
  } catch (error) {
    console.log(`Error connecting to Data base ${error.message}`)
  }
}
export default DbConnnect
