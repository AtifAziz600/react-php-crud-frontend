import './App.css';
import Addproduct from './component/Addproduct';
import Adduser from './component/Adduser';
import Editproduct from './component/Editproduct';
import Edituser from './component/Edituser';
import Footer from './component/Footer';
import Header from './component/Header';
import Home from './component/Home';
import Productlist from './component/Productlist';
import Userlist from './component/Userlist';
import {Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/userlist' element={<Userlist/>}/>
        <Route path='/adduserlist' element={<Adduser/>}/>
        <Route path='/edituser/:id' element={<Edituser/>}/>
        <Route path='/productlist' element={<Productlist/>}/>
        <Route path='/addproduct' element={<Addproduct/>}/>
        <Route path='/editproduct/:id' element={<Editproduct/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
