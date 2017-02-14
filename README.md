# vanilla-tabbed-content

### Synopsis
A tabbed content module written in vanilla JavaScript.

### Installation
```
npm install @ianhatton/vanilla-tabbed-content
```

### Running tests
```
npm run test
```

### Example Instantiation
```javascript
const TabbedContentClass = require('@ianhatton/vanilla-tabbed-content');

const tabbedContentElements = document.querySelectorAll('.tabbed-content');

if (tabbedContentElements.length > 0){
  Array.from(tabbedContentElements).map((element)=>{
    return new TabbedContentClass({
      element: element
    });
  });
}
```

### Configuration
A new instance of TabbedContentClass can contain the following in its configuration object:
```javascript
new TabbedContentClass({
  element: // The DOM node to be instantiated as having tabbed content
  , bodyContainerClass: // String. Class for the tabbed content's body. Default is "tabbed-content-body"
  , navContainerClass: // String. Class for the tabbed content's navigation. Default is "tabbed-content-nav"
  , tabContainerClass: // String. Class for each tab. Default is "tabbed-content-tab"
});
```

### Example HTML structure
```html
<div class="tabbed-content">
  <ul class="tabbed-content-nav" role="tablist">
    <li role="presentation">
      <a href="#" role="tab">Tab 1</a>
    </li>
    <li role="presentation">
      <a href="#" role="tab">Tab 2</a>
    </li>
  </ul>
  <div class="tabbed-content-body">
    <article class="tabbed-content-tab">
      <h1>Tab 1</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
    </article>
    <article class="tabbed-content-tab">
      <h1>Tab 2</h1>
      <p>Doloribus quisquam, voluptatum dolores amet incidunt dicta.</p>
    </article>
  </div>
</div>
```

All tabbed content must be wrapped in a single parent div with a class of ***tabbed-content***. The navigation is always wrapped in a div with a class of ***tabbed-content-nav***, and the body in a div with a class of ***tabbed-content-body***. The tabs themselves are individually wrapped in a div with a class of ***tabbed-content-tab***.

### CSS
As a bare minimum, you'll require the following, or similar CSS:

```scss
.tabbed-content-tab {
  display: none;

  &.active {
    display: block;
  }
}
```