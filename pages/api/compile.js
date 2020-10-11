import solc from 'solc';

export default async function handler(req, res) {
    const {solidityVersion, name, source} = req.body;
    let requestedSolc;
    try {
        requestedSolc = await new Promise((resolve, reject) => {
            const versionString = solidityVersion.replace(/\.js$/, '').replace(/^soljson-/, '')
            console.log('Getting remote solidity version', versionString);
            solc.loadRemoteVersion(versionString, (err, loaded) => {
                if (err) {
                    return reject(err);
                }
                resolve(loaded);
            })
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({error: 'Could not load requested version'});

    }

    let compiled = {};

    const input = {
        language: 'Solidity',
        sources: {},
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
    };

    input.sources[name] = {content: source};
    const output = JSON.parse(
        requestedSolc.compile(JSON.stringify(input), {})
    );

    if (output.errors) {
        return res.status(500).json({error: 'Could not compile the contract: ' + output.errors[0].message});
    } else {
        compiled = output.contracts[name]
    }

    res.json({
        name,
        solidityVersion,
        source,
        compiled
    })
}