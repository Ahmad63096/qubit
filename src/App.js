import './App.css';
import Chatbot from './component/Chatbot';
// import Test from './component/Test';
import { Routes, Route } from 'react-router-dom';
import Contact from './component/Contact';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
function App() {
  return (
    <>
      
      <Routes>
        <Route path='/' element={<Chatbot title='Qubit'/>}/>
        <Route path='/ecommerce' element={<Chatbot title='Qubit commerce' />}/>
        <Route path='/contact' element={<Contact/> } />
        {/* <Route path='/test' element={<Test/> } /> */}
      </Routes>
    </>
  );
}

export default App;
