[![Build Status](https://travis-ci.org/advanced-rest-client/raml-unzip.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/raml-unzip)  

# raml-unzip

An element to unzip raml package and provide a list of files for the parser.
It also recognizes the API spec's main file that should be used as a main file
for the parser.

This element works great with `raml-js-parser` element.

### Example
```html
<raml-unzip entry-point="{{apiFile}}" file-structure="{{files}}"></raml-unzip>
<raml-js-parser raml-file="[[apiFile]]" files="[[files]]" latest-json="{{plainRaml}}" json></raml-js-parser>
<raml-json-enhance json="[[plainRaml.specification]]" on-raml-json-enhance-ready="_ramlEnhanced" on-error="_ramlEnhanceError"></raml-json-enhance>

<script>
var unzip = document.querySelctor('raml-unzip');
unzip.addEventListener('raml-unzip-ready', function() {
  document.querySelctor('raml-js-parser').loadFiles();
});
unzip.file = new Blob([...], {type: 'application/zip'});
</script>
```

## Entry point lookup

The element uses `raml-main-entry-lookup` element to find API main file (the entry point).

In most cases the lookup elememt is not used. It finds `api.raml` file in the
main folder and if ther's a matching file then it reports it right away.

When there's no RAML files in the zip's main folder then the element dispatches
`error` custom event with `code` set to `E_NO_ENTRY_POINT`.

When there's more than one RAML file in the main folder and non of it is `api.raml`
file then it dispatches `raml-unzip-multiple-entry-points` custom event.
Tpplication should handle the event and present the user list of available
options. After the user selects main file the application should set `entryPoint`
property with the file data matching the entry received with the event.

### Example

```html
<raml-unzip></raml-unzip>
<script>
var unzip = document.querySelctor('raml-unzip');
unzip.addEventListener('raml-unzip-multiple-entry-points', function(e) {
  var files = e.detail.files;
  files = files.map((entry) => {
    return {
      name: entry.name,
      value: entry
    }
  });
  // Assuming that it displays `name` property and reports back `value` as
  // a custom event
  displayEntrySelectorDialog(files);
});
window.addEventListener('entry-selector-dialog-result', function(e) {
  unzip.entryPoint = e.detail.value;
});
</script>
```

This step allows you to handle `raml-unzip-ready` custom event. However, it
reports back the same entry point value alongside the file structure of the zip
file than can be accessed via `fileStructure` property.

See demo page for working example.



### Events
| Name | Description | Params |
| --- | --- | --- |
| error | Dispatched when error occurred. This also means that the file won't be processed.  ### Error codes - `E_NO_ENTRY_POINT` - when entry point for the API spec is not found. It may mean that in zip's main folder was no RAML files at all. - `E_UNZIP_ERROR` - error associated with the `web-unzip` element. Usaually this means that the zip file is corrupted and cannot be read. | message **String** - Error message to display to the user. |
code **String** - Error mrssage code |
| raml-unzip-multiple-entry-points | Dispatched when multiple entry points to the RAML spec has been found in the zip file. This can only happen when there's no `api.raml` file in the main folder of the zip file.  The application that uses this element should provide an UI for the user to render a list box with options to select proper entry point for the api.  When the user made the selection the application should set `entryPoint` property to a file object reported in `files` property. | files **Array.<Object>** - List of Unzip library file objects. |
| raml-unzip-ready | Dispatched when the zip file is read and main entry point determined. This information should be passed to `raml-js-parser` to get RAML's AST or JSON data model. | __none__ |
