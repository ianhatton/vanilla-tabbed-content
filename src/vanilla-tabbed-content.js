const _ = require('lodash/core');
_.includes = require('lodash/includes');

const urlParserClass = require('@djforth/urlparser');
const urlParser = new urlParserClass();

class TabbedContentClass{
  constructor(config = {}, init = true){
    this.config = _.defaults(config,
      {bodyContainerClass: 'tabbed-content-body'
      , navContainerClass: 'tabbed-content-nav'
      , tabContainerClass: 'tabbed-content-tab'}
    );

    if (init){
      this._init();
    }
  }

  _init(){
    this.navItems = [];
    this.tabs = [];
    /* eslint-disable max-len */
    this.navContainer = this.config.element.querySelector('.' + this.config.navContainerClass);
    /* eslint-enable */
    this._render();
  }

  _render(){
    let anchor = urlParser.getHash();

    this._getNavItems();
    this._getTabs();
    this._setActiveTab(this.navItems[0]);
    this._simulateNavItemClick(anchor);
  }

  _addNavItemClickListeners(){
    _.forEach(this.navItems, function(navItem){
      /* eslint-disable max-len */
      navItem.addEventListener('click', this._navItemClick.bind(this, navItem), false);
      /* eslint-enable */
    }.bind(this));
  }

  _getNavItems(){
    this.navItems = this.navContainer.getElementsByTagName('a');

    this._setNavItemAriaControls();
    this._addNavItemClickListeners();
  }

  _getTabs(){
    /* eslint-disable max-len */
    this.tabs = this.config.element.querySelectorAll('.' + this.config.tabContainerClass);
    /* eslint-enable */

    this._setTabIds();
  }

  _navItemClick(navItem, e){
    e.preventDefault();

    this._setActiveTab(navItem);
  }

  _setActiveTab(navItem){
    let activeIndex = _.indexOf(this.navItems, navItem);

    this._setNavItemAriaSelected(activeIndex);
    this._setNavItemClass(activeIndex);
    this._setTabAriaHidden(activeIndex);
    this._setTabClass(activeIndex);
  }

  _setNavItemAriaControls(){
    let href;

    _.forEach(this.navItems, function(navItem, i){
      href = navItem.getAttribute('href');

      if (href === '#'){
        navItem.setAttribute('aria-controls', 'tab-' + i);
      } else {
        navItem.setAttribute('aria-controls', href.substring(1));
      }
    });
  }

  _setNavItemAriaSelected(activeIndex){
    _.forEach(this.navItems, (navItem)=>{
      navItem.setAttribute('aria-selected', 'false');
    });

    this.navItems[activeIndex].setAttribute('aria-selected', 'true');
  }

  _setNavItemClass(activeIndex){
    _.forEach(this.navItems, (navItem)=>{
      let className = navItem.className;

      navItem.className = className.replace(/(?:^|\s)active(?!\S)/g, '');
    });

    this.navItems[activeIndex].className += ' active';
  }

  _setTabAriaHidden(activeIndex){
    _.forEach(this.tabs, (tab)=>{
      tab.setAttribute('aria-hidden', 'true');
    });

    this.tabs[activeIndex].setAttribute('aria-hidden', 'false');
  }

  _setTabClass(activeIndex){
    _.forEach(this.tabs, (tab)=>{
      let className = tab.className;

      tab.className = className.replace(/(?:^|\s)active(?!\S)/g, '');
    });

    this.tabs[activeIndex].className += ' active';
  }

  _setTabIds(){
    let href;

    _.forEach(this.tabs, function(tabContentItem, i){
      href = this.navItems[i].getAttribute('href');

      if (href === '#'){
        let ariaControls = this.navItems[i].getAttribute('aria-controls');
        tabContentItem.id = ariaControls;
      }
    }.bind(this));
  }

  _simulateNavItemClick(anchor){
    if (!_.isEmpty(anchor)){
      _.forEach(this.navItems, function(navItem){
        let href = navItem.getAttribute('href');

        if (_.includes(href, anchor)){
          this._setActiveTab(navItem);
          window.location.hash = anchor;
        }
      }.bind(this));
    }
  }
}

module.exports = TabbedContentClass;
