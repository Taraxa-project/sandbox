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
        return res.status(500).json({error: 'Could not load requested compiler'});
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
    let output;
    try {
        output = JSON.parse(compiledRaw);
    } catch (e) {
        console.error(e)
        return res.status(500).json({error: 'Could not parse compiled contract'});
    }

    if (output.errors) {
        output.errors.forEach(oe => {
            if (oe.severity !== 'warning') {
                return res.status(500).json({error: 'Could not compile the contract: ' + output.errors[0].message});
            }
        })
    }
        
    compiled = output.contracts[name]

    res.json({
        name,
        solidityVersion,
        source,
        compiled
    })
}