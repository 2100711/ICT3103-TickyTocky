const createUser = async (req, res) => {
  console.log("creating user..", req.body);
  const { fname, lname, password, email, address } = req.body;
  try {
    // do mongo processing thing before returning

    res.status(200).json({
      message: `hi ${fname} ${lname}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

export { createUser };
