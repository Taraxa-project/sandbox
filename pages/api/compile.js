import solc from 'solc';

export default async function handler(req, res) {
    const {solidityVersion, name, source} = req.body;
    let requestedSolc;
    try {
        requestedSolc = await new Promise((resolve, reject) => {
            const versionString = solidityVersion.replace(/\.js$/, '').replace(/^soljson-/, '')
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
    const compiledRaw = requestedSolc.compile(JSON.stringify(input))
    const output = JSON.parse(compiledRaw);

    if (output.errors) {
        output.errors.forEach(oe => {
            if (oe.severity !== 'warning') {
                return res.status(500).json({error: 'Could not compile the contract: ' + output.errors[0].message});
            }
        })
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