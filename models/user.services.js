const addGoogleUser =
  (User) =>
    ({ id, email, firstName, lastName, profilePhoto }) => {
      const user = new User({
        id,
        email,
        firstName,
        lastName,
        profilePhoto,
        source: "google",
      });
      return user.save();
    };

const addLocalUser =
  (User) =>
    ({ email, firstName, lastName, password }) => {
      const user = new User({
        email,
        firstName,
        lastName,
        password,
        source: "local",
      });
      return user.save();
    };



const getUserByEmail =
  (User) =>
    async ({ email }) => {
      return await User.findOne({ email });
    };

module.exports = (User) => {
  return {
    addGoogleUser: addGoogleUser(User),
    getUserByEmail: getUserByEmail(User),
  };
};
