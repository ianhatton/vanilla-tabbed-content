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

  if (i % 2 === 0){
    a.setAttribute('href', 'tab-' + (i - 1));
  } else {
    a.setAttribute('href', '#');
  }

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

    tab.className = className;
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
  let bodyContainer, navContainer, tabbedContent, tabbedContentContainer, urlParser;

  beforeEach(()=>{
    tabbedContentContainer = createTabbedContent('tabbed-content');
    navContainer = createNav('tabbed-content-nav');
    bodyContainer = createBodyContainer('tabbed-content-body');

    tabbedContentContainer.appendChild(navContainer);
    tabbedContentContainer.appendChild(bodyContainer);

    tabbedContent = new TabbedContentClass(
      {
        element: tabbedContentContainer
        , bodyContainerClass: 'tabbed-content-body'
        , navContainerClass: 'tabbed-content-nav'
        , tabContainerClass: 'tabbed-content-tab'
      }, false
    );

    tabbedContent.navItems = [];
    tabbedContent.tabs = [];

    urlParser = TabbedContentClass.__get__('urlParser');

    // For testing
    this.navContainer = tabbedContent.config.element.querySelector('.' + tabbedContent.config.navContainerClass);
    this.navItems = Array.from(tabbedContent.config.element.querySelector('.' + tabbedContent.config.navContainerClass).getElementsByTagName('a'));
    this.tabs = Array.from(tabbedContent.config.element.querySelectorAll('.' + tabbedContent.config.tabContainerClass));
  });

  afterEach(()=>{
    removeElement(document.querySelector('.' + tabbedContent.config.navContainerClass));
    removeElement(document.querySelector('.' + tabbedContent.config.tabContainerClass));
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
      tabbedContent.navItems = this.navItems;
      navItem = tabbedContent.navItems[0];

      spyOn(tabbedContent, '_setTabbedContentId');
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

    it('should call the _setTabbedContentId function', ()=>{
      expect(tabbedContent._setTabbedContentId).toHaveBeenCalled();
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
      spyOn(tabbedContent, '_setTabIds');

      tabbedContent._getTabs();
    });

    it('should add the tabs to the this.tabs array', ()=>{
      expect(tabbedContent.tabs.length).toBe(2);
    });

    it('should call the _setTabIds function', ()=>{
      expect(tabbedContent._setTabIds).toHaveBeenCalled();
    });
  });

  describe('_navItemClick function', ()=>{
    let clickSpy, navItem;

    beforeEach(()=>{
      tabbedContent.navItems = this.navItems;
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

  describe('_setActiveTab function', ()=>{
    let activeIndex, navItem;

    beforeEach(()=>{
      tabbedContent.navItems = this.navItems;
      navItem = tabbedContent.navItems[0];
      activeIndex = _.indexOf(tabbedContent.navItems, navItem);

      spyOn(tabbedContent, '_setNavItemAriaSelected');
      spyOn(tabbedContent, '_setNavItemClass');
      spyOn(tabbedContent, '_setTabAriaHidden');
      spyOn(tabbedContent, '_setTabClass');

      tabbedContent._setActiveTab(navItem);
    });

    it('should call the _setNavItemAriaSelected function with activeIndex as a parameter', ()=>{
      expect(tabbedContent._setNavItemAriaSelected).toHaveBeenCalledWith(activeIndex);
    });

    it('should call the _setNavItemClass function with activeIndex as a parameter', ()=>{
      expect(tabbedContent._setNavItemClass).toHaveBeenCalledWith(activeIndex);
    });

    it('should call the _setTabAriaHidden function with activeIndex as a parameter', ()=>{
      expect(tabbedContent._setTabAriaHidden).toHaveBeenCalledWith(activeIndex);
    });

    it('should call the _setTabClass function with activeIndex as a parameter', ()=>{
      expect(tabbedContent._setTabClass).toHaveBeenCalledWith(activeIndex);
    });
  });

  describe('_setNavItemAriaControls function', ()=>{
    let navItem;

    beforeEach(()=>{
      tabbedContent.navItems = this.navItems;
    });

    describe("when the nav item's href attribute is '#'", ()=>{
      beforeEach(()=>{
        tabbedContent.config.element.id = 'tabbed-content-0';
        navItem = tabbedContent.navItems[0];

        tabbedContent._setNavItemAriaControls();
      });

      it('should set the "aria-controls" attribute of the nav item to be "[this.config.element.id]-tab-[index]"', ()=>{
        expect(navItem.getAttribute('aria-controls')).toEqual('tabbed-content-0-tab-0');
      });
    });

    describe("when the nav item's href attribute is something other than '#'", ()=>{
      beforeEach(()=>{
        navItem = tabbedContent.navItems[1];

        tabbedContent._setNavItemAriaControls();
      });

      it('should set the "aria-controls" attribute of the nav item to be the value of the href without the hash"', ()=>{
        expect(navItem.getAttribute('aria-controls')).toEqual('ab-1');
      });
    });
  });

  describe('_setNavItemAriaSelected function', ()=>{
    let activeIndex, navItemOne, navItemTwo;

    beforeEach(()=>{
      activeIndex = 0;
      tabbedContent.navItems = this.navItems;
      navItemOne = tabbedContent.navItems[0];
      navItemTwo = tabbedContent.navItems[1];
      navItemTwo.setAttribute('aria-selected', 'true');

      tabbedContent._setNavItemAriaSelected(activeIndex);
    });

    it('should set the "aria-selected" attribute of all nav items to "false"', ()=>{
      expect(navItemTwo.getAttribute('aria-selected')).toEqual('false');
    });

    it('should set the "aria-selected" attribute of the nav item which has the same array index as the activeIndex parameter to "true"', ()=>{
      expect(navItemOne.getAttribute('aria-selected')).toEqual('true');
    });
  });

  describe('_setNavItemClass function', ()=>{
    let activeIndex, navItemOne, navItemTwo;

    beforeEach(()=>{
      activeIndex = 0;
      tabbedContent.navItems = this.navItems;
      navItemOne = tabbedContent.navItems[0];
      navItemTwo = tabbedContent.navItems[1];
      navItemTwo.className = 'active';

      tabbedContent._setNavItemClass(activeIndex);
    });

    it('should remove the "active" class from all nav items', ()=>{
      expect(navItemTwo.className).not.toContain('active');
    });

    it('should add the "active" class to the nav item with the same array index as the activeIndex parameter', ()=>{
      expect(navItemOne.className).toContain('active');
    });
  });

  describe('_setTabAriaHidden function', ()=>{
    let activeIndex, tabOne, tabTwo;

    beforeEach(()=>{
      activeIndex = 0;
      tabbedContent.tabs = this.tabs;
      tabOne = tabbedContent.tabs[0];
      tabTwo = tabbedContent.tabs[1];
      tabTwo.setAttribute('aria-hidden', 'false');

      tabbedContent._setTabAriaHidden(activeIndex);
    });

    it('should set the "aria-hidden" attribute of all nav items to "true"', ()=>{
      expect(tabTwo.getAttribute('aria-hidden')).toEqual('true');
    });

    it('should set the "aria-hidden" attribute of the tab with the same array index as the activeIndex parameter to "false"', ()=>{
      expect(tabOne.getAttribute('aria-hidden')).toEqual('false');
    });
  });

  describe('_setTabbedContentId function', ()=>{
    beforeEach(()=>{
      tabbedContent._setTabbedContentId();
    });

    it('should set this.config.element.id to be "tabbed-content-" followed by a unique ID', ()=>{
      expect(tabbedContent.config.element.id).toContain('tabbed-content-');
    });
  });

  describe('_setTabClass function', ()=>{
    let activeIndex, tabOne, tabTwo;

    beforeEach(()=>{
      activeIndex = 0;
      tabbedContent.tabs = this.tabs;
      tabOne = tabbedContent.tabs[0];
      tabTwo = tabbedContent.tabs[1];
      tabTwo.className = 'active';

      tabbedContent._setTabClass(activeIndex);
    });

    it('should remove the "active" class from all tabs', ()=>{
      expect(tabTwo.className).not.toContain('active');
    });

    it('should add the "active" class to the tab with the same array index as the activeIndex parameter', ()=>{
      expect(tabOne.className).toContain('active');
    });
  });

  describe('_setTabIds function', ()=>{
    let navItem, tab;

    beforeEach(()=>{
      tabbedContent.navItems = this.navItems;
      tabbedContent.tabs = this.tabs;
    });

    describe("when the href attribute of the tab's corresponding nav item is '#'", ()=>{
      beforeEach(()=>{
        navItem = tabbedContent.navItems[0];
        tab = tabbedContent.tabs[0];
        navItem.setAttribute('aria-controls', 'testId');

        tabbedContent._setTabIds();
      });

      it("should set the id of the tab to be the value of the nav item's 'aria-controls' attribute", ()=>{
        expect(tab.id).toEqual('testId');
      });
    });

    describe("when the href attribute of the tab's corresponding nav item is something other than '#'", ()=>{
      beforeEach(()=>{
        navItem = tabbedContent.navItems[1];
        tab = tabbedContent.tabs[1];
        navItem.setAttribute('aria-controls', 'testId');

        tabbedContent._setTabIds();
      });

      it("should not set the id of the tab to be the value of the nav item's 'aria-controls' attribute", ()=>{
        expect(tab.id).not.toEqual('testId');
      });
    });
  });

  describe('_simulateNavItemClick function', ()=>{
    let anchor, navItem;

    beforeEach(()=>{
      tabbedContent.navItems = this.navItems;
      navItem = tabbedContent.navItems[0];

      spyOn(tabbedContent, '_setActiveTab');
    });

    describe('when there is an anchor', ()=>{
      beforeEach(()=>{
        anchor = '#anchor';
      });

      describe('and the anchor matches the href of a nav item', ()=>{
        beforeEach(()=>{
          navItem.setAttribute('href', '#anchor');

          tabbedContent._simulateNavItemClick(anchor);
        });

        it('should call the _setActiveTab function with navItem as a parameter', ()=>{
          expect(tabbedContent._setActiveTab).toHaveBeenCalledWith(navItem);
        });

        it('should set window.location.hash to be the value of the anchor', ()=>{
          expect(window.location.hash).toEqual(anchor);
        });
      });

      describe('and the anchor does not match the href of a nav item', ()=>{
        beforeEach(()=>{
          window.location.hash = ' ';

          navItem.setAttribute('href', '#something-else');

          tabbedContent._simulateNavItemClick(anchor);
        });

        it('should not call the _setActiveTab function', ()=>{
          expect(tabbedContent._setActiveTab).not.toHaveBeenCalled();
        });

        it('should not set window.location.hash to be the value of the anchor', ()=>{
          expect(window.location.hash).not.toEqual(anchor);
        });
      });
    });

    describe('when there is no anchor', ()=>{
      beforeEach(()=>{
        tabbedContent._simulateNavItemClick(anchor);
      });

      it('should not call the _setActiveTab function', ()=>{
        expect(tabbedContent._setActiveTab).not.toHaveBeenCalled();
      });

      it('should not set window.location.hash to be the value of the anchor', ()=>{
        expect(window.location.hash).not.toEqual(anchor);
      });
    });
  });
});
/* eslint-enable */
