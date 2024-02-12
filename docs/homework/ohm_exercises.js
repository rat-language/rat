import { grammar } from './hwcore.js'; // Assuming this is where your grammars are defined

/**
 * Checks if a given string matches a specific pattern based on the provided grammar.
 * @param {string} name - The name of the pattern to match against.
 * @param {string} string - The string to test.
 * @returns {boolean} - True if the string matches the pattern, false otherwise.
 */
function matches(name, string) {
  // Assuming 'grammar' is an object where keys are pattern names and values are Ohm grammars
  const patternGrammar = grammar[name];
  if (!patternGrammar) {
    console.error(`Grammar for pattern "${name}" not found.`);
    return false;
  }

  const matchResult = patternGrammar.match(string);
  return matchResult.succeeded();
}

export { matches };
