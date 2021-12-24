import React from 'react';

export default function AutoComplete({ suggestions }) {
  return (
    <datalist id="suggestions">
      {suggestions.map(suggestion => <option value={suggestion} key={suggestion} />)}
    </datalist>
  );
}
