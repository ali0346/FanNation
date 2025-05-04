// backend/models/index.js
const sequelize = require('../config/db');

// === require each model separately ===
const User        = require('./user.model');
const Category    = require('./category.model');
const Thread      = require('./thread.model');
const Poll        = require('./poll.model');
const PollOption  = require('./pollOption.model');
const PollVote    = require('./pollVote.model');
const Role       = require('./role.model');
const Comment  = require('./comment.model');

// ——————————————————————————————————————————————————————————————
// Thread ↔ User
User.hasMany(Thread,    { foreignKey: 'user_id' });
Thread.belongsTo(User,  { foreignKey: 'user_id' });

// Thread ↔ Category
Category.hasMany(Thread,    { foreignKey: 'category_id' });
Thread.belongsTo(Category,  { foreignKey: 'category_id' });

// User ↔ Category (follows)
User.belongsToMany(Category, {
  through: 'user_followed_categories',
  foreignKey: 'user_id',
  otherKey:  'category_id',
  timestamps: false
});
Category.belongsToMany(User, {
  through: 'user_followed_categories',
  foreignKey: 'category_id',
  otherKey:  'user_id',
  timestamps: false
});

// ——————————————————————————————————————————————————————————————
// Poll ↔ PollOption
Poll.hasMany(PollOption,    { foreignKey: 'poll_id', as: 'PollOptions' });
PollOption.belongsTo(Poll,  { foreignKey: 'poll_id', as: 'Poll' });

// PollOption ↔ User (votes) via poll_votes
PollOption.belongsToMany(User, {
  through: 'poll_votes',
  foreignKey: 'option_id',
  otherKey:  'user_id',
  timestamps: false
});
User.belongsToMany(PollOption, {
  through: 'poll_votes',
  foreignKey: 'user_id',
  otherKey:  'option_id',
  timestamps: false
});

// Poll ↔ User (creator)
User.hasMany(Poll,           { foreignKey: 'user_id', as: 'CreatedPolls' });
Poll.belongsTo(User,         { foreignKey: 'user_id', as: 'Creator' });

// Poll ↔ Category
Category.hasMany(Poll,       { foreignKey: 'category_id' });
Poll.belongsTo(Category,     { foreignKey: 'category_id' });

// User ↔ Role (many-to‑many)
User.belongsToMany(Role, {
  through: 'user_roles',
  foreignKey: 'user_id',
  otherKey:  'role_id',
  timestamps: false
});

Role.belongsToMany(User, {
  through: 'user_roles',
  foreignKey: 'role_id',
  otherKey:  'user_id',
  timestamps: false
});


// Comments ↔ Thread
Thread.hasMany(Comment,   { foreignKey: 'thread_id' });
Comment.belongsTo(Thread, { foreignKey: 'thread_id' });
// User ↔ Comment
User.hasMany(Comment,   { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });
// export everything
module.exports = {
  sequelize,
  User,
  Category,
  Thread,
  Poll,
  PollOption,
  PollVote,
  Role,
  Comment
};
