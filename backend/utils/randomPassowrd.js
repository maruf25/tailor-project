const generateRandomPassword = (length = 6) => {
  // Define the characters set: uppercase, lowercase letters, and numbers
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  // Generate a random password of the specified length
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
};

exports.generateRandomPassword = generateRandomPassword;
