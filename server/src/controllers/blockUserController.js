const User = require("../models/user");
const { ErrorHandler } = require("../utils/ErrorHandler");

const blockUserController = async (req, res) => {
  console.log("🚀 ~ blockUserController ~ req:", req.body.payload);
  try {
    const { uid, blockId } = req.body.payload;
    if (!uid) return ErrorHandler("uid is required", 400, req, res);
    if (!blockId) return ErrorHandler("blockId is required", 400, req, res);

    const user = await User.findById(uid);
    if (!user) return ErrorHandler("User does not exist.", 404, req, res);

    let blockedUsers = user?.blockedUsers || [];

    if (blockedUsers.includes(blockId)) {
      return ErrorHandler("User is already blocked", 400, req, res);
    }

    blockedUsers.push(blockId);

    // Update the user document with blockedUsers and set blockStatus to true
    const updateUser = await User.findByIdAndUpdate(
      uid,
      { $set: { blockedUsers, blockStatus: true } },
      { new: true } // return updated doc
    );

    return res.json({
      success: true,
      message: "User blocked successfully.",
      data: updateUser,
    });
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = blockUserController;
