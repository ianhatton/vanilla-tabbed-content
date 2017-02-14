/* eslint-disable max-len */
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
    this.navContainer = this.config.element.querySelector('.' + this.config.navContainerClass);
    this._render();
  }

  _render(){
    const anchor = urlParser.getHash();

    this._setTabbedContentId();
    this._getNavItems();
    this._getTabs();
    this._setActiveTab(this.navItems[0]);
    this._simulateNavItemClick(anchor);
  }

  _addNavItemClickListeners(){
    this.navItems.forEach((navItem)=>{
      navItem.addEventListener('click', this._navItemClick.bind(this, navItem), false);
    });
  }

  _getNavItems(){
    this.navItems = Array.from(this.navContainer.getElementsByTagName('a'));

    this._setNavItemAriaControls();
    this._addNavItemClickListeners();
  }

  _getTabs(){
    this.tabs = Array.from(this.config.element.querySelectorAll(`.${this.config.tabContainerClass}`));

    this._setTabIds();
  }

  _navItemClick(navItem, e){
    e.preventDefault();

    this._setActiveTab(navItem);
  }

  _setActiveTab(navItem){
    const activeIndex = _.indexOf(this.navItems, navItem);

    this._setNavItemAriaSelected(activeIndex);
    this._setNavItemClass(activeIndex);
    this._setTabAriaHidden(activeIndex);
    this._setTabClass(activeIndex);
  }

  _setNavItemAriaControls(){
    let href;

    this.navItems.forEach((navItem, i)=>{
      href = navItem.getAttribute('href');

      if (href === '#'){
        navItem.setAttribute('aria-controls', `${this.config.element.id}-tab-${i}`);
      } else {
        navItem.setAttribute('aria-controls', href.substring(1));
      }
    });
  }

  _setNavItemAriaSelected(activeIndex){
    this.navItems.forEach((navItem)=>{
      navItem.setAttribute('aria-selected', 'false');
    });

    this.navItems[activeIndex].setAttribute('aria-selected', 'true');
  }

  _setNavItemClass(activeIndex){
    let className;

    this.navItems.forEach((navItem)=>{
      className = navItem.className;

      navItem.className = className.replace(/(?:^|\s)active(?!\S)/g, '');
    });

    this.navItems[activeIndex].className += ' active';
  }

  _setTabAriaHidden(activeIndex){
    this.tabs.forEach((tab)=>{
      tab.setAttribute('aria-hidden', 'true');
    });

    this.tabs[activeIndex].setAttribute('aria-hidden', 'false');
  }

  _setTabbedContentId(){
    this.config.element.id = _.uniqueId('tabbed-content-');
  }

  _setTabClass(activeIndex){
    let className;

    this.tabs.forEach((tab)=>{
      className = tab.className;

      tab.className = className.replace(/(?:^|\s)active(?!\S)/g, '');
    });

    this.tabs[activeIndex].className += ' active';
  }

  _setTabIds(){
    let href;

    this.tabs.forEach((tab, i)=>{
      href = this.navItems[i].getAttribute('href');

      if (href === '#'){
        let ariaControls = this.navItems[i].getAttribute('aria-controls');
        tab.id = ariaControls;
      }
    });
  }

  _simulateNavItemClick(anchor){
    if (!_.isEmpty(anchor)){
      this.navItems.forEach((navItem)=>{
        let href = navItem.getAttribute('href');

        if (_.includes(href, anchor)){
          this._setActiveTab(navItem);

          window.location.hash = anchor;
        }
      });
    }
  }
}

module.exports = TabbedContentClass;
/* eslint-enable */
