import React, { Component } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { Highlight, Hits, InstantSearch, Pagination, SearchBox } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import '../../styles/App.css';
import { css } from "styled-components/macro"; //eslint-disable-line





const searchClient = algoliasearch(
  process.env.REACT_APP_APPLICATION_ID,
  process.env.REACT_APP_API_KEY
);

const indexName = 'archive_app_dev';

class Agolia extends Component {
  render() {
    return (
      <div>
        <header className="header">
          <h1 className="header-title">
            <a href="/">Search Srila Gurudeva's audio files. algolia-instant-search-demo</a>
          </h1>
          <p className="header-subtitle">
            using{' '}
            <a href="https://github.com/algolia/react-instantsearch">
              React InstantSearch.
            </a>
          </p>
        </header>

        <div className="container">
          <InstantSearch searchClient={searchClient} indexName={indexName}>
            <div className="search-panel">
              <div className="search-panel__results">
                <SearchBox
                  className="searchbox"
                  translations={{
                    placeholder: '',
                  }}
                />
                <Hits hitComponent={Hit} />

                <div className="pagination">
                  <Pagination />
                </div>
              </div>
            </div>
          </InstantSearch>
        </div>
      </div>
    );
  }
}



function Hit(props) {
  return (
    <article>
      <h1 >
        <Highlight attribute="firstname" hit={props.hit} />
      </h1>
      <p>
        <Highlight attribute="lastname" hit={props.hit} />
      </p>
      <p>
        <Highlight attribute="zip_code" hit={props.hit} />
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default Agolia;