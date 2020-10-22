1. What is the storage format for the comments created on confluence?
The value we fetched with Postman is HTML pieces - Conflunece Storage format (Not ADF).

2. Can we retrieve comments in atlas_doc_format?
Yes. You can get the comment back in `storage`, `atlas_doc_format`, 

````
"body": {
    "_expandable": {
        "editor": "",
        "atlas_doc_format": "",
        "view": "",
        "export_view": "",
        "styled_view": "",
        "dynamic": "",
        "storage": "",
        "editor2": "",
        "anonymous_export_view": ""
    }
},
````


1. Confluence global comment render (do not care)
2. Confluence global comment editor (do not care)
3. Comment render on diagram        (input - storage)
4. Comment editor on diagram        (output - ADF)
5. Comment API GET                  (output - *storage* + ADF)
6. Comment API POST                 (input - storage + *ADF*)