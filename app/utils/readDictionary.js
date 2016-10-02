exports.readDictionary = (fileName) => {

    return new Promise((resolve, reject) => {

        try {

            fs.readFile(fileName, 'utf-8', (err, data) => {

                if (err) {

                    console.log(err);
                    reject(err);

                } else {

                    resolve(data);

                }

            });

        } catch (e) {

            reject(e);

        }


    });

}