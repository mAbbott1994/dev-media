const router = require("express").Router();
const validateProfileInput = require("../../../middleware/rules/profile");
const passport = require("passport");
const Profile = require("../../../models/Profile");
const User = require("../../../models/User");

/**
 * @route GET api/profile/
 * @description Get current users profile if there logged in
 * @access Private
 */

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        errors.noprofile = "No profile found";
        return res.status(404).json(errors);
      }
      res.json(profile);
    });
  }
);

/**
 * @route POST api/profile
 * @description Update or edit user profile
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};

    //get user details that aren't apart of the form
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;

    if (req.body.company) profileFields.comapny = req.body.company;

    if (req.body.website) profileFields.website = req.body.website;

    if (req.body.location) profileFields.location = req.body.location;

    if (req.body.bio) profileFields.bio = req.body.bio;

    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = profileFields.skills.split(",");
    }

    //education
    profileFields.education = {};


    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linked;


  }
);











router.get("/:user_id", (req, res) => {
  const errrors = {};

  console.log(req.params.user_id);
  Profile.findById(req.params.user_id)
    .then(profile => {
      if (!profile) {
        errors.profile = "Profile not found";
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => {
      return res.status(404).json({
        err: err,
        profile: "No profile found for this user"
      });
    });
});

module.exports = router;
