import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Editproduct() {
  const [formvalue, setFormvalue] = useState({
    ptitle: "",
    pprice: "",
    status: "",
    pfile: null
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const handleInput = (e) => {
    if (e.target.type === 'file') {
      setFormvalue({ ...formvalue, [e.target.name]: e.target.files[0] });
    } else {
      setFormvalue({ ...formvalue, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    const productRowdata = async () => {
      const getProductdata = await fetch("http://localhost/crud/api/product.php/" + id);
      const resProductdata = await getProductdata.json();
      setFormvalue({
        ptitle: resProductdata.ptitle,
        pprice: resProductdata.pprice,
        status: resProductdata.status,
        pfile: null
      });
    }
    productRowdata();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('ptitle', formvalue.ptitle);
    formData.append('pprice', formvalue.pprice);
    formData.append('status', formvalue.status);
    if (formvalue.pfile) {
      formData.append('pfile', formvalue.pfile);
    }

    const res = await axios.put("http://localhost/crud/api/product.php", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data.success) {
      setMessage(res.data.success);
      setTimeout(() => {
        navigate('/productlist');
      }, 2000);
    }
  }

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-4">
            <h5 className="mb-4">Edit Product</h5>
            <p className="text-success">{message}</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 row">
                <label className="col-sm-2">Product Title</label>
                <div className="col-sm-10">
                  <input type="text" name="ptitle" value={formvalue.ptitle} className="form-control" onChange={handleInput} />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-2">Product Price</label>
                <div className="col-sm-10">
                  <input type="text" name="pprice" value={formvalue.pprice} className="form-control" onChange={handleInput} />
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
                <label className="col-sm-2">Product Image</label>
                <div className="col-sm-10">
                  <input type="file" name="pfile" className="form-control" onChange={handleInput} />
                  <small className="form-text text-muted">Leave empty to keep current image</small>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-2"></label>
                <div className="col-sm-10">
                  <button name="submit" className="btn btn-success">Update</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Editproduct;