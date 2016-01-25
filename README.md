# mindsmash-table
Yet another data table for AngularJS. The current implementation features data sorting, pagination, filters and more. The library is designed to easily integrate with a Spring Boot application backend, but can also be used with any other framework.

### Table of Contents

   - [Installation](#1-installation)
   - [Usage](#2-usage)
   - [API](#3-api)

### 1. Installation

   1. Download the [latest release](https://github.com/mindsmash/mindsmash-angular-table/releases) or the [current master](https://github.com/mindsmash/mindsmash-angular-table/archive/master.zip) from GitHub. You can also use [Bower](http://bower.io) to install the latest version:
   ```
   $ bower install mindsmash-angular-table --save
   ```
   
   2. Include the library in your website (please use either the minified or unminified file in the `dist` directory):
   ```
   <link rel="stylesheet" href="mindsmash-angular-table/mindsmash-angular-table.min.css"/>
   ```
   ```
   <script src="mindsmash-angular-table/mindsmash-angular-table.min.js"></script>
   ```
   
   3. Add uxTable as a dependency to your app:
   ```
   angular.module('your-app', ['mindsmash-table']);
   ```

**[Back to top](#table-of-contents)**

### 2. Usage

**[Back to top](#table-of-contents)**

### 3. API

**[Back to top](#table-of-contents)**

### Contributors

   * Fynn Feldpausch @ [mindsmash GmbH](https://www.mindsmash.com/)

### License

The MIT License (MIT)

Copyright (c) 2015 mindsmash GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
