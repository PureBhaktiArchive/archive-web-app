import algoliasearch from 'algoliasearch/lite';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Highlight, Hits, InstantSearch, Pagination, SearchBox } from 'react-instantsearch-dom';

const searchClient = algoliasearch(
  'A0IP7ZFQR8',
  '7d853e1791e8f7668cb942eeb76888ac'
);

const indexName = 'archive_app_dev';

class Algolia extends Component {
  render() {
    return (

      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
      >

        <SearchBox
          className="searchbox"
          translations={{
            placeholder: '',
          }}
        />

        <Hits hitComponent={Hit} />

        <Pagination />

      </InstantSearch>

    );
  }
}

function Hit(props) {
  return (
    <article>
      <h1>
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

export default Algolia;
