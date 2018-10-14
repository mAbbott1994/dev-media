const router = require("express").Router();
const User = require("../../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const key = require("../../../config/keys/keys");
const passport = require("passport");
const validateRegInput = require('../../../middleware/rules/register');
const validateLoginInput = require('../../../middleware/rules/login');

const jwt = require("jsonwebtoken");

/**
 * @route POST api/authentication/register
 * @description Register route for account creation
 * @access Public
 */
router.post("/register", (req, res) => {
  const { errors, isValid} = validateRegInput(req.body);
  const { name, email, password } = req.body;

  if (!isValid) {
    return res.status(400).json(errors)
  }
  User.findOne({ email }).then(user => {
    if (user) {
      errors.email =  "Email already exists"
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      const newUser = new User({
        name,
        email,
        avatar,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.status(200).json(user);
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

/**
 * @route POST api/authentication/login
 * @description Login the user / Returned JWT Token
 * @access Public
 */

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid} = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "Email not found";
      return res.status(404).json(errors);
    }
    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

        jwt.sign(
          payload,
          key.jwt.secret,
          { expiresIn: 14400 },
          (err, token) => {
            res.status(200).json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Incorrect Password";
        return res.status(400).json(errors);
      }
    });
  });
});

/**
 * @route GET api/users/current
 * @description Return current user
 * @access Private
 */

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      createdAt: req.user.createdAt,
    });
  }
);

module.exports = router;
