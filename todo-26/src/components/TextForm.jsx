import { useState } from "react";

export default function TextForm({ onButtonClick, buttonText, placeholder }) {
  const [inputValue, setInputValue] = useState("");

  // Handle submit manually
  function handleSubmit(e) {
    e.preventDefault();
    onButtonClick(inputValue);
    setInputValue("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
      />
      <button disabled={inputValue.trim().length === 0}>{buttonText}</button>
    </form>
  );
}
