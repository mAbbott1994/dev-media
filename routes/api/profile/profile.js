const router = require("express").Router();
const passport = require("passport");
const Profile = require("../../../models/Profile");
const User = require("../../../models/User");
const validateProfileInput = require("../../../middleware/rules/profile");
const validateExpierenceInput = require("../../../middleware/rules/experience");
const validateEducationInput = require("../../../middleware/rules/edu");

/**
 * @route GET /api/profile/test
 * @description Test route
 * @access public
 */

router.get("/test", (req, res) => {
	res.json("route works");
});

/**
 * @route GET /api/profile/
 * @description GET current user profile
 * @access Private
 */

router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const errors = {};
		Profile.findOne({ user: req.user.id })
			.populate("user", { name: "name", avatar: "avatar" })
			.then(profile => {
				if (!profile) {
					errors.profile = "There is no profile for this user";
					res.status(404).json(errors);
				}
				res.json(profile);
			})
			.catch(err => res.status(404).json(err));
	}
);

/**
 * @route GET /api/profile/:handle
 * @description GET  user profile by handle
 * @access public
 */

router.get("/handle/:handle", (req, res) => {
	const errors = {};

	Profile.findOne({ handle: req.params.handle })
		.populate("user", { name: "name", avatar: "avatar" })
		.then(profile => {
			if (!profile) {
				errors.profile = "There is no profile for this user";
				res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err =>
			res.status(404).json({ profile: "There is no profile for this user" })
		);
});

/**
 * @route GET /api/user/:user_id
 * @description GET user profile by user_id
 * @access public
 */

router.get("/user/:user_id", (req, res) => {
	const errors = {};

	Profile.findOne({ user: req.params.user_id })
		.populate("user", { name: "name", avatar: "avatar" })
		.then(profile => {
			if (!profile) {
				errors.noprofile = "No profile for this user";
				res.status(404).json(errros);
			}
			res.json(profile);
		})
		.catch(err =>
			res.status(404).json({ profile: "There is no profile for this user" })
		);
});
/**
 * @route GET /api/profile/all
 * @description GET all user profiles
 * @access public
 */

router.get("/all", (req, res) => {
	Profile.find()
		.populate("user", { name: "name", avatar: "avatar" })
		.then(profiles => {
			if (!profiles) {
				errors.noprofiles = "No profiles found";
				res.status(404).json(errors);
			}
			res.status(200).json(profiles);
		})
		.catch(err => {
			res.status(404).json({ profile: "No profiles found" });
		});
});

/**
 * @route POST api/profile/
 * @description create user profile
 * @access Private
 */

router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateProfileInput(req.body);

		// Check Validation
		if (!isValid) {
			// Return any errors with 400 status
			return res.status(400).json(errors);
		}

		// Get fields
		const profileFields = {};
		profileFields.user = req.user.id;
		if (req.body.handle) profileFields.handle = req.body.handle;
		if (req.body.company) profileFields.company = req.body.company;
		if (req.body.website) profileFields.website = req.body.website;
		if (req.body.location) profileFields.location = req.body.location;
		if (req.body.bio) profileFields.bio = req.body.bio;
		if (req.body.status) profileFields.status = req.body.status;
		if (req.body.githubusername)
			profileFields.githubusername = req.body.githubusername;
		// Skills - Spilt into array
		if (typeof req.body.skills !== "undefined") {
			profileFields.skills = req.body.skills.split(",");
		}

		// Social
		profileFields.social = {};
		if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
		if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
		if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
		if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
		if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

		Profile.findOne({ user: req.user.id }).then(profile => {
			if (profile) {
				// Update
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				).then(profile => res.json(profile));
			} else {
				// Check if handle exists
				Profile.findOne({ handle: profileFields.handle }).then(profile => {
					if (profile) {
						errors.handle = "That handle already exists";
						res.status(400).json(errors);
					}
					// Save Profile
					new Profile(profileFields).save().then(profile => res.json(profile));
				});
			}
		});
	}
);

/**
 * @route POST /api/profile/expereence
 * @desc add experience to profile
 * @access Private
 */

router.post(
	"/experience",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateExpierenceInput(req.body);

		// Check Validation
		if (!isValid) {
			// Return any errors with 400 status
			return res.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id }).then(profile => {
			const newExp = {
				title: req.body.title,
				company: req.body.company,
				location: req.body.location,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			};

			profile.experience.unshift(newExp);
			profile
				.save()
				.then(profile => res.status(200).json(profile))
				.catch(err => res.json(err));
		});
	}
);

/**
 * @route POST /api/profile/edu
 * @desc add edu to profile
 * @access Private
 */

router.post(
	"/education",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateEducationInput(req.body);

		// Check Validation
		if (!isValid) {
			// Return any errors with 400 status
			return res.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id }).then(profile => {
			const newEdu = {
				school: req.body.school,
				degree: req.body.degree,
				fieldofstudy: req.body.fieldofstudy,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			};

			// Add to exp array
			profile.education.unshift(newEdu);

			profile
				.save()
				.then(profile => res.json(profile))
				.catch(err => res.json(err));
		});
	}
);

/**
 * @route DELETE /api/profile/experience/:exp_id
 * @desc Delete experience from profile
 * @access Private
 */

router.delete(
	"/experience/:exp_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			//remove index
			const removeIndex = profile.experience
				.map(item => item.id)
				.indexOf(req.params.exp_id);

			profile.experience.splice(removeIndex, 1);
			profile.save().then(profile =>
				res
					.status(200)
					.json(profile)
					.catch(err => res.status(404).json(err))
			);
		});
	}
);

/**
 * @route DELETE /api/profile/education/:edu_id
 * @desc Delete education from profile
 * @access Private
 */

router.delete(
	"/education/:edu_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			//remove index
			const removeIndex = profile.education
				.map(item => item.id)
				.indexOf(req.params.exp_id);

			profile.education.splice(removeIndex, 1);
			profile.save().then(profile =>
				res
					.status(200)
					.json(profile)
					.catch(err => res.status(404).json(err))
			);
		});
	}
);

/**
 * @route DELETE /api/profile/
 * @desc Delete user & profile
 * @access Private
 */

router.get(
	"/api/profile/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOneAndRemove({ user: req.user.id }).then(() => {
			U;
		});
	}
);

module.exports = router;
