import Navbar from "@/components/navbar";
import ButtonMenu from "./buttonMenu";
import { DataProvider } from "@/hooks/analysis";
const Layout: React.FC = ({ children }) => {
  return (
    <DataProvider>
    <main className="flex flex-col min-h-screen">
        <Navbar />
      <div className="flex-grow ">{children}</div>
      <ButtonMenu />
    </main>
    </DataProvider>
  )

}
export default Layout