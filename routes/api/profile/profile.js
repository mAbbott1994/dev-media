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

    profileFields.experience = {};

    if (req.body.title) profileFields.experience = req.body.title;
    if (req.body.company) profileFields.experience = req.body.company;
    if (req.body.location) profileFields.experience = req.body.location;
    if (req.body.from) profileFields.experience = req.body.from;
    if (req.body.to) profileFields.experience = req.body.to;
    if (req.body.current) profileFields.experience = req.body.current;
    if (req.body.description) profileFields.description = req.body.current;

    //education
    profileFields.education = {};

    if (req.body.school) profileFields.education.school = req.body.school;
    if (req.body.degree) profileFields.education.degree = req.body.degree;
    if (req.body.fieldofstufy)
      profileFields.education.fieldofstufy = req.body.fieldofstufy;
    if (req.body.from) profileFields.from = req.body.from;
    if (req.body.to) profileFields.education.to = req.body.to;
    if (req.body.current) profileFields.education.current = req.body.current;
    if (req.body.description)
      profileFields.education.description = req.body.description;

    //Social
    profileFields.social = {};

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linked;

    Profile.findOne({ user: req.user_id }).then(profile => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user_id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        Profile.find({handle: profileFields.handle}) 
          .then(user => {
            errors.handle =  'That handle already exists';
            return res.json(errors)
          });
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);


router.get('/:handle', (req, res) => {
  return res.json(req.body);
});

module.exports = router;
