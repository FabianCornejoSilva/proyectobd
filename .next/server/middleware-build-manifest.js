self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "rootMainFilesTree": {},
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/conocenos": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/conocenos.js"
    ],
    "/crearmenu": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/crearmenu.js"
    ],
    "/pedir": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/pedir.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];