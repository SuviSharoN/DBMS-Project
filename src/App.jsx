import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Contact from './Pages/Contact/Contact'
function App(){
 return(           
      <Routes>
           <Route path = '/contact' element={<Contact/>}></Route>
       </Routes>
 )

}
export default App