import algoliasearch from 'algoliasearch/lite';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  connectHits,
  connectSearchBox,
  Highlight,
  InstantSearch,
  Pagination,
  PoweredBy,
  RefinementList,
} from 'react-instantsearch-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import '../../styles/App.css';

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col lg:flex-row lg:items-center max-w-screen-xl mx-auto py-20 md:py-24`;
const LeftColumn = tw.div`relative lg:w-5/12 text-center max-w-lg mx-auto lg:max-w-none lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex-1 flex flex-col justify-center lg:self-end`;

const Actions = styled.div`
  ${tw`relative max-w-md text-center mx-auto lg:mx-0`}

  input {
    ${tw`sm:pr-48 pl-8 py-4 sm:py-5 rounded-full border-2 w-full font-medium focus:outline-none transition duration-300  focus:border-primary-500 hover:border-gray-500`}
  }
  button {
    ${tw`w-full sm:absolute right-0 top-0 bottom-0 bg-primary-500 text-gray-100 font-bold mr-2 my-4 sm:my-2 rounded-full py-4 flex items-center justify-center sm:w-40 sm:leading-none focus:outline-none hover:bg-primary-900 transition duration-300`}
  }
`;

const Divider = styled.div`
  ${tw`m-5 border-b-2 border-solid border-secondary-300`}
`;

const CustomStyledSearchBox = ({
  currentRefinement,
  isSearchStalled,
  refine,
}) => (
  <Actions>
    <form noValidate action="" role="search">
      <input
        type="search"
        placeholder="Search audio files..."
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
        autoFocus={true}
      />
      <button onClick={() => refine('')}>Search Audio Files</button>
      {isSearchStalled ? 'My search is stalled' : ''}
    </form>
  </Actions>
);

const CustomSearchBox = connectSearchBox(CustomStyledSearchBox);

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APPLICATION_ID,
  process.env.REACT_APP_ALGOLIA_API_KEY
);

const indexName = process.env.REACT_APP_ALGOLIA_INDEX;

class Agolia extends Component {
  render() {
    return (
      <div>
        <header className="header">
          <h1 className="header-title">
            <a href="/">
              Search Srila Gurudeva's audio files. algolia-instant-search-demo
            </a>
          </h1>
          <p className="header-subtitle">
            using{' '}
            <a href="https://github.com/algolia/react-instantsearch">
              React InstantSearch.
            </a>
          </p>
        </header>

        <Container>
          <TwoColumn>
            <InstantSearch searchClient={searchClient} indexName={indexName}>
              <LeftColumn>
                <Divider>Language</Divider>

                <RefinementList
                  attribute="Language"
                  transformItems={(items) =>
                    items.map((item) => ({
                      ...item,
                      label: item.label.toUpperCase(),
                    }))
                  }
                />

                <Divider>Location</Divider>

                <RefinementList
                  attribute="Location"
                  transformItems={(items) =>
                    items.map((item) => ({
                      ...item,
                      label: item.label.toUpperCase(),
                    }))
                  }
                />
              </LeftColumn>

              <RightColumn>
                <div className="search-panel">
                  <div className="search-panel__results">
                    <PoweredBy
                      classname={{ backgroundColor: 'green' }}
                      translations={{
                        searchBy:
                          'Blessings sprinkled by Srila Gurudeva. Search function provided by',
                      }}
                    />
                    <CustomSearchBox />
                    <CustomHits hitComponent={Hit} />

                    <div className="pagination">
                      <Pagination />
                    </div>
                  </div>
                </div>
              </RightColumn>
            </InstantSearch>
          </TwoColumn>
        </Container>
      </div>
    );
  }
}

const Hits = ({ hits }) => (
  <ol>
    {hits.map((hit) => (
      <div key={hit.objectID}>
        {hit.Category}, {hit.Date}, {hit.Duration}, {hit.Language}
      </div>
    ))}
  </ol>
);

const CustomHits = connectHits(Hits);

function Hit(props) {
  return (
    <article>
      <h1>
        <Highlight attribute="% of Gurudeva" hit={props.hit} />
      </h1>
      <p>
        <Highlight attribute="Category" hit={props.hit} />
      </p>
      <p>
        <Highlight attribute="Date" hit={props.hit} />
      </p>
      <p>
        <Highlight attribute="Duration" hit={props.hit} />
      </p>
      <p>
        <Highlight attribute="Location" hit={props.hit} />
      </p>
      <p>
        <Highlight attribute="Language" hit={props.hit} />
      </p>
      <p>
        <Highlight attribute="Sound Quality" hit={props.hit} />
      </p>
      <p>
        <Highlight attribute="Title" hit={props.hit} />
      </p>
      <p>
        <Highlight attribute="Topics" hit={props.hit} />
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default Agolia;
