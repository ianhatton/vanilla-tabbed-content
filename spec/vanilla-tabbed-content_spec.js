/* eslint-disable max-len, max-lines, max-nested-callbacks, one-var, require-jsdoc */
const _  = require('lodash');
const TabbedContentClass = require('../src/vanilla-tabbed-content');

function createBodyContainer(className){
  let bodyContainer = document.createElement('div');

  bodyContainer.className = className;

  document.body.appendChild(bodyContainer);

  createTabs(bodyContainer, 'tabbed-content-tab');

  return bodyContainer;
}

function createNav(className){
  let navContainer = document.createElement('ul');

  navContainer.className = className;
  navContainer.setAttribute('role', 'tablist');

  document.body.appendChild(navContainer);

  createNavItems(navContainer);

  return navContainer;
}

function createNavItemLink(navItem, i){
  let a = document.createElement('a'); 

  a.setAttribute('role', 'tab');

  a.setAttribute('href', 'tab-' + (i - 1));

  navItem.appendChild(a);
}

function createNavItems(navContainer, items = 2){
  let navItem;
  let range = _.range(1, (items + 1));

  _.forEach(range, (i)=>{
    navItem = document.createElement('li');

    navItem.setAttribute('role', 'presentation');

    createNavItemLink(navItem, i);

    navContainer.appendChild(navItem);
  });
}

function createTabbedContent(className){
  let section = document.createElement('section');

  section.className = className;

  document.body.appendChild(section);

  return section;
}

function createTabs(bodyContainer, className, items = 2){
  let tab;
  let range = _.range(1, (items + 1));
  let tabs = [];

  _.forEach(range, (i)=>{
    tab = document.createElement('div');

    tab.className = className + ' tab-' + (i - 1);
    tab.setAttribute('role', 'tabpanel');
    tab.innerHTML = '<p>Test</p>';

    bodyContainer.appendChild(tab);

    tabs.push(tab);
  });

  return tabs;
}

function removeElement(el){
  el.parentNode.removeChild(el);
}

describe('tabbed content module', function(){
  let bodyContainer, tabbedContent, tabbedContentContainer, urlParser;

  beforeEach(()=>{
    tabbedContentContainer = createTabbedContent('tabbed-content');
    this.navContainer = createNav('tabbed-content-nav');
    bodyContainer = createBodyContainer('tabbed-content-body');

    tabbedContentContainer.appendChild(this.navContainer);
    tabbedContentContainer.appendChild(bodyContainer);

    tabbedContent = new TabbedContentClass(
      {
        element: tabbedContentContainer
        , bodyContainerClass: 'tabbed-content-body'
        , navContainerClass: 'tabbed-content-nav'
        , tabContainerClass: 'tabbed-content-tab'
      }, false
    );

    urlParser = TabbedContentClass.__get__('urlParser');

    tabbedContent.navItems = [];
    tabbedContent.tabs = [];
  });

  afterEach(()=>{
    removeElement(document.querySelector('.' + tabbedContent.config.navContainerClass));
  });

  it('should exist', function(){
    expect(tabbedContent).toBeDefined();
  });

  describe('_init function', ()=>{
    beforeEach(()=>{
      spyOn(tabbedContent, '_render');

      tabbedContent._init();
    });

    it('should set this.navItems to be an empty array', ()=>{
      expect(tabbedContent.navItems.length).toEqual(0);
    });

    it('should set this.tabs to be an empty array', ()=>{
      expect(tabbedContent.tabs.length).toEqual(0);
    });

    it('should set this.navContainer to be the HTML node specified in this.config.navContainerClass', ()=>{
      expect(tabbedContent.navContainer).toEqual(this.navContainer);
    });

    it('should call the _render function', ()=>{
      expect(tabbedContent._render).toHaveBeenCalled();
    });
  });

  describe('_render function', ()=>{
    let navItem;

    beforeEach(()=>{
      tabbedContent.navItems = this.navContainer.getElementsByTagName('a');
      navItem = tabbedContent.navItems[0];

      spyOn(tabbedContent, '_getNavItems');
      spyOn(tabbedContent, '_getTabs');
      spyOn(tabbedContent, '_setActiveTab');
      spyOn(tabbedContent, '_simulateNavItemClick');
      spyOn(urlParser, 'getHash').and.returnValue('anchor-name');

      tabbedContent._render();
    });

    it('should call the urlParser.getHash function', ()=>{
      expect(urlParser.getHash).toHaveBeenCalled();
    });

    it('should call the _getNavItems function', ()=>{
      expect(tabbedContent._getNavItems).toHaveBeenCalled();
    });

    it('should call the _getTabs function', ()=>{
      expect(tabbedContent._getTabs).toHaveBeenCalled();
    });

    it('should call the _setActiveTab function with the first navItem as a parameter', ()=>{
      expect(tabbedContent._setActiveTab).toHaveBeenCalledWith(navItem);
    });

    it('should call the _simulateNavItemClick function with anchor as a parameter', ()=>{
      expect(tabbedContent._simulateNavItemClick).toHaveBeenCalledWith('anchor-name');
    });
  });

  // describe('_addNavItemClickListeners function', ()=>{
  //   How do I test this?
  // });

  describe('_getNavItems function', ()=>{
    beforeEach(()=>{
      tabbedContent.navContainer = this.navContainer;

      spyOn(tabbedContent, '_setNavItemAriaControls');
      spyOn(tabbedContent, '_addNavItemClickListeners');

      tabbedContent._getNavItems();
    });

    it('should add the nav items to the this.navItems array', ()=>{
      expect(tabbedContent.navItems.length).toBe(2);
    });

    it('should call the _setNavItemAriaControls function', ()=>{
      expect(tabbedContent._setNavItemAriaControls).toHaveBeenCalled();
    });

    it('should call the _addNavItemClickListeners function', ()=>{
      expect(tabbedContent._addNavItemClickListeners).toHaveBeenCalled();
    });
  });

  describe('_getTabs function', ()=>{
    beforeEach(()=>{
      spyOn(tabbedContent, '_setTabClasses');

      tabbedContent._getTabs();
    });

    it('should add the tabs to the this.tabs array', ()=>{
      expect(tabbedContent.tabs.length).toBe(2);
    });

    it('should call the _setTabClasses function', ()=>{
      expect(tabbedContent._setTabClasses).toHaveBeenCalled();
    });
  });

  describe('_navItemClick function', ()=>{
    let clickSpy, navItem;

    beforeEach(()=>{
      tabbedContent.navItems = this.navContainer.getElementsByTagName('a');
      navItem = tabbedContent.navItems[0];

      clickSpy = jasmine.createSpyObj('e', ['preventDefault']);

      spyOn(tabbedContent, '_setActiveTab');

      tabbedContent._navItemClick(navItem, clickSpy);
    });

    it('should call e.preventDefault', ()=>{
      expect(clickSpy.preventDefault).toHaveBeenCalled();
    });

    it('should call the _setActiveTab function with navItem as a parameter', ()=>{
      expect(tabbedContent._setActiveTab).toHaveBeenCalledWith(navItem);
    });
  });
});
/* eslint-enable */
