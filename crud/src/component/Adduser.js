import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Adduser() {
  const [formvalue, setFormvalue] = useState({
    username: "",
    email: "",
    status: ""
  });
  const [message, setMessage]= useState('');
  const navigate= useNavigate();
      const handleInput =(e)=>{
        setFormvalue({...formvalue, [e.target.name]:e.target.value});
    };

    const handleSubmit =async(e)=>{
         e.preventDefault();
         //console.log(formvalue);
         const formData= {username:formvalue.username, email:formvalue.email, status:formvalue.status}; 
         const res= await axios.post("http://localhost/crud/api/user.php",formData);
                    if(res.data.success)
           {
            setMessage(res.data.success);
            setTimeout( ()=>{               
                navigate('/userlist');
            }, 2000);
           
           }
        } 
  return (
    <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-4">
                        <h5 className="mb-4">Adduser </h5>
                        <p className="text-sucess"> { message }</p>                 
                         <form onSubmit={handleSubmit}>
                            <div className="mb-3 row">
                            <label className="col-sm-2">Username</label>
                            <div className="col-sm-10">
                            <input type="text" name="username" value={formvalue.username} className="form-control" onChange={handleInput}/>
                            </div>
                            </div>
                            <div className="mb-3 row">
                            <label className="col-sm-2">Email</label>
                            <div className="col-sm-10">
                            <input type="text" name="email" value={formvalue.email} className="form-control" onChange={handleInput}/>
                            </div>
                            </div>

                            <div className="mb-3 row">
                            <label className="col-sm-2">Status</label>
                            <div className="col-sm-10">
                            <select name="status" className="form-control" value={formvalue.status} onChange={handleInput}>
                                <option value="">--Select Status--</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            </div>
                            </div>

                            <div className="mb-3 row">
                            <label className="col-sm-2"></label>
                            <div className="col-sm-10">
                           <button name="submit" className="btn btn-success">Submit</button>
                            </div>
                            </div>

                         </form>
      
                    </div>
                </div>
            </div>

    </React.Fragment>
  );
}

export default Adduser;
