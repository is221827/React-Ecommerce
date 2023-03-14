import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
//import jwt_decode from 'jwt-decode';

//import AddProduct from './components/AddProduct';
//import Cart from './components/Cart';
import ProductList from './components/ProductList';

import Context from "./Context";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
    this.routerRef = React.createRef();
  }

  async componentDidMount() {
    const products = await axios.get('https://webshop-fe.azurewebsites.net/api/products');
    this.setState({ products: products.data });
  }

  /*addProduct = (product, callback) => {
    let products = this.state.products.slice();
    products.push(product);
    //??
    this.setState({ products }, () => callback && callback());
  };*/

  buyProduct = articleId => {
    if (products[articleId].amount > 0) {
      const response = axios.get('https://webshop-fe.azurewebsites.net/api/order/'+articleId);
      if (response.status == 200) {
        let products = this.state.products.slice();
        products[articleId].amount -= 1;
        this.setState({products}, () => callback && callback());
      } else 
      {
        return "nono";
      }
    }
    /*let cart = this.state.cart;
    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }
    //there might be a fuckup here. product.stock????
    if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
      cart[cartItem.id].amount = cart[cartItem.id].product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });*/
  };

  /*removeFromCart = cartItemId => {
    let cart = this.state.cart;
    delete cart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  clearCart = () => {
    let cart = {};
    localStorage.removeItem("cart");
    this.setState({ cart });
  };

  checkout = () => {
    const cart = this.state.cart;

    const products = this.state.products.map(p => {
      if (cart[p.name]) {
        p.stock = p.stock - cart[p.name].amount;

        axios.get('https://webshop-fe.azurewebsites.net/api/order/%7Barticleid%7D')
        // here is sms stuff missing
      }
      return p;
    });

    this.setState({ products });
    this.clearCart();
  };*/

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          buyProduct: this.addToCart,
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
              <b className="navbar-item is-size-4 ">ecommerce</b>
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
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </label>
            </div>
              <div className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}>
                <Link to="/products" className="navbar-item">
                  Products
                </Link>
              </div>
            </nav>
            <Switch>
              <Route exact path="/" component={ProductList} />
              <Route exact path="/products" component={ProductList} />
            </Switch>
          </div>
        </Router>
      </Context.Provider>
    );
  }
}
