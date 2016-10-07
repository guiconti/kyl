exports.readDictionary = (fileName) => {

    return new Promise((resolve, reject) => {

        try {

            var xml2js = require('xml2js');
            var parser = new xml2js.Parser();

            fs.readFile(fileName, 'utf-8', (err, data) => {

                if (err) {

                    console.log(err);
                    reject(err);

                } else {

                    parser.parseString(data, (err, result) => {
                        
                        if (err) {

                            reject(err);

                        } else {

                            resolve(result);

                        }

                    });

                }

            });

        } catch (e) {

            reject(e);

        }


    });

}