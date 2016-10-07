var cheerio = require('cheerio');

exports.getWordInfo = function(body){

    return new Promise(function(resolve, reject){

        $ = cheerio.load(body);

        try {

            $('.oddRow', '#table_div').each(function(){

                var actualElem = $(this).text();

                if(actualElem.trim() != ''){

                    var ncmEntry = actualElem.split(/\r?\n/);

                    var actualNcm = createNcmEntry(ncmEntry, countryName);

                    ncmInsert.push(actualNcm);         

                }
            });

            resolve (ncmInsert);

        } catch (e) {

            console.log("Erro Webscraping:" + e);
            reject(e);

        }
    });
};