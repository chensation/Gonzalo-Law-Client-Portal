import React, { Component } from "react";
import { Link, Redirect  } from "react-router-dom";
import axios from "axios";
import Search from "./search.js";
import baseURL from "../../baseURL.js";
import checkToken from "../checkToken.js";
import jwtDecode from "jwt-decode";
import NavBarAdmin from "./navBarAdmin";
import DeleteClient from "./deleteClient";

const escapeRegExp = string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export default class admin extends Component {

  constructor(props) {

    super(props);

    this.handleDelete = this.handleDelete.bind(this);
  }

  state = {
    selectedClient: "",
    searchTerm: "",
    hasSelected: false,
    clients: [],
    redirect: false,
    error: false
  };

  handleSearch = term => {
    //console.log("Search term: " + term);
    this.setState({ searchTerm: term });
  };

  async componentDidMount() {
    localStorage.removeItem("userEmail");

    axios.defaults.headers.common["token"] = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null;
    await checkToken().then(response => {
      this.setState({ redirect: !response });
    });

    if (!this.state.redirect) {
      const data = jwtDecode(localStorage.getItem("token"));

      if (data.isAdmin) {
        axios
          .get(baseURL + "getClients")
          .then(res => {
            //console.log(
            //  "response array of clients: " + JSON.stringify(res.data)
          //  );
            let clients = JSON.parse(JSON.stringify(res.data));
            this.setState({ clients: clients });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.setState({ error: true });
      }
    }
  }

  async componentDidUpdate() {
    //console.log("Search term in state of dashboard: " + this.state.searchTerm);
    //console.log("Selected client in state: " + this.state.selectedClient);


  }

  handleSelected(email) {
    //console.log("Selected: " + email);
    this.setState({ selectedClient: email });
    this.setState({ hasSelected: true });
    localStorage.setItem("userEmail", email);
  }


  async handleDelete(id) {
    await axios({
      method: "post",
      url: baseURL + "deleteUser",
      params: {
        uid: id
      }
    });

    const newClients = this.state.clients.filter(
      (item) =>{
        return item._id !== id
      });

    this.setState({clients: newClients});

  }


  clientListRender() {
    //todo: will have to be put in a scrolly view thing*

    return (
      <div className="ui celled list">
        {this.state.clients
          .filter(item => {
            if (this.state.searchTerm.trim() !== "") {
              const regexp = new RegExp(
                escapeRegExp(this.state.searchTerm.trim().toLowerCase())
              );
              if (item) {
                const result = item.name
                  .trim()
                  .toLowerCase()
                  .match(regexp);
                return result && result.length > 0;
              }
              return false;
            }
            return true;
          })
          .map(item => {
            return (
              <div className="item" key={item.email} style={{ cursor: "pointer" }}>
                <div className="right floated content" >
                  <DeleteClient
                    handleDelete = {this.handleDelete}
                    id={item._id} />
                </div>

                <i className="big user icon"></i>
                <div
                  className="content"
                  onClick={() => this.handleSelected(item.email)}
                >
                  <div className="header">{item.name}</div>
                  {item.email}
                </div>

              </div>
            );
          })}
      </div>
    );
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }

    if (this.state.error) {
      return <h1>You do not have permission to view this page.</h1>;
    }

    if (this.state.hasSelected) {
      //alert("what111");
      return (
        <Redirect
          push to={{
            pathname: "/projects"
          }}
        />
      );
    }

    return (
      <div>
        <NavBarAdmin />
        <div className="col-md-6 m-auto">
          <div className="card card-body">
            <h1 className="text-center mb-3"> Dashboard</h1>
            <br />
            <h1 className="lead mb-3">
              Welcome
              <strong> Admin</strong>
            </h1>
            <h1>Client List</h1>
            <Search handleSearch={this.handleSearch} />
            {this.clientListRender()}
          </div>
        </div>
      </div>
    );
  }
}
