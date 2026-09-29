

import Layout from "@/layout/Layout"
import { PropsWithChildren, ReactElement } from "react"


type Props=PropsWithChildren;
const UserLayout = ({children}:Props):ReactElement => {
  return (
    <Layout>
     {children}
    </Layout>
  )
}
export default UserLayout
