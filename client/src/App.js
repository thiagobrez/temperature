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
      <div className='container'>
        <Navbar/>
        <div className="main">
          <div className="search">
            <form className="address" onSubmit={this.createSearch}>
              <TextInput type="text"
                         placeholder="Enter an address"
                         value={expression}
                         onChange={event => this.setState({expression: event.target.value})}
              />
              <Button type="submit"
                      disabled={!expression}>
                show me the current temperature
              </Button>
            </form>
            <div className="result">
              {
                search ?
                  <Fragment>
                    <div className="result-address">
                        <span className="result-address-text">
                          {this.formatResult(search.address)}
                        </span>
                    </div>
                    <div className="result-temperature">
                        <span className="result-temperature-text">
                          {search.address.temperature}° F
                        </span>
                    </div>
                  </Fragment> :
                  loading.search[CREATE_SEARCH] ?
                    <div className="result-loading">
                      <Loading/>
                    </div> :
                    error.search[CREATE_SEARCH] ?
                      <div className="result-error">
                        <span className="result-error-text">
                          Sorry, we couldn't find the address you're looking for
                        </span>
                      </div> :
                      <div className="result-empty">
                        <span className="result-empty-text">
                          Search something!
                        </span>
                      </div>
              }
            </div>
          </div>
          <div className="history">
            <div className="history-title">
              <span className="history-title-text">
                History
              </span>
            </div>
            <div className="history-list">
              {
                loading.search[READ_SEARCHES] ?
                  <Loading/> :
                  data.search.length ?
                    data.search.map(search => (
                      <Search expression={search.expression}
                              created_at={search.created_at}
                              temperature={search.address.temperature}
                              formatted_address={search.address.formatted_address}
                              key={search.created_at}
                      />
                    )) :
                    <span className="history-empty-text">
                    No search history found :/
                  </span>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
