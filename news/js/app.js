// Generated by CoffeeScript 1.3.3

/*
# ownCloud - News app
#
# @author Bernhard Posselt
# Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
#
# This file is licensed under the Affero General Public License version 3 or later.
# See the COPYING-README file
#
*/


(function() {
  var app, markingRead, scrolling,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = angular.module('News', []).config(function($provide) {
    $provide.value('MarkReadTimeout', 500);
    return $provide.value('ScrollTimeout', 500);
  });

  app.run([
    'PersistenceNews', function(PersistenceNews) {
      return PersistenceNews.loadInitial();
    }
  ]);

  $(document).ready(function() {
    $('#feeds li').click(function() {
      return $('#feed_items').scrollTop(0);
    });
    return $('#feed_items').scrollTop(0);
  });

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  scrolling = true;

  markingRead = true;

  angular.module('News').directive('whenScrolled', [
    '$rootScope', 'MarkReadTimeout', 'ScrollTimeout', function($rootScope, MarkReadTimeout, ScrollTimeout) {
      return function(scope, elm, attr) {
        return elm.bind('scroll', function() {
          if (scrolling) {
            scrolling = false;
            setTimeout(function() {
              return scrolling = true;
            }, ScrollTimeout);
            if (markingRead) {
              markingRead = false;
              setTimeout(function() {
                markingRead = true;
                return $(elm).find('.feed_item:not(.read)').each(function() {
                  var feed, id, offset;
                  id = parseInt($(this).data('id'), 10);
                  feed = parseInt($(this).data('feed'), 10);
                  offset = $(this).position().top;
                  if (offset <= -50) {
                    return $rootScope.$broadcast('read', {
                      id: id,
                      feed: feed
                    });
                  }
                });
              }, MarkReadTimeout);
            }
            return scope.$apply(attr.whenScrolled);
          }
        });
      };
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').filter('feedInFolder', function() {
    return function(feeds, folderId) {
      var feed, result, _i, _len;
      result = [];
      for (_i = 0, _len = feeds.length; _i < _len; _i++) {
        feed = feeds[_i];
        if (feed.folderId === folderId) {
          result.push(feed);
        }
      }
      return result;
    };
  });

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').filter('itemInFeed', [
    'FeedType', 'FeedModel', function(FeedType, FeedModel) {
      return function(items, typeAndId) {
        var feed, feedIds, id, item, result, type, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
        result = [];
        type = typeAndId.type;
        id = typeAndId.id;
        switch (type) {
          case FeedType.Subscriptions:
            return items;
          case FeedType.Starred:
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              item = items[_i];
              if (item.isImportant) {
                result.push(item);
              }
            }
            break;
          case FeedType.Folder:
            for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
              item = items[_j];
              feedIds = {};
              _ref = FeedModel.getItems();
              for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
                feed = _ref[_k];
                if (feed.folderId === id) {
                  feedIds[feed.id] = true;
                }
              }
              if (feedIds[item.feedId]) {
                result.push(item);
              }
            }
            break;
          case FeedType.Feed:
            for (_l = 0, _len3 = items.length; _l < _len3; _l++) {
              item = items[_l];
              if (item.feedId === id) {
                result.push(item);
              }
            }
        }
        return result;
      };
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('FeedModel', [
    'Model', '$rootScope', function(Model, $rootScope) {
      var FeedModel;
      FeedModel = (function(_super) {

        __extends(FeedModel, _super);

        function FeedModel($rootScope) {
          var _this = this;
          this.$rootScope = $rootScope;
          FeedModel.__super__.constructor.call(this);
          this.$rootScope.$on('update', function(scope, data) {
            var feed, _i, _len, _ref, _results;
            if (data['feeds']) {
              _ref = data['feeds'];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                feed = _ref[_i];
                _results.push(_this.add(feed));
              }
              return _results;
            }
          });
        }

        return FeedModel;

      })(Model);
      return new FeedModel($rootScope);
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('GarbageRegistry', [
    'ItemModel', function(ItemModel) {
      var garbageRegistry;
      garbageRegistry = (function() {

        function garbageRegistry(itemModel) {
          this.itemModel = itemModel;
          this.registeredItemIds = {};
        }

        garbageRegistry.prototype.register = function(itemId) {
          return this.registeredItemIds[itemId] = true;
        };

        garbageRegistry.prototype.unregister = function(itemId) {
          return delete this.registeredItemIds[itemId];
        };

        garbageRegistry.prototype.clear = function() {
          var id, useless, _ref;
          _ref = this.registeredItemIds;
          for (id in _ref) {
            useless = _ref[id];
            this.itemModel.removeById(parseInt(id, 10));
          }
          return this.registeredItemIds = {};
        };

        return garbageRegistry;

      })();
      return new garbageRegistry(ItemModel);
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('ShowAll', [
    '$rootScope', function($rootScope) {
      var showAll;
      showAll = {
        showAll: false
      };
      $rootScope.$on('update', function(scope, data) {
        if (data['showAll'] !== void 0) {
          return showAll.showAll = data['showAll'];
        }
      });
      return showAll;
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('PersistenceNews', [
    'Persistence', '$http', '$rootScope', 'Loading', function(Persistence, $http, $rootScope, Loading) {
      var PersistenceNews;
      PersistenceNews = (function(_super) {

        __extends(PersistenceNews, _super);

        function PersistenceNews($http, $rootScope, loading) {
          this.$rootScope = $rootScope;
          this.loading = loading;
          PersistenceNews.__super__.constructor.call(this, 'news', $http);
        }

        PersistenceNews.prototype.loadInitial = function() {
          var _this = this;
          this.loading.loading += 1;
          return this.post('init', {}, function(json) {
            _this.loading.loading -= 1;
            return _this.$rootScope.$broadcast('update', json.data);
          });
        };

        PersistenceNews.prototype.showAll = function(isShowAll) {
          var data;
          data = {
            showAll: isShowAll
          };
          return this.post('usersettings', data);
        };

        PersistenceNews.prototype.markRead = function(itemId, isRead) {
          var data, status;
          if (isRead) {
            status = 'read';
          } else {
            status = 'unread';
          }
          data = {
            itemId: itemId,
            status: status
          };
          return this.post('setitemstatus', data);
        };

        PersistenceNews.prototype.setImportant = function(itemId, isImportant) {
          var data, status;
          if (isImportant) {
            status = 'important';
          } else {
            status = 'unimportant';
          }
          data = {
            itemId: itemId,
            status: status
          };
          return this.post('setitemstatus', data);
        };

        PersistenceNews.prototype.collapseFolder = function(folderId, value) {
          var data;
          data = {
            folderId: folderId,
            opened: value
          };
          return this.post('collapsefolder', data);
        };

        return PersistenceNews;

      })(Persistence);
      return new PersistenceNews($http, $rootScope, Loading);
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('Loading', function() {
    var loading;
    return loading = {
      loading: 0
    };
  });

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('FeedType', function() {
    var feedType;
    return feedType = {
      Feed: 0,
      Folder: 1,
      Starred: 2,
      Subscriptions: 3,
      Shared: 4
    };
  });

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('FolderModel', [
    'Model', '$rootScope', function(Model, $rootScope) {
      var FolderModel;
      FolderModel = (function(_super) {

        __extends(FolderModel, _super);

        function FolderModel($rootScope) {
          var _this = this;
          this.$rootScope = $rootScope;
          FolderModel.__super__.constructor.call(this);
          this.$rootScope.$on('update', function(scope, data) {
            var folder, _i, _len, _ref, _results;
            if (data['folders']) {
              _ref = data['folders'];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                folder = _ref[_i];
                _results.push(_this.add(folder));
              }
              return _results;
            }
          });
        }

        return FolderModel;

      })(Model);
      return new FolderModel($rootScope);
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('ActiveFeed', [
    '$rootScope', function($rootScope) {
      var activeFeed;
      activeFeed = {
        id: 0,
        type: 3
      };
      $rootScope.$on('update', function(scope, data) {
        if (data['activeFeed']) {
          activeFeed.id = data['activeFeed'].id;
          return activeFeed.type = data['activeFeed'].type;
        }
      });
      return activeFeed;
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('ItemModel', [
    'Model', '$rootScope', function(Model, $rootScope) {
      var ItemModel;
      ItemModel = (function(_super) {

        __extends(ItemModel, _super);

        function ItemModel($rootScope) {
          var _this = this;
          this.$rootScope = $rootScope;
          ItemModel.__super__.constructor.call(this);
          this.$rootScope.$on('update', function(scope, data) {
            var item, _i, _len, _ref, _results;
            if (data['items']) {
              _ref = data['items'];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                _results.push(_this.add(item));
              }
              return _results;
            }
          });
        }

        ItemModel.prototype.add = function(item) {
          item = this.bindHelperFunctions(item);
          return ItemModel.__super__.add.call(this, item);
        };

        ItemModel.prototype.bindHelperFunctions = function(item) {
          item.getRelativeDate = function() {
            return moment.unix(this.date).fromNow();
          };
          return item;
        };

        return ItemModel;

      })(Model);
      return new ItemModel($rootScope);
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('Persistence', function() {
    var Persistence;
    return Persistence = (function() {

      function Persistence(appName, $http) {
        this.appName = appName;
        this.$http = $http;
      }

      Persistence.prototype.post = function(file, data, callback) {
        var headers, url;
        if (data == null) {
          data = {};
        }
        if (!callback) {
          callback = function() {};
        }
        url = OC.filePath(this.appName, 'ajax', file + '.php');
        data = $.param(data);
        headers = {
          requesttoken: OC.Request.Token,
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        return this.$http.post(url, data, {
          headers: headers
        }).success(function(data, status, headers, config) {
          return callback(data);
        }).error(function(data, status, headers, config) {
          console.warn('Error occured: ');
          console.warn(status);
          console.warn(headers);
          return console.warn(config);
        });
      };

      return Persistence;

    })();
  });

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('Model', function() {
    var Model;
    return Model = (function() {

      function Model() {
        this.items = [];
        this.itemIds = {};
      }

      Model.prototype.add = function(item) {
        if (item.id in this.itemIds) {
          return this.update(item);
        } else {
          this.items.push(item);
          return this.itemIds[item.id] = item;
        }
      };

      Model.prototype.update = function(item) {
        var key, updatedItem, value, _results;
        updatedItem = this.items[item.id];
        _results = [];
        for (key in item) {
          value = item[key];
          if (key !== 'id') {
            _results.push(updatedItem[key] = value);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Model.prototype.removeById = function(id) {
        var counter, item, removeItemIndex, _i, _len, _ref;
        removeItemIndex = null;
        counter = 0;
        _ref = this.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.id === id) {
            removeItemIndex = counter;
            break;
          }
          counter += 1;
        }
        if (removeItemIndex !== null) {
          this.items.splice(removeItemIndex, 1);
          return delete this.itemIds[id];
        }
      };

      Model.prototype.removeByIds = function(ids) {
        var item, newItemIds, newItems, _i, _len, _ref;
        newItems = [];
        newItemIds = {};
        _ref = this.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (!ids[item.id]) {
            newItems.push(item);
            newItemIds[item.id] = item;
          }
        }
        this.items = newItems;
        return this.itemIds = newItemIds;
      };

      Model.prototype.getItemById = function(id) {
        return this.itemIds[id];
      };

      Model.prototype.getItems = function() {
        return this.items;
      };

      return Model;

    })();
  });

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('StarredCount', [
    '$rootScope', function($rootScope) {
      var starredCount;
      starredCount = {
        count: 0
      };
      $rootScope.$on('update', function(scope, data) {
        if (data['starredCount'] !== void 0) {
          return starredCount.count = data['starredCount'];
        }
      });
      return starredCount;
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('Updater', ['$rootScope', '$http', function($rootScope, $http) {}]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').factory('Controller', function() {
    var Controller;
    return Controller = (function() {

      function Controller() {}

      return Controller;

    })();
  });

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').controller('ItemController', [
    'Controller', '$scope', 'ItemModel', 'ActiveFeed', 'PersistenceNews', 'FeedModel', 'StarredCount', 'GarbageRegistry', 'ShowAll', 'Loading', function(Controller, $scope, ItemModel, ActiveFeed, PersistenceNews, FeedModel, StarredCount, GarbageRegistry, ShowAll, Loading) {
      var ItemController;
      ItemController = (function(_super) {

        __extends(ItemController, _super);

        function ItemController($scope, itemModel, activeFeed, persistence, feedModel, starredCount, garbageRegistry, showAll, loading) {
          var _this = this;
          this.$scope = $scope;
          this.itemModel = itemModel;
          this.activeFeed = activeFeed;
          this.persistence = persistence;
          this.feedModel = feedModel;
          this.starredCount = starredCount;
          this.garbageRegistry = garbageRegistry;
          this.showAll = showAll;
          this.loading = loading;
          this.batchSize = 4;
          this.loaderQueue = 0;
          this.$scope.items = this.itemModel.getItems();
          this.$scope.loading = this.loading;
          this.$scope.scroll = function() {};
          this.$scope.activeFeed = this.activeFeed;
          this.$scope.$on('read', function(scope, params) {
            return _this.$scope.markRead(params.id, params.feed);
          });
          this.$scope.markRead = function(itemId, feedId) {
            var feed, item;
            item = _this.itemModel.getItemById(itemId);
            feed = _this.feedModel.getItemById(feedId);
            if (!item.keptUnread && !item.isRead) {
              item.isRead = true;
              feed.unReadCount -= 1;
              if (!_this.showAll.showAll) {
                _this.garbageRegistry.register(item.id);
              }
              return _this.persistence.markRead(itemId, true);
            }
          };
          this.$scope.keepUnread = function(itemId, feedId) {
            var feed, item;
            item = _this.itemModel.getItemById(itemId);
            feed = _this.feedModel.getItemById(feedId);
            item.keptUnread = !item.keptUnread;
            if (item.isRead) {
              item.isRead = false;
              feed.unReadCount += 1;
              if (!_this.showAll.showAll) {
                _this.garbageRegistry.unregister(item.id);
              }
              return _this.persistence.markRead(itemId, false);
            }
          };
          this.$scope.isKeptUnread = function(itemId) {
            return _this.itemModel.getItemById(itemId).keptUnread;
          };
          this.$scope.toggleImportant = function(itemId) {
            var item;
            item = _this.itemModel.getItemById(itemId);
            item.isImportant = !item.isImportant;
            if (item.isImportant) {
              _this.starredCount.count += 1;
            } else {
              _this.starredCount.count -= 1;
            }
            return _this.persistence.setImportant(itemId, item.isImportant);
          };
        }

        return ItemController;

      })(Controller);
      return new ItemController($scope, ItemModel, ActiveFeed, PersistenceNews, FeedModel, StarredCount, GarbageRegistry, ShowAll, Loading);
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').controller('FeedController', [
    'Controller', '$scope', 'FeedModel', 'FeedType', 'FolderModel', 'ActiveFeed', 'PersistenceNews', 'StarredCount', 'ShowAll', 'ItemModel', 'GarbageRegistry', function(Controller, $scope, FeedModel, FeedType, FolderModel, ActiveFeed, PersistenceNews, StarredCount, ShowAll, ItemModel, GarbageRegistry) {
      var FeedController;
      FeedController = (function(_super) {

        __extends(FeedController, _super);

        function FeedController($scope, feedModel, folderModel, feedType, activeFeed, persistence, starredCount, showAll, itemModel, garbageRegistry) {
          var _this = this;
          this.$scope = $scope;
          this.feedModel = feedModel;
          this.folderModel = folderModel;
          this.feedType = feedType;
          this.activeFeed = activeFeed;
          this.persistence = persistence;
          this.starredCount = starredCount;
          this.showAll = showAll;
          this.itemModel = itemModel;
          this.garbageRegistry = garbageRegistry;
          this.showSubscriptions = true;
          this.clearCallbacks = {};
          this.triggerHideRead();
          this.$scope.feeds = this.feedModel.getItems();
          this.$scope.folders = this.folderModel.getItems();
          this.$scope.feedType = this.feedType;
          this.$scope.toggleFolder = function(folderId) {
            var folder;
            folder = _this.folderModel.getItemById(folderId);
            folder.open = !folder.open;
            return _this.persistence.collapseFolder(folder.id, folder.open);
          };
          this.$scope.isFeedActive = function(type, id) {
            if (type === _this.activeFeed.type && id === _this.activeFeed.id) {
              return true;
            } else {
              return false;
            }
          };
          this.$scope.loadFeed = function(type, id) {
            _this.activeFeed.id = id;
            _this.activeFeed.type = type;
            return _this.$scope.triggerHideRead();
          };
          this.$scope.getUnreadCount = function(type, id) {
            return _this.getUnreadCount(type, id);
          };
          this.$scope.triggerHideRead = function() {
            return _this.triggerHideRead();
          };
          this.$scope.isShown = function(type, id) {
            switch (type) {
              case _this.feedType.Subscriptions:
                return _this.showSubscriptions;
              case _this.feedType.Starred:
                return _this.starredCount.count > 0;
            }
          };
          this.$scope.$on('triggerHideRead', function() {
            return _this.triggerHideRead();
          });
        }

        FeedController.prototype.triggerHideRead = function() {
          var feed, folder, preventParentFolder, _i, _j, _len, _len1, _ref, _ref1;
          preventParentFolder = 0;
          _ref = this.feedModel.getItems();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            feed = _ref[_i];
            if (this.showAll.showAll === false && this.getUnreadCount(this.feedType.Feed, feed.id) === 0) {
              if (this.activeFeed.type === this.feedType.Feed && this.activeFeed.id === feed.id) {
                feed.show = true;
                preventParentFolder = feed.folderId;
              } else {
                feed.show = false;
              }
            } else {
              feed.show = true;
            }
          }
          _ref1 = this.folderModel.getItems();
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            folder = _ref1[_j];
            if (this.showAll.showAll === false && this.getUnreadCount(this.feedType.Folder, folder.id) === 0) {
              if ((this.activeFeed.type === this.feedType.Folder && this.activeFeed.id === folder.id) || preventParentFolder === folder.id) {
                folder.show = true;
              } else {
                folder.show = false;
              }
            } else {
              folder.show = true;
            }
          }
          if (this.showAll.showAll === false && this.getUnreadCount(this.feedType.Subscriptions, 0) === 0) {
            if (this.activeFeed.type === this.feedType.Subscriptions) {
              this.showSubscriptions = true;
            } else {
              this.showSubscriptions = false;
            }
          } else {
            this.showSubscriptions = true;
          }
          if (this.showAll.showAll === false && this.getUnreadCount(this.feedType.Starred, 0) === 0) {
            if (this.activeFeed.type === this.feedType.Starred) {
              this.showStarred = true;
            } else {
              this.showStarred = false;
            }
          } else {
            this.showStarred = true;
          }
          return this.garbageRegistry.clear();
        };

        FeedController.prototype.getUnreadCount = function(type, id) {
          var counter, feed, _i, _j, _len, _len1, _ref, _ref1;
          switch (type) {
            case this.feedType.Feed:
              return this.feedModel.getItemById(id).unreadCount;
            case this.feedType.Folder:
              counter = 0;
              _ref = this.feedModel.getItems();
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                feed = _ref[_i];
                if (feed.folderId === id) {
                  counter += feed.unreadCount;
                }
              }
              return counter;
            case this.feedType.Starred:
              return this.starredCount.count;
            case this.feedType.Subscriptions:
              counter = 0;
              _ref1 = this.feedModel.getItems();
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                feed = _ref1[_j];
                counter += feed.unreadCount;
              }
              return counter;
          }
        };

        return FeedController;

      })(Controller);
      return new FeedController($scope, FeedModel, FolderModel, FeedType, ActiveFeed, PersistenceNews, StarredCount, ShowAll, ItemModel, GarbageRegistry);
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').controller('SettingsController', [
    'Controller', '$scope', 'ShowAll', '$rootScope', 'PersistenceNews', function(Controller, $scope, ShowAll, $rootScope, PersistenceNews) {
      var SettingsController;
      SettingsController = (function(_super) {

        __extends(SettingsController, _super);

        function SettingsController($scope, $rootScope, showAll, persistence) {
          var _this = this;
          this.$scope = $scope;
          this.$rootScope = $rootScope;
          this.showAll = showAll;
          this.persistence = persistence;
          this.$scope.getShowAll = function() {
            return _this.showAll.showAll;
          };
          this.$scope.setShowAll = function(value) {
            _this.showAll.showAll = value;
            _this.persistence.showAll(value);
            return _this.$rootScope.$broadcast('triggerHideRead');
          };
        }

        return SettingsController;

      })(Controller);
      return new SettingsController($scope, $rootScope, ShowAll, PersistenceNews);
    }
  ]);

  /*
  # ownCloud - News app
  #
  # @author Bernhard Posselt
  # Copyright (c) 2012 - Bernhard Posselt <nukeawhale@gmail.com>
  #
  # This file is licensed under the Affero General Public License version 3 or later.
  # See the COPYING-README file
  #
  */


  angular.module('News').controller('SettingsController', [
    'Controller', '$scope', 'ShowAll', '$rootScope', 'PersistenceNews', function(Controller, $scope, ShowAll, $rootScope, PersistenceNews) {
      var SettingsController;
      SettingsController = (function(_super) {

        __extends(SettingsController, _super);

        function SettingsController($scope, $rootScope, showAll, persistence) {
          var _this = this;
          this.$scope = $scope;
          this.$rootScope = $rootScope;
          this.showAll = showAll;
          this.persistence = persistence;
          this.$scope.getShowAll = function() {
            return _this.showAll.showAll;
          };
          this.$scope.setShowAll = function(value) {
            _this.showAll.showAll = value;
            _this.persistence.showAll(value);
            return _this.$rootScope.$broadcast('triggerHideRead');
          };
        }

        return SettingsController;

      })(Controller);
      return new SettingsController($scope, $rootScope, ShowAll, PersistenceNews);
    }
  ]);

}).call(this);
