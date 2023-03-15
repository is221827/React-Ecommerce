import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
import ProductList from './components/ProductList';
//import './App.css';

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
    const products = await axios.get('https://webshop-fe.azurewebsites.net/api/products/');
    this.setState({ products: products.data });
  }

  async queueSms(articleId) {
    // Retrieve the connection from an environment
    // variable called AZURE_STORAGE_CONNECTION_STRING
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    // Create a unique name for the queue
    const queueName = "msgquue";

    // Instantiate a QueueServiceClient which will be used
    // to create a QueueClient and to list all the queues
    const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);

    // Get a QueueClient which will be used
    // to create and manipulate a queue
    const queueClient = queueServiceClient.getQueueClient(queueName);

    // Create the queue
    //await queueClient.create();

    messageText = 'Sold ' + articleId + ' ### \o/!';
    console.log("Adding message to the queue: ", messageText);

    // Add a message to the queue
    await queueClient.sendMessage(messageText);
  }

  buyProduct = article_number => {
    const products = this.state.products.slice();
    let index = products.findIndex(product => product.article_number === article_number);
    if (products[index].items_available > 0) {
      axios.post('https://webshop-fe.azurewebsites.net/api/order/'+article_number+'/')
      .then( response => {
        console.log(response);
        if (response.status === 200) {
          this.queueSms(article_number);
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
