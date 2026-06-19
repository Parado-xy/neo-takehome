// --- Pre-processing & Validation Functions ---

function isNotEmpty(text) {
  return text && text.trim().length > 0;
}

function hasMinimumLength(text, min = 10) {
  return text && text.trim().length >= min;
}

// Basic heuristic: checks if the majority of characters are standard ASCII letters.
// For production use, consider installing a library like 'franc'.
function isBasicEnglish(text) {
  if (!text) return false;
  const justLetters = text.replace(/[^a-zA-Z]/g, "");
  const totalNonWhitespace = text.replace(/\s/g, "").length;

  if (totalNonWhitespace === 0) return false;
  // If more than 70% of the non-whitespace characters are standard English letters
  return justLetters.length / totalNonWhitespace > 0.7;
}

function preprocessMessage(message) {
  // Handle case where message is a string, or an object with text/body/content fields
  const content =
    typeof message === "string"
      ? message
      : message.text || message.body || message.content || "";

  if (!isNotEmpty(content))
    return { valid: false, reason: "Message is empty or null." };
  if (!hasMinimumLength(content))
    return { valid: false, reason: "Message is too short." };
  if (!isBasicEnglish(content))
    return { valid: false, reason: "Message failed English heuristic." };

  return { valid: true, content };
}

module.exports = {
  preprocessMessage,
};
