import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <React.Fragment>
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12">
                    <h3 className="mb-4">ERP Dashboard</h3>
                    <p className="lead">Manage your enterprise resources efficiently.</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">User Management</h5>
                            <p className="card-text">Manage users, roles, and permissions.</p>
                            <Link to="/userlist" className="btn btn-primary">Go to Users</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Products</h5>
                            <p className="card-text">Manage products, prices, and images.</p>
                            <Link to="/productlist" className="btn btn-primary">Go to Products</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
  );
}

export default Home;
