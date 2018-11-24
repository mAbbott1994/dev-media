const router = require("express").Router();
const passport = require("passport");
const Post = require("../../../models/Post");
const Profile = require("../../../models/Profile");

const validatePostInput = require("../../../middleware/rules/post");

/**
 * @route GET /api/posts/test
 * @desc Test route
 * @access public
 */
router.get("/test", (req, res) => {
	return res.json("test route works");
});

/**
 * @route GET /api/posts/
 * @desc get posts
 * @access public
 */

router.get("/", (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => {
			if (posts.length === 0) {
				return res.status(404).json({ errors: "No posts found" });
			}
			return res.status(200).json(posts);
		})
		.catch(() => {
			return res.status(404).json({ errors: "No posts found" });
		});
});

/**
 * @route GET /api/posts/:id
 * @desc get posts
 * @access public
 */

router.get("/:id", (req, res) => {
	Post.findById(req.params.id)
		.then(post => {
			const errors = {};
			if (!post) {
				error.nopost = "There is no post";
				res.status(404).json(errors);
			}
			res.status(200).json(post);
		})
		.catch(() => {
			res.status(404).json({ nopostsfound: "No post found" });
		});
});

/**
 * @route POST /api/posts/
 * @desc Create posts
 * @access private
 */

router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		const newPost = new Post({
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.name,
			user: req.user.id
		});

		newPost.save().then(post => res.status(200).json(post));
	}
);

/**
 * @route DELETE /api/posts/:id
 * @desc Delete post
 * @access private
 */

router.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(() => {
			Post.findById(req.params.id).then(post => {
				if (post.user.toString() !== req.user.id) {
					return res.status(401).json({
						authorisation: "User not authorised"
					});
				}
				Post.remove()
					.then(() => res.status(200).json({ success: true }))
					.catch(() => res.status(404).json({ postnotfound: "no post found" }));
			});
		});
	}
);

/**
 * @route POST /api/posts/like/:id
 * @desc Like post
 * @access private
 */

router.post(
	"/like/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(() => {
			Post.findById(req.params.id).then(post => {
				if (
					post.likes.filter(like => like.user.toString() === req.user.id)
						.length > 0
				) {
					return res
						.status(400)
						.json({ liked: "User already liked this post" });
				}

				post.likes.unshift({ user: req.user.id });
				post.save().then(post => res.status(200).then({ success: true, post }));
			});
		});
	}
);

/**
 * @route POST /api/posts/unlike/:id
 * @desc Unlike post
 * @access private
 */

router.post(
	"/unlike/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(() => {
			Post.findById(req.params.id).then(post => {
				if (
					post.likes.filter(like => like.user.toString() === req.user.id)
						.length == 0
				) {
					return res
						.status(400)
						.json({ notliked: "You have not liked this post" });
				}
				const removeIndex = post.likes
					.map(item => item.user.toString())
					.indexOf(req.user.id);

				post.likes.splice(removeIndex, 1);

				post.save().then(post => res.status(200).json({ success: true, post }));
			});
		});
	}
);

module.exports = router;
