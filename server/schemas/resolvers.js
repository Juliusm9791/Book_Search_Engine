const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find({}).populate('savedBooks');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('savedBooks');
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },

  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    deleteBook: async (parent, { bookId }) => {
      // if (context.user) {

      const context = {
        _id: "61f61147dbfc827e08210774"
      }
      console.log('0000', context._id , bookId);
      return User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      // }
      // throw new AuthenticationError('You need to be logged in!');
    },

    saveBook: async (parent, args, context) => {
      console.log(args, "1111");
      console.log('0000', context._id);
      // if (context.user) {
      return User.findOneAndUpdate(
        { _id: context._id },
        { $addToSet: { savedBooks: { ...args } } },
        { new: true }
      );
      // }
      // throw new AuthenticationError('You need to be logged in!');
    },





  },
};

module.exports = resolvers;


// bookId: args.bookId, description: args.description, image: args.image, link: args.link, title: args.title