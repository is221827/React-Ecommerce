import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
import ProductList from './components/ProductList';
import Context from "./Context";
//import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
    this.routerRef = React.createRef();
  }

  async componentDidMount() {
    const products = await axios.get('https://webshop-fe.azurewebsites.net/api/products/');
    this.setState({ products: products.data });
  }

  buyProduct = article_number => {
    const products = this.state.products.slice();
    let index = products.findIndex(product => product.article_number === article_number);
    if (products[index].items_available > 0) {
      axios.post('https://webshop-fe.azurewebsites.net/api/order/'+article_number+'/')
      .then( response => {
        console.log(response);
        if (response.status === 200) {
          // SMS here?
          products[index].items_available -= 1;
          this.setState({products});
        } else {
          return "nono";
        }
      })
      .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state, buyProduct: this.buyProduct
        }}
      >
        <Router ref={this.routerRef}>
        <div className="App">
          <nav
            className="navbar container"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <b className="navbar-item is-size-4 ">dÖblingBling</b>
              <label
                role="button"
                class="navbar-burger burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={e => {
                  e.preventDefault();
                  this.setState({ showMenu: !this.state.showMenu });
                }}
              >
                <span aria-hidden="true"></span>
              </label>
            </div>
              <div className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}>
                <Link to="/" className="navbar-item">
                  Products
                </Link>
              </div>
            </nav>
            <Switch>
              <Route exact path="/" component={ProductList} />
            </Switch>
          </div>
        </Router>
      </Context.Provider>
    );
  }
}
