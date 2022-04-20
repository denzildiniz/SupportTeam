

const registerUser = async (req, res) => {
  console.log(req.body);
  res.status(201).send('register')
};

const loginUser = async (req, res) => {
    console.log(req.body);
  res.status(201).json('login')
};

const logoutUser = async (req, res) => {
  console.log("register user");
  res.status(200).json('logOut')
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
