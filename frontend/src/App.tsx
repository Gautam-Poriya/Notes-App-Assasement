
import  {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import SignUp from './component/SignUp'
import Todo from './component/To-Do-App/ToDo'
import SignIn from './component/SignIn'
function App() {
  
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignUp/>} />
         <Route path='/Todo' element={<Todo/>} />
         <Route path='/signin' element={<SignIn/>}/>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
