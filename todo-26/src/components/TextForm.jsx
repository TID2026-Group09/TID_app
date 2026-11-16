import { useState } from "react";
import { TextField, Button } from "@mui/material";

export default function TextForm({
  onButtonClick,
  buttonText,
  label,
  placeholder,
}) {
  const [inputValue, setInputValue] = useState("");

  // Handle submit manually
  function handleSubmit(e) {
    e.preventDefault();
    onButtonClick(inputValue);
    setInputValue("");
  }

  return (
    <form className="layout-row layout-fill-first" onSubmit={handleSubmit}>
      <TextField
        size="small"
        label={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={inputValue.trim().length === 0}
      >
        {buttonText}
      </Button>
    </form>
  );
}
