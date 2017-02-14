'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable max-len */
var _ = require('lodash/core');
_.includes = require('lodash/includes');

var urlParserClass = require('@djforth/urlparser');
var urlParser = new urlParserClass();

var TabbedContentClass = function () {
  function TabbedContentClass() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

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
      this.navContainer = this.config.element.querySelector('.' + this.config.navContainerClass);
      this._render();
    }
  }, {
    key: '_render',
    value: function _render() {
      var anchor = urlParser.getHash();

      this._setTabbedContentId();
      this._getNavItems();
      this._getTabs();
      this._setActiveTab(this.navItems[0]);
      this._simulateNavItemClick(anchor);
    }
  }, {
    key: '_addNavItemClickListeners',
    value: function _addNavItemClickListeners() {
      var _this = this;

      this.navItems.forEach(function (navItem) {
        navItem.addEventListener('click', _this._navItemClick.bind(_this, navItem), false);
      });
    }
  }, {
    key: '_getNavItems',
    value: function _getNavItems() {
      this.navItems = Array.from(this.navContainer.getElementsByTagName('a'));

      this._setNavItemAriaControls();
      this._addNavItemClickListeners();
    }
  }, {
    key: '_getTabs',
    value: function _getTabs() {
      this.tabs = Array.from(this.config.element.querySelectorAll('.' + this.config.tabContainerClass));

      this._setTabIds();
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
      var _this2 = this;

      var href = void 0;

      this.navItems.forEach(function (navItem, i) {
        href = navItem.getAttribute('href');

        if (href === '#') {
          navItem.setAttribute('aria-controls', _this2.config.element.id + '-tab-' + i);
        } else {
          navItem.setAttribute('aria-controls', href.substring(1));
        }
      });
    }
  }, {
    key: '_setNavItemAriaSelected',
    value: function _setNavItemAriaSelected(activeIndex) {
      this.navItems.forEach(function (navItem) {
        navItem.setAttribute('aria-selected', 'false');
      });

      this.navItems[activeIndex].setAttribute('aria-selected', 'true');
    }
  }, {
    key: '_setNavItemClass',
    value: function _setNavItemClass(activeIndex) {
      var className = void 0;

      this.navItems.forEach(function (navItem) {
        className = navItem.className;

        navItem.className = className.replace(/(?:^|\s)active(?!\S)/g, '');
      });

      this.navItems[activeIndex].className += ' active';
    }
  }, {
    key: '_setTabAriaHidden',
    value: function _setTabAriaHidden(activeIndex) {
      this.tabs.forEach(function (tab) {
        tab.setAttribute('aria-hidden', 'true');
      });

      this.tabs[activeIndex].setAttribute('aria-hidden', 'false');
    }
  }, {
    key: '_setTabbedContentId',
    value: function _setTabbedContentId() {
      this.config.element.id = _.uniqueId('tabbed-content-');
    }
  }, {
    key: '_setTabClass',
    value: function _setTabClass(activeIndex) {
      var className = void 0;

      this.tabs.forEach(function (tab) {
        className = tab.className;

        tab.className = className.replace(/(?:^|\s)active(?!\S)/g, '');
      });

      this.tabs[activeIndex].className += ' active';
    }
  }, {
    key: '_setTabIds',
    value: function _setTabIds() {
      var _this3 = this;

      var href = void 0;

      this.tabs.forEach(function (tab, i) {
        href = _this3.navItems[i].getAttribute('href');

        if (href === '#') {
          var ariaControls = _this3.navItems[i].getAttribute('aria-controls');
          tab.id = ariaControls;
        }
      });
    }
  }, {
    key: '_simulateNavItemClick',
    value: function _simulateNavItemClick(anchor) {
      var _this4 = this;

      if (!_.isEmpty(anchor)) {
        this.navItems.forEach(function (navItem) {
          var href = navItem.getAttribute('href');

          if (_.includes(href, anchor)) {
            _this4._setActiveTab(navItem);

            window.location.hash = anchor;
          }
        });
      }
    }
  }]);

  return TabbedContentClass;
}();

module.exports = TabbedContentClass;
/* eslint-enable */
//# sourceMappingURL=vanilla-tabbed-content.js.map