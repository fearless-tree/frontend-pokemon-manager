function SearchBar({ value, onChange, placeholder = 'Zoeken...' }) {
  return (
    <input
      className="form-control form-control-lg"
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
    />
  );
}

export default SearchBar;
