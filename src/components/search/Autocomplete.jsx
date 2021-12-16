import React, { useState } from 'react';
import styles from '../../styles/Search.module.css';

const AutoComplete = ({ suggestions, placeholder, isBarView, onInputChange }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState('');
  const onChange = (e) => {
    const userInput = e.target.value;
    const unLinked = suggestions.filter(
      (suggestion) => { return suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1; },
    );

    setInput(e.target.value);
    setFilteredSuggestions(unLinked);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
    onInputChange(e);
  };
  const onClick = (e) => {
    setFilteredSuggestions([]);
    setInput(e.target.innerText);
    setActiveSuggestionIndex(0);
    setShowSuggestions(false);
    onInputChange(e);
  };
  const SuggestionsListComponent = () => {
    return filteredSuggestions.length ? (
      <ul className={styles.suggestions}>
        {filteredSuggestions.map((suggestion, index) => {
          return (
            <li className={styles.suggestionsLi} key={suggestion} onClick={onClick}>
              {suggestion}
            </li>
          );
        })}
      </ul>
    ) : (<ul className={styles.suggestions}>
      <li className={styles.noSuggestions}>
        <em>No Result</em>
      </li>
    </ul>
    );
  };
  return (
    <>
      <input
        className={isBarView ? styles.miniSearchInput : styles.autocompleteInput}
        placeholder={placeholder}
        type="text"
        onChange={onChange}
        value={input}
      />
      {showSuggestions && input && <SuggestionsListComponent />}
    </>
  );
};
export default AutoComplete;
