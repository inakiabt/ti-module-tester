# Titaniumified Module Tester
A simple Gruntfile.js to test your "[titaniumified](https://github.com/smclab/titaniumifier)" common js module in two commands using [TiShadow](https://github.com/dbankier/TiShadow) (`tishadow spec` for more information about run tests with TiShadow -> [here](https://github.com/dbankier/TiShadow#testing--assertions))

## The basics
Just clone this repo in your module folder and install dependencies:
```bash
git clone https://github.com/inakiabt/ti-module-tester
cd ti-module-tester
npm install
```

Run the TiShadow server in another terminal:
```bash
tishadow server
```

Run this:
```bash
grunt
```

Once the app is running run this in another terminal:
```bash
cd /path/to/your-module/ti-module-tester
grunt test
```
---

If you don't want to open a new terminal you can run 
```bash
cd ti-module-tester
grunt ; grunt test
```
...wait your app is running then `CTRL+C` and that's it!

###### In case you don't want to clone this project in your project, you can clone it anywhere and use `--module-dir /path/to/your/module` param.
## How it works
This `Gruntfile.js` provides some tasks to setup a temp Titanium app and test your module with it using TiShadow.

Tasks provided:
### grunt [default]
It will:
 - Create a temp Titanium app
 - Build your titaniumified module
 - Install your module in the temp app
 - Copy some jasmine utils
 - Appify [https://github.com/dbankier/TiShadow#tishadow-appify](https://github.com/dbankier/TiShadow#tishadow-appify) the app
 - and build the app

*Required for setup the environment*
 
### grunt test
It will:
 - Update/copy your module specs
 - Run `tishadow spec` in the temp app

*Useful when you are developing the module specs*

### grunt module:setup
It will:
 - Build your titaniumified module
 - Install your module in the temp app
 - Appify the app
 - Build the app

*Useful when you make changes on your module*

## Example
```
utils-module/
   utils.js
   package.json
   spec/
      utils_spec.js
   ti-module-tester/
```

utils.js
```javascript
exports.sum = function(value1, value2){
  return value1 + value2;
};
```

spec/utils_spec.js
```javascript
var utils = require('utils');
describe('utils module', function(){
  it("should return a + b", function () {
      var a = 10, b = 30;
      expect(utils.sum(a, b)).toEqual(a + b);
  });
});

```

After setup the environment, running `grunt test` I'll get something like this:
<img src="http://i.imgur.com/s8vgjlO.png" height="300">

## Author

**Iñaki Abete**  
web: http://github.com/inakiabt  
email: inakiabt+github@gmail.com  
twitter: @inakiabt  


## Contribute

Found a bug? Want to contribute and add a new feature?

Please fork this project and send me a pull request!

License
-------

This library, *ti-module-tester*, is free software ("Licensed Software"); you can
redistribute it and/or modify it under the terms of the [GNU Lesser General
Public License](http://www.gnu.org/licenses/lgpl-2.1.html) as published by the
Free Software Foundation; either version 2.1 of the License, or (at your
option) any later version.

This library is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; including but not limited to, the implied warranty of MERCHANTABILITY,
NONINFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General
Public License for more details.

You should have received a copy of the [GNU Lesser General Public
License](http://www.gnu.org/licenses/lgpl-2.1.html) along with this library; if
not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
Floor, Boston, MA 02110-1301 USA
