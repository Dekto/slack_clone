import React from 'react';
import classNames from 'classnames';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Button';
import './styles.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.handleInputVal = this.handleInputVal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
  }

  componentDidMount() {
    const { setQuery } = this.props;

    if (setQuery) {
      this.focus();
    }
  }

  focus() {
    this.input.current.focus();
  }

  handleSubmit(e) {
    e.preventDefault();

    const { fetchSearchRequest, searchQuery } = this.props;

    if (fetchSearchRequest) {
      fetchSearchRequest(searchQuery);
    }
  }

  handleInputVal(e) {
    const { setQuery } = this.props;
    setQuery(e.target.value);
  }

  handleClearClick() {
    const { setQuery, destroySearchQuery } = this.props;

    destroySearchQuery();

    if (setQuery) {
      setQuery('');
      this.focus();
    }
  }

  handleModalOpen(e) {
    e.preventDefault();

    const { openSearchModal } = this.props;
    openSearchModal();
  }

  render() {
    const { savedQuery, searchQuery, isDisabled } = this.props;

    const searchClassNames = classNames('SearchBar', {
      'SearchBar--disabled': isDisabled,
      'SearchBar--queried': savedQuery || searchQuery,
      'SearchBar--empty': !savedQuery && !searchQuery,
    });

    return (
      <form className={searchClassNames} onSubmit={this.handleSubmit}>
        <div className="SearchBar__hoverable">
          <div className="SearchBar__disabled-overlay" role="presentation" onClick={this.handleModalOpen} />
          <Button type="submit" buttonFor="searchbar" unStyled disabled={isDisabled}>
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          <input
            type="text"
            ref={this.input}
            className="SearchBar__input"
            value={searchQuery || savedQuery}
            onChange={this.handleInputVal}
            placeholder="Search"
            disabled={isDisabled}
          />
        </div>
        {(savedQuery || searchQuery) && (
          <Button onClick={this.handleClearClick} buttonFor="clear" unStyled>
            {isDisabled || 'Clear'}
            {isDisabled && <FontAwesomeIcon icon="times" />}
          </Button>
        )}
      </form>
    );
  }
}

export default SearchBar;
