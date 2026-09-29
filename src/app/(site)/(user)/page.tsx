import connectDb from "@/utils/connectDb"

const HomePage = async() => {

  await connectDb()
  return (
    <div>HomePage</div>
  )
}
export default HomePage