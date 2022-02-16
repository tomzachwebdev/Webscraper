const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: './file.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'lang', title: 'LANGUAGE'}
    ]
});
 
var records = [
    {name: 'Bob',  lang: 'French, English'},
    {name: 'Mary', lang: 'English'}
];
 
csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });

    records = [
        {name: 'aj',  lang: 'French, English'},
        {name: 'Magii', lang: 'English'}
    ];
csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });