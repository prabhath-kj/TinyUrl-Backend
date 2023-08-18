import Url from "../db/models/url.js";

const resolvers = {
  Query: {
    urls: async () => {
      try {
        return await Url.find();
      } catch (error) {
        throw new Error("Unable to fetch URLs");
      }
    }
  },

  Mutation: {
    createUrl: async (_, { originalUrl }) => {
      try {
        // Check if the original URL already exists in the database
        const existingUrl = await Url.findOne({ originalUrl });

        if (existingUrl) {
          return {
            originalUrl: existingUrl.originalUrl,
            shortCode: existingUrl.shortCode,
            error: "URL already exists",
          };
        }

        // Generate a new short code and create a new URL
        const shortCode = Math.random().toString(36).substring(7);
        const newURL = new Url({ originalUrl, shortCode });
        await newURL.save();

        return {
          originalUrl,
          shortCode,
          error: null,
        };
      } catch (error) {
        return {
          originalUrl: null,
          shortCode: null,
          error: "Unable to create URL",
        };
      }
    },
    trackClick: async (_, { shortCode }) => {
      try {
        const url = await Url.findOneAndUpdate(
          { shortCode: shortCode },
          {
            $inc: { "analytics.clicks": 1 },
            $set: { "analytics.lastClickedAt": new Date() },
          },
          { new: true }
        );
        if (!url) {
          throw new Error("URL not found");
        }
        return url?.analytics?.clicks;
      } catch (error) {
        throw new Error("Error tracking click");
      }
    },
  },
};

export default resolvers;
