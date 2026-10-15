# Licenses and scope

The original Void Arsenal application code, including the original portions of `index.html`, `app.js`, and `scripts/*.py`, is licensed under **GPL-3.0-or-later**. The full GPL version 3 text is in [LICENSE.md](LICENSE.md). Contributions to that original code are accepted under the same terms unless otherwise agreed with the maintainers.

The GPL grant does not relicense third-party material. Wiki-derived data in `data/*.json` and embedded catalogue data in `index.html` retain their source terms, described in [SOURCES.md](SOURCES.md). Warframe and third-party artwork, names, and trademarks retain their respective owners' terms; `images/manifest.json` records image provenance. The bundled parser below remains under its MIT license. Both `app.js` and `index.html` contain material with more than one license.

The image-download help dialog embeds the [Google Chrome icon](https://commons.wikimedia.org/wiki/File:Google_Chrome_icon_%28February_2022%29.svg) and [Microsoft Edge icon](https://commons.wikimedia.org/wiki/File:Microsoft_Edge_logo_%282019%29.svg) from Wikimedia Commons so the guide works offline. Chrome and Edge names and logos remain their owners' trademarks; their inclusion indicates tested browser support, not endorsement.

# Bundled parser

luaparse 0.3.1 (https://github.com/fstirlitz/luaparse) is embedded in app.js solely to parse public wiki Lua tables without executing Lua. No installation or extra script is needed.

Copyright (c) Oskar Schöldström 2012-2014
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
