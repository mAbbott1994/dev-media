const router = require("express").Router();
const validateProfileInput = require("../../../middleware/rules/profile");
const passport = require("passport");
const User = require("../../../models/User");

// @route   get api/profile/:User_id
// @desc    Get user by id
// @access  Private

router.get("/:User_id", (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  const profileUpdates = {};

  User.findById({ user: req.params.User_id })
    .then(profile => {
      if (!profile) {
        errors.profile = "Profile not found";
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => {
      return res.status(404).json({
        profile: "No profile found for this user"
      });
    });
});

module.exports = router;
