var express = require('express'),
    app = express();

app.use(express.static(__dirname));

app.get('/rest/header', function (req, res) {
    res.sendFile(__dirname + '/header.json');
});

app.get('/rest/rows', function (req, res) {
    res.send([
        {
            "rowId": "{%quote%jsonClass%quote%:%quote%com.quarta.aprf.sir.entity.InputDocumentRowId%quote%,%quote%id%quote%:%quote%045c927e-0f00-4ab7-ae98-1400aaaeed33f727v1r13091d4e4-fe8c-4631-943b-af09bd30b091%quote%,%quote%entityTypeId%quote%:%quote%rs737%quote%}",
            "cells": [
                {
                    "colId": "{%quote%jsonClass%quote%:%quote%com.quarta.aprf.sir.entity.InputFormColumnId%quote%,%quote%id%quote%:%quote%90addf50-dc20-4ecd-b935-51a4f760ff9e%quote%}",
                    "content": [
                        {
                            "type": "field",
                            "fieldDescription": {
                                "id": "rls1",
                                "label": "наименование показателя",
                                "type": "textInput",
                                "isReadOnly": true
                            },
                            "value": "Доходы от операций с активами"
                        }
                    ]
                },
                {
                    "colId": "{%quote%jsonClass%quote%:%quote%com.quarta.aprf.sir.entity.InputFormColumnId%quote%,%quote%id%quote%:%quote%73413fad-f604-48fd-aec5-a3707599b6ea%quote%}",
                    "content": [
                        {
                            "type": "action",
                            "htmlFunc": "\"<button onclick=\\\"&quot;$.Event(event).stopPropagation()&quot;;&#x000a;jQuery(&quot;body&quot;).operationInProgress(true);&#x000a;liftAjax.lift_ajaxHandler(\\u0027F8600866471111E2QTA=\\u0027 + encodeURIComponent(null), function() {jQuery(&quot;body&quot;).operationInProgress(false);}, function() {jQuery(&quot;body&quot;).operationInProgress(false);}, &quot;javascript&quot;);&#x000a;return false\\\" class=\\\"btn\\\">\\u000a      <span>\\u0440</span>\\u000a    </button>\"",
                            "isSelectedItemsAction": false,
                            "name": "р"
                        },
                        {
                            "type": "field",
                            "fieldDescription": {
                                "id": "kod_ras",
                                "label": "КОСГУ",
                                "type": "lazyReference",
                                "referenceKey": "{\"jsonClass\":\"com.quarta.meta.handler.GenericPlainEntityKey\",\"id\":{\"jsonClass\":\"com.quarta.meta.handler.EntityTypeId\",\"entityTypeId\":\"sprras\"},\"typeKey\":{\"jsonClass\":\"com.quarta.meta.handler.DefaultEntityTypeKey$\"}}",
                                "isReadOnly": false
                            },
                            "value": {
                                "id": "84278fa9-51cd-11e1-9bf3-0018f3eb9eeb",
                                "name": "130"
                            }
                        },
                        {
                            "type": "action",
                            "htmlFunc": "\"<button onclick=\\\"&quot;$.Event(event).stopPropagation()&quot;;&#x000a;jQuery(&quot;body&quot;).operationInProgress(true);&#x000a;liftAjax.lift_ajaxHandler(\\u0027F860086647112FISAGG=\\u0027 + encodeURIComponent(null), function() {jQuery(&quot;body&quot;).operationInProgress(false);}, function() {jQuery(&quot;body&quot;).operationInProgress(false);}, &quot;javascript&quot;);&#x000a;return false\\\" class=\\\"btn btn-danger\\\">\\u000a      <span><i class=\\\"icon-trash icon-white\\\"></i> </span>\\u000a    </button>\"",
                            "isSelectedItemsAction": false,
                            "name": ""
                        }
                    ]
                }
            ]
        }
    ]);
});

app.get('/rest/grid', function (req, res) {
    var createItem = function (value, name) {
            return {
                value: value
                //templateUrl: name && '/dev/templates/qgrid.cell.custom.html'
            };
        },
        data = new Array(30).join(' 1').split(' ')
            .map(function (item, index) {
                var id = index + 1;
                return {
                    id: createItem(id),
                    name: createItem('User #' + id),
                    descriptions: createItem('Lorem ipsum dolor sit amet.', 'descriptions')
                };
            });

    res.send(data);

});

app.get('/', function (req, res) {
    res.sendFile('index.html');
});


app.listen(3000, function (req, res) {
    console.log('Start server on 3000 port');
});