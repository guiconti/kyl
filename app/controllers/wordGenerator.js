var mongoose = require('mongoose');
var Word = mongoose.model('Word');

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