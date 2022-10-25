function generateRandomString(): string {
  return Math.random().toString(36).substring(2, 5);
}

export default {
  generateRandomString
};
