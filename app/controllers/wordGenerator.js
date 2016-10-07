var mongoose = require('mongoose');
var Word = mongoose.model('Word');

var readDictionary = require(process.cwd() + '/app/utils/readDictionary');
var webscraping = require(process.cwd() + '/app/utils/webscraping');

exports.newWord = (req, res) => {

    var body = _.pick(req.body, "word");

    if (!_.isString(body.word) || body.word.trim().length == 0){

        res.status(400).json({
            data: "Invalid word."
        });

    } else {

        var insertWord = {
            word: body.word,
            difficulty: 5,
            type: "Adjetivo",
            vote: 0
        };

        var WordModel = new Word(insertWord);

        WordModel.save((err, word) => {

            if (err) {

                res.status(500).json({
                    data: "Error inserting word."
                });

            } else {

                if (!word) {

                    res.status(500).json({
                        data:"Error inserting word."
                    });                    

                } else {

                    res.status(200).json({
                        data: "Success inserting word."
                    });   
                }
            }
        });
    }
};

exports.getDictionary = (req, res) => {

    var fileName = process.cwd() + '/Dictionary/A.xml';

    readDictionary.readDictionary(fileName).then((data) => {
    
        console.log(data.dic.head);

        data.dic.entry.forEach((word) => {
            console.log(word.form[0].orth[0]);
            console.log(word.sense[0].def[0]);
        })

        console.log("BYL");

        res.status(200).json({
            data: data
        });

    }, (err) => {

        res.status(500).json({
            data: err
        });

    });

};

exports.scrapeDicio = (req, res) => {

    var request = require('request');

    var word = req.params.word;

    if (!_.isString(word) || word.trim().length == 0) {

        res.status(400).json({
            data: "Não vai dar não"
        });

    } else {

        var url = "https://www.dicio.com.br/" + word;

        request.get({url: url}, (err, httpResponse, body) => {

            webscraping.getWordInfo(body);

            res.status(200).json({
                data: body
            });

        });

    } 
}