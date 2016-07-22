'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash/core');
_.includes = require('lodash/includes');

var urlParserClass = require('@djforth/urlparser');
var urlParser = new urlParserClass();

var TabbedContentClass = function () {
  function TabbedContentClass() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var init = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, TabbedContentClass);

    this.config = _.defaults(config, { bodyContainerClass: 'tabbed-content-body',
      navContainerClass: 'tabbed-content-nav',
      tabContainerClass: 'tabbed-content-tab' });

    if (init) {
      this._init();
    }
  }

  _createClass(TabbedContentClass, [{
    key: '_init',
    value: function _init() {
      this.navItems = [];
      this.tabs = [];
      /* eslint-disable max-len */
      this.navContainer = this.config.element.querySelector('.' + this.config.navContainerClass);
      /* eslint-enable */
      this._render();
    }
  }, {
    key: '_render',
    value: function _render() {
      var anchor = urlParser.getHash();

      this._getNavItems();
      this._getTabs();
      this._setActiveTab(this.navItems[0]);
      this._simulateNavItemClick(anchor);
    }
  }, {
    key: '_addNavItemClickListeners',
    value: function _addNavItemClickListeners() {
      _.forEach(this.navItems, function (navItem) {
        /* eslint-disable max-len */
        navItem.addEventListener('click', this._navItemClick.bind(this, navItem), false);
        /* eslint-enable */
      }.bind(this));
    }
  }, {
    key: '_getNavItems',
    value: function _getNavItems() {
      this.navItems = this.navContainer.getElementsByTagName('a');

      this._setNavItemAriaControls();
      this._addNavItemClickListeners();
    }
  }, {
    key: '_getTabs',
    value: function _getTabs() {
      /* eslint-disable max-len */
      this.tabs = this.config.element.querySelectorAll('.' + this.config.tabContainerClass);
      /* eslint-enable */

      this._setTabClasses();
    }
  }, {
    key: '_navItemClick',
    value: function _navItemClick(navItem, e) {
      e.preventDefault();

      this._setActiveTab(navItem);
    }
  }, {
    key: '_setActiveTab',
    value: function _setActiveTab(navItem) {
      var activeIndex = _.indexOf(this.navItems, navItem);

      this._setNavItemAriaSelected(activeIndex);
      this._setNavItemClass(activeIndex);
      this._setTabAriaHidden(activeIndex);
      this._setTabClass(activeIndex);
    }
  }, {
    key: '_setNavItemAriaControls',
    value: function _setNavItemAriaControls() {
      _.forEach(this.navItems, function (navItem, i) {
        navItem.setAttribute('aria-controls', 'tab-' + i);
      });
    }
  }, {
    key: '_setNavItemAriaSelected',
    value: function _setNavItemAriaSelected(activeIndex) {
      _.forEach(this.navItems, function (navItem) {
        navItem.setAttribute('aria-selected', 'false');
      });

      this.navItems[activeIndex].setAttribute('aria-selected', 'true');
    }
  }, {
    key: '_setNavItemClass',
    value: function _setNavItemClass(activeIndex) {
      _.forEach(this.navItems, function (navItem) {
        var className = navItem.className;

        navItem.className = className.replace(/(?:^|\s)active(?!\S)/g, '');
      });

      this.navItems[activeIndex].className += ' active';
    }
  }, {
    key: '_setTabAriaHidden',
    value: function _setTabAriaHidden(activeIndex) {
      _.forEach(this.tabs, function (tab) {
        tab.setAttribute('aria-hidden', 'true');
      });

      this.tabs[activeIndex].setAttribute('aria-hidden', 'false');
    }
  }, {
    key: '_setTabClass',
    value: function _setTabClass(activeIndex) {
      _.forEach(this.tabs, function (tab) {
        var className = tab.className;

        tab.className = className.replace(/(?:^|\s)active(?!\S)/g, '');
      });

      this.tabs[activeIndex].className += ' active';
    }
  }, {
    key: '_setTabClasses',
    value: function _setTabClasses() {
      _.forEach(this.tabs, function (tabContentItem, i) {
        tabContentItem.className += ' tab-' + i;
      });
    }
  }, {
    key: '_simulateNavItemClick',
    value: function _simulateNavItemClick(anchor) {
      if (!_.isEmpty(anchor)) {
        _.forEach(this.navItems, function (navItem) {
          var href = navItem.getAttribute('href');

          if (_.includes(href, anchor)) {
            this._setActiveTab(navItem);
            window.location.hash = anchor;
          }
        }.bind(this));
      }
    }
  }]);

  return TabbedContentClass;
}();

module.exports = TabbedContentClass;
//# sourceMappingURL=vanilla-tabbed-content.js.map