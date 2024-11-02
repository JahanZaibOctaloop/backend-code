let blacklistedTokens = [];

const addToBlacklist = (token) => {
  blacklistedTokens.push(token);
};

const isBlacklisted = (token) => {
  return blacklistedTokens.includes(token);
};

module.exports = { addToBlacklist, isBlacklisted };
