import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import * as searchActions from './actions/searchActions'
import {CREATE_SEARCH, READ_SEARCHES} from "./utils/constants";
import {
  Navbar,
  TextInput,
  Button,
  Search,
  Loading
} from './components';
import './App.css';

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      search: bindActionCreators(searchActions, dispatch),
    }
  }
};

const mapStateToProps = state => {
  return {
    data: {
      search: state.search.data,
    },
    loading: {
      search: state.search.loading
    },
    error: {
      search: state.search.error
    }
  }
};

class App extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      expression: '',
      search: null
    };
    
    props.actions.search.readSearches();
  }
  
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.loading.search[CREATE_SEARCH] && !nextProps.loading.search[CREATE_SEARCH]) {
      this.setState({
        search: nextProps.error.search[CREATE_SEARCH] ? null : nextProps.data.search[0]
      })
    }
  }
  
  formatResult = address => {
    return address.city && address.state ?
      `${address.city}, ${address.state}` :
      address.formatted_address;
  };
  
  createSearch = e => {
    e.preventDefault();
    
    const {actions} = this.props;
    const {expression} = this.state;
    
    this.setState({
      search: null,
      expression: ''
    });
    
    actions.search.createSearch(expression);
  };
  
  render() {
    
    const {data, loading, error} = this.props;
    const {expression, search} = this.state;
    
    return (
      <div className="container div-1">
          <span className="text">
            Div 1
          </span>
        <div className="container div-2">
            <span className="text">
              Div 2
            </span>
          <div className="container div-3">
              <span className="text text-3">
                Div 3
              </span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
