// Basic (local) collections
// we use {connection: null} to prevent them from syncing with our not existing Meteor server
Users = new Mongo.Collection('users', {connection: null});
UsersPersistent = new PersistentMinimongo(Users);

Campaigns = new Mongo.Collection('campaigns', {connection: null});
CampaignsPersistent = new PersistentMinimongo(Campaigns);